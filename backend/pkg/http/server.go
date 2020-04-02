package http

import (
	"context"
	"net/http"
)

// Server provides an HTTP implementation for the application
type Server struct {
	auth     AuthManager
	context  context.Context
	hub      *Hub
	sessions *SessionStore
}

// NewServer pre-constructs a server instance
func NewServer(auth AuthManager, sessions *SessionStore, hub *Hub, context context.Context) *Server {
	s := &Server{
		auth:     auth,
		context:  context,
		hub:      hub,
		sessions: sessions,
	}

	return s
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.route().ServeHTTP(w, r)
}
