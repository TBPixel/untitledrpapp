package http

import (
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

func (s *Server) route() http.Handler {
	r := chi.NewRouter()
	CORS := cors.New(cors.Options{
		AllowOriginFunc: func(r *http.Request, origin string) bool {
			return strings.Contains(origin, s.domain)
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.SetHeader("Accept", "application/json"))
	r.Use(middleware.SetHeader("Content-Type", "application/json"))
	r.Use(CORS.Handler)

	r.With(s.authGuard).Get("/connect", s.handleWebsocketConnect)
	r.With(middleware.Timeout(60*time.Second)).Route("/api", func(r chi.Router) {
		r.With(s.guestGuard).Post("/login", s.handleLogin())
		r.With(s.guestGuard).Post("/register", s.handleRegister())
		r.With(s.authGuard).Get("/logout", s.handleLogout())

		r.With(s.authGuard).Post("/chats", s.handleChatCreate())
		r.With(s.authGuard).Get("/chats/{chatID}", s.handleFindChat())

		r.With(s.authGuard).Get("/me", s.handleMe())
		r.With(s.authGuard).Get("/active", s.handleActiveUsers())
	})

	return r
}
