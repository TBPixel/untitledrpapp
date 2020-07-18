package http

import (
	"net/http"

	"github.com/TBPixel/untitledrpapp/internal/api"

	"github.com/go-chi/chi"
)

// NewMux returns an server-configured mux
// with URIs mapped to API handlers
func NewMux(services api.Services) Mux {
	router := routes(services)

	return Mux{
		router,
	}
}

// Mux wraps the internal router
// and implements http.Handler
type Mux struct {
	router *chi.Mux
}

// ServeHttp wraps the internal Mux' router
// and serves from the managed routes
func (m Mux) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	m.router.ServeHTTP(w, r)
}

// ListenAndServe wraps the go internal
// http.ListenAndServe to ensure availability
// while using this package
func ListenAndServe(addr string, mux http.Handler) error {
	return http.ListenAndServe(addr, mux)
}
