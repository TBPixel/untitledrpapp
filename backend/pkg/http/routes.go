package http

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func (s *Server) route() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.SetHeader("Accept", "application/json"))
	r.Use(middleware.SetHeader("Content-Type", "application/json"))

	r.With(s.authGuard).Get("/connect", s.handleWebsocketConnect)
	r.With(middleware.Timeout(60*time.Second)).Route("/api", func(r chi.Router) {
		r.With(s.guestGuard).Post("/login", s.handleLogin())
		r.With(s.guestGuard).Post("/register", s.handleRegister())
		r.With(s.authGuard).Get("/logout", s.handleLogout())
	})

	return r
}
