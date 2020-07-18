package http

import (
	"time"

	"github.com/TBPixel/untitledrpapp/internal/api"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func routes(services api.Services) *chi.Mux {
	r := chi.NewRouter()

	// Global middleware
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	// Handlers
	r.Get("/", api.HomeHandler())

	return r
}
