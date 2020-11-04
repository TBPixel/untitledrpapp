package http

import (
	"fmt"
	"net/http"
	"time"

	"github.com/TBPixel/untitledrpapp/internal/pkg/auth0"

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
	r.Use(middleware.SetHeader("content-type", "application/json"))

	// Public routes
	r.Get("/", api.HomeHandler())

	// Protected routes
	auth0Jwt := auth0.NewJwtMiddleware(services.Config.Auth0)
	r.With(auth0Jwt.Handler).Get("/protected", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "{}")
	})

	return r
}
