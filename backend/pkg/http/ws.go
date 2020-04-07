package http

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/tbpixel/rp-app/backend"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to receiving a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to sending the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

// Hub provides a manager for many clients to connect
// and message via web sockets
type Hub struct {
	// app context for top-level cancellation
	context context.Context

	user UserManager

	upgrader websocket.Upgrader

	// a lookup table for connected clients
	clients map[string]*client

	// a lookup table for open groups
	groups map[string]map[string]*client

	// connect adds a client to the clients
	connect chan *client

	// connect removes a client to the clients
	disconnect chan *client

	// join adds clients to a group
	join chan *move

	// leave removes clients from a group
	leave chan *move

	// broadcast emits messages to a groups clients
	broadcast chan *message
}

type client struct {
	user *backend.User

	hub  *Hub
	conn *websocket.Conn
	read chan *message
}

type move struct {
	chatID string
	client *client
}

type message struct {
	ChatID string `json:"chat_id"`
	UserID string `json:"user_id"`
	Body   string `json:"body"`
}

// NewHub returns a websocket connection hub for broadcasting
// messages between clients
func NewHub(domain string, user UserManager, ctx context.Context) *Hub {
	h := &Hub{
		context:    ctx,
		user:       user,
		broadcast:  make(chan *message),
		connect:    make(chan *client),
		disconnect: make(chan *client),
		join:       make(chan *move),
		leave:      make(chan *move),
		clients:    make(map[string]*client),
		groups:     make(map[string]map[string]*client),
	}

	h.upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("origin")

			return strings.Contains(origin, domain)
		},
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	return h
}

// Listen infinitely loops all Hub channels and handles
// concurrent connections, disconnections and broadcasts
func (h *Hub) Listen() {
	for {
		select {
		case client := <-h.connect:
			h.clients[client.user.ID] = client
			h.user.AddActive(client.user)
		case client := <-h.disconnect:
			if _, ok := h.clients[client.user.ID]; !ok {
				continue
			}

			h.user.RemoveActive(client.user.ID)
			delete(h.clients, client.user.ID)
			close(client.read)
		case join := <-h.join:
			if _, ok := h.groups[join.chatID]; !ok {
				h.groups[join.chatID] = make(map[string]*client)
			}

			h.groups[join.chatID][join.client.user.ID] = join.client
		case leave := <-h.leave:
			if _, ok := h.groups[leave.chatID][leave.client.user.ID]; !ok {
				continue
			}

			delete(h.groups[leave.chatID], leave.client.user.ID)

			// cleanup empty group references
			if len(h.groups[leave.chatID]) == 0 {
				delete(h.groups, leave.chatID)
			}
		case message := <-h.broadcast:
			group, ok := h.groups[message.ChatID]
			if !ok {
				continue
			}

			for _, client := range group {
				client.read <- message
			}
		case <-h.context.Done():
			close(h.connect)
			close(h.disconnect)
			close(h.join)
			close(h.leave)
			close(h.broadcast)
			for _, client := range h.clients {
				delete(h.clients, client.user.ID)
				close(client.read)
			}
		}
	}
}

// Upgrade performs a websocket upgrade on the requester and returns a client
//
// Implementors should call Listen on the client, either in a new goroutine or
// by reusing the http handler goroutine.
func (h *Hub) Upgrade(user *backend.User, w http.ResponseWriter, r *http.Request) (*client, error) {
	conn, err := h.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to upgrade client to websocket connection: %v", err)
	}
	return &client{
		user: user,
		hub:  h,
		conn: conn,
		read: make(chan *message),
	}, nil
}

// Create makes a new chat listener and tries to add
// all specified users into the listener.
//
// Returns an error if the chat already exists
func (h *Hub) Create(chatID string, userIDs ...string) error {
	if h.Exists(chatID) {
		return fmt.Errorf("chat with id %s already exists, try join instead", chatID)
	}

	for _, id := range userIDs {
		client, ok := h.clients[id]
		if !ok {
			// skip adding clients who aren't active
			// connections to the live connections
			continue
		}
		// Join implicitly creates a chat if it doesn't
		// exist. This is to remove the need for another
		// channel, but deserves a note for clarity.
		h.join <- &move{chatID, client}
	}

	return nil
}

// Exists returns whether a specific chat exists by it's ID or not
func (h *Hub) Exists(chatID string) bool {
	_, exists := h.groups[chatID]

	return exists
}

// Join adds a connected client to an existing listener
//
// Returns an error if the client could not be found or
// if the chat group could not be found
func (h *Hub) Join(userID, chatID string) error {
	client, ok := h.clients[userID]
	if !ok {
		return fmt.Errorf("no user with id %s is currently connected to the chat", userID)
	}
	if _, ok := h.groups[chatID]; !ok {
		return fmt.Errorf("no chat with id %s could be found to join; try creating a new chat instead", chatID)
	}

	h.join <- &move{chatID, client}

	return nil
}

// Leave removes a connected client from a chat listener
//
// Errors either if the client could not be
// found or the chat could not be found.
func (h *Hub) Leave(userID, chatID string) error {
	client, ok := h.clients[userID]
	if !ok {
		return fmt.Errorf("no user with id %s is currently connected to the chat", userID)
	}
	if _, ok := h.groups[chatID]; !ok {
		return fmt.Errorf("no chat with id %s could be found to leave", chatID)
	}

	h.leave <- &move{chatID, client}

	return nil
}

// Listen starts an infinite loop, reading and writing to
// the socket streams
//
// Listen should be called using a goroutine
func (c *client) Connect() {
	c.hub.connect <- c
}

func (c *client) Sending() {
	defer func() {
		c.hub.disconnect <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		var msg message
		if err := c.conn.ReadJSON(&msg); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error %v", err)
			}
			break
		}

		c.hub.broadcast <- &msg
	}
}

func (c *client) Receiving() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case msg, ok := <-c.read:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if c != nil && msg.UserID == c.user.ID {
				continue
			}

			err := c.conn.WriteJSON(&msg)
			if err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (s *Server) handleWebsocketConnect(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(backend.User{}).(backend.User)
	client, err := s.hub.Upgrade(&user, w, r)
	if err != nil {
		log.Println(err)
		return
	}

	client.Connect()
	// Listen in a new goroutine so existing http
	// resources can be freed up
	go client.Receiving()
	go client.Sending()
}
