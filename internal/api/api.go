package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/TBPixel/untitledrpapp/internal/configs"
)

// Services is an export expectation that
// some API handlers can choose to require,
// making it simple to pass a collection
// of services to a handle and to depend
// on those services as an API
type Services struct {
	Config configs.App
}

// HomeHandler provides a json response to
// a health check, returning a status and
// the current time. Anything outside of
// response is considered unhealthy.
//
// GET /
func HomeHandler() http.HandlerFunc {
	type response struct {
		Status string    `json:"status"`
		Time   time.Time `json:"time"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		res := response{
			Status: "healthy",
			Time:   time.Now(),
		}

		err := json.NewEncoder(w).Encode(&res)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}
