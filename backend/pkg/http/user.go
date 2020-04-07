package http

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi"

	"github.com/tbpixel/rp-app/backend"
)

type UserManager interface {
	AddActive(user *backend.User)
	RemoveActive(id string)
	ListActive() []*backend.User
	Find(id string) (*backend.User, error)
	FindByName(name string) (*backend.User, error)
	Update(id string, user *backend.User) error
}

func (s *Server) handleMe() http.HandlerFunc {
	type response struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		session, err := s.sessions.Get(r, SessionName)
		if err != nil {
			// no return since error is non-fatal
			log.Printf("error while decoding session: %v", err)
		}

		user := session.Values["auth"].(*backend.User)

		err = json.NewEncoder(w).Encode(&response{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		})
		if err != nil {
			log.Printf("error encoding a json response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func (s *Server) handleFindUser() http.HandlerFunc {
	type response struct {
		ID      string `json:"id"`
		Name    string `json:"name"`
		Email   string `json:"email"`
		Picture string `json:"picture"`
		Mini    string `json:"mini"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		userID := chi.URLParam(r, "userID")
		user, err := s.user.Find(userID)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		err = json.NewEncoder(w).Encode(&response{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		})
		if err != nil {
			log.Printf("error encoding a json response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func (s *Server) handleUpdateUser() http.HandlerFunc {
	type request struct {
		Mini    string `json:"mini"`
		Picture string `json:"picture"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		userID := chi.URLParam(r, "userID")
		user, err := s.user.Find(userID)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		var req request
		err = json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			log.Printf("error while decoding json: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = s.user.Update(user.ID, &backend.User{
			ID:       user.ID,
			Email:    user.Email,
			Name:     user.Name,
			Password: user.Password,
			Mini:     req.Mini,
			Picture:  req.Picture,
		})
		if err != nil {
			log.Printf("error while updating user %v: %v", user.ID, err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func (s *Server) handleActiveUsers() http.HandlerFunc {
	type user struct {
		ID      string `json:"id"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
		Mini    string `json:"mini"`
	}

	type response struct {
		Users []user `json:"users"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		// empty slice to ensure non-nil written to json
		var active = []user{}
		users := s.user.ListActive()
		for _, u := range users {
			active = append(active, user{
				ID:      u.ID,
				Name:    u.Name,
				Picture: u.Picture,
				Mini:    u.Mini,
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
