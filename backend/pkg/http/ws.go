package http

import (
	"context"
	"fmt"
	"log"
	"net/http"
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

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Hub provides a manager for many clients to connect
// and message via web sockets
type Hub struct {
	// app context for top-level cancellation
	context context.Context

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
	id   string
	hub  *Hub
	conn *websocket.Conn
	read chan *message
}

type move struct {
	chatID string
	client *client
}

type message struct {
	UserID string `json:"user_id"`
	ChatID string `json:"chat_id"`
	Body   string `json:"Body"`
}

// NewHub returns a websocket connection hub for broadcasting
// messages between clients
func NewHub(ctx context.Context) *Hub {
	return &Hub{
		context:    ctx,
		broadcast:  make(chan *message),
		connect:    make(chan *client),
		disconnect: make(chan *client),
		join:       make(chan *move),
		leave:      make(chan *move),
		clients:    make(map[string]*client),
		groups:     make(map[string]map[string]*client),
	}
}

// Listen infinitely loops all Hub channels and handles
// concurrent connections, disconnections and broadcasts
func (h *Hub) Listen() {
	for {
		select {
		case client := <-h.connect:
			h.clients[client.id] = client
		case client := <-h.disconnect:
			if _, ok := h.clients[client.id]; !ok {
				continue
			}

			delete(h.clients, client.id)
			close(client.read)
		case join := <-h.join:
			if _, ok := h.groups[join.chatID]; !ok {
				h.groups[join.chatID] = make(map[string]*client)
			}

			h.groups[join.chatID][join.client.id] = join.client
		case leave := <-h.leave:
			if _, ok := h.groups[leave.chatID][leave.client.id]; !ok {
				continue
			}

			delete(h.groups[leave.chatID], leave.client.id)

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
				delete(h.clients, client.id)
				close(client.read)
			}
		}
	}
}

// Upgrade performs a websocket upgrade on the requester and returns a client
//
// Implementors should call Listen on the client, either in a new goroutine or
// by reusing the http handler goroutine.
func (h *Hub) Upgrade(id string, w http.ResponseWriter, r *http.Request) (*client, error) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to upgrade client to websocket connection: %v", err)
	}
	return &client{
		id:   id,
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
	if _, exists := h.groups[chatID]; exists {
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
func (c *client) Listen() error {
	// enter the connection hub on Listen
	c.hub.connect <- c

	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.hub.disconnect <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	for {
		err := c.sending()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				return fmt.Errorf("client websocket closed while reading: %v", err)
			}

			return fmt.Errorf("error while reading from client websocket: %v", err)
		}

		err = c.receiving(ticker)
		if err != nil {
			log.Printf("error while writing to the client websocket: %v", err)
		}
	}
}

// todo: investigate sending and receiving to see if they block
func (c *client) sending() error {
	var msg message
	err := c.conn.ReadJSON(&msg)
	c.conn.ReadMessage()
	if err != nil {
		return err
	}
	c.hub.broadcast <- &msg

	return nil
}

func (c *client) receiving(ticker *time.Ticker) error {
	select {
	case msg, ok := <-c.read:
		c.conn.SetWriteDeadline(time.Now().Add(writeWait))
		if !ok {
			// The Hub closed the channel.
			return c.conn.WriteMessage(websocket.CloseMessage, []byte{})
		}

		err := c.conn.WriteJSON(msg)
		if err != nil {
			log.Printf("error while sending json message to client: %v", err)
			return nil
		}
	case <-ticker.C:
		c.conn.SetWriteDeadline(time.Now().Add(writeWait))
		if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
			return err
		}
	}

	return nil
}

func (s *Server) handleWebsocketConnect(w http.ResponseWriter, r *http.Request) {
	session, err := s.sessions.Get(r, SessionName)
	if err != nil {
		// no return since error is non-fatal
		log.Printf("error while decoding session: %v", err)
	}

	user := session.Values["auth"].(*backend.User)
	client, err := s.hub.Upgrade(user.ID, w, r)
	if err != nil {
		log.Println(err)
		return
	}

	// Listen in a new goroutine so existing http
	// resources can be freed up
	go client.Listen()
}
