package http

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/tbpixel/rp-app/backend"
)

type UserManager interface {
	AddActive(user *backend.User)
	RemoveActive(id string)
	ListActive() []*backend.User
	Find(id string) (*backend.User, error)
	FindByName(name string) (*backend.User, error)
}

func (s *Server) handleMe() http.HandlerFunc {
	type response struct {
		ID       string `json:"id"`
		Username string `json:"username"`
		Email    string `json:"email"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		session, err := s.sessions.Get(r, SessionName)
		if err != nil {
			// no return since error is non-fatal
			log.Printf("error while decoding session: %v", err)
		}

		user := session.Values["auth"].(*backend.User)

		err = json.NewEncoder(w).Encode(&response{
			ID:       user.ID,
			Username: user.Name,
			Email:    user.Email,
		})
		if err != nil {
			log.Printf("error encoding a json response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func (s *Server) handleActiveUsers() http.HandlerFunc {
	type user struct {
		ID       string `json:"id"`
		Username string `json:"username"`
	}

	type response struct {
		Users []user `json:"users"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		var active []user
		users := s.user.ListActive()
		for _, u := range users {
			active = append(active, user{
				ID:       u.ID,
				Username: u.Name,
			})
		}

		err := json.NewEncoder(w).Encode(&response{
			Users: active,
		})
		if err != nil {
			log.Printf("error encoding a json response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}
