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
	r.Use(middleware.Timeout(60 * time.Second))
	r.Use(CORS.Handler)

	// static files
	fs := http.FileServer(http.Dir("storage/local/"))
	r.Get("/static/", http.StripPrefix("/static/", fs).ServeHTTP)

	// websocket
	r.With(s.authGuard).Get("/connect", s.handleWebsocketConnect)

	r.With(s.authGuard).Route("/upload", func(r chi.Router) {
		r.Post("/users/{userID}/picture", s.handleUploadUserPicture())
	})

	// API
	r.Route("/api", func(r chi.Router) {
		r.Use(middleware.SetHeader("Accept", "application/json"))
		r.Use(middleware.SetHeader("Content-Type", "application/json"))

		r.With(s.guestGuard).Post("/login", s.handleLogin())
		r.With(s.guestGuard).Post("/register", s.handleRegister())
		r.With(s.authGuard).Get("/logout", s.handleLogout())

		r.With(s.authGuard).Post("/chats", s.handleChatCreate())
		r.With(s.authGuard).Get("/chats/{chatID}", s.handleFindChat())

		r.With(s.authGuard).Get("/me", s.handleMe())
		r.With(s.authGuard).Get("/active", s.handleActiveUsers())
		r.With(s.authGuard).Get("/users/{userID}", s.handleFindUser())
		r.With(s.authGuard).Put("/users/{userID}", s.handleUpdateUser())
	})

	return r
}
