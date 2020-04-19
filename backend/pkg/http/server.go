package http

import (
	"context"
	"net/http"

	"github.com/gorilla/sessions"
)

// Server provides an HTTP implementation for the application
type Server struct {
	domain string

	auth    AuthManager
	chat    ChatManager
	user    UserManager
	storage FileStorer

	context  context.Context
	hub      *Hub
	sessions sessions.Store
}

// NewServer pre-constructs a server instance
func NewServer(domain string, auth AuthManager, chat ChatManager, user UserManager, storage FileStorer, sessions sessions.Store, hub *Hub, context context.Context) *Server {
	s := &Server{
		domain:   domain,
		auth:     auth,
		chat:     chat,
		user:     user,
		storage:  storage,
		context:  context,
		hub:      hub,
		sessions: sessions,
	}

	return s
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.route().ServeHTTP(w, r)
}
