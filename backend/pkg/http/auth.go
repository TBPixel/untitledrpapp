package http

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/tbpixel/rp-app/backend"
)

type AuthManager interface {
	Authenticate(email, password string) (*backend.User, error)
	Register(email, name, password string) (*backend.User, error)
}

func (s *Server) handleRegister() http.HandlerFunc {
	type request struct {
		Email           string `json:"email" validate:"required,email"`
		Name            string `json:"name" validate:"required"`
		Password        string `json:"password" validate:"required,eqfield=ConfirmPassword"`
		ConfirmPassword string `json:"confirm_password" validate:"required"`
	}

	type response struct {
		ID      string `json:"id"`
		Name    string `json:"name"`
		Email   string `json:"email"`
		Mini    string `json:"mini"`
		Picture string `json:"picture"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		var req request
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			log.Printf("error while decoding json: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		//err = validator.New().Struct(req)
		//if err != nil {
		//	for _, err := range err.(validator.ValidationErrors) {
		//		fmt.Println(err.Namespace())
		//		fmt.Println(err.Field())
		//		fmt.Println(err.StructNamespace())
		//		fmt.Println(err.StructField())
		//		fmt.Println(err.Tag())
		//		fmt.Println(err.ActualTag())
		//		fmt.Println(err.Kind())
		//		fmt.Println(err.Type())
		//		fmt.Println(err.Value())
		//		fmt.Println(err.Param())
		//		fmt.Println()
		//	}
		//
		//	w.WriteHeader(http.StatusUnprocessableEntity)
		//	return
		//}

		user, err := s.auth.Register(req.Email, req.Name, req.Password)
		if err != nil {
			log.Printf("error while trying to register user: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if err := s.createUserSession(user.ID, w, r); err != nil {
			log.Printf("error while saving user to session: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = json.NewEncoder(w).Encode(&response{
			ID:      user.ID,
			Name:    user.Name,
			Email:   user.Email,
			Mini:    user.Mini,
			Picture: user.Picture,
		})
		if err != nil {
			log.Printf("error encoding a json response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func (s *Server) handleLogin() http.HandlerFunc {
	type request struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}

	type response struct {
		ID      string `json:"id"`
		Name    string `json:"name"`
		Email   string `json:"email"`
		Mini    string `json:"mini"`
		Picture string `json:"picture"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		var req request
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			log.Printf("error while decoding json: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		//err = validator.New().Struct(req)
		//if err != nil {
		//	for _, err := range err.(validator.ValidationErrors) {
		//		fmt.Println(err.Namespace())
		//		fmt.Println(err.Field())
		//		fmt.Println(err.StructNamespace())
		//		fmt.Println(err.StructField())
		//		fmt.Println(err.Tag())
		//		fmt.Println(err.ActualTag())
		//		fmt.Println(err.Kind())
		//		fmt.Println(err.Type())
		//		fmt.Println(err.Value())
		//		fmt.Println(err.Param())
		//		fmt.Println()
		//	}
		//
		//	w.WriteHeader(http.StatusUnprocessableEntity)
		//	return
		//}

		user, err := s.auth.Authenticate(req.Email, req.Password)
		if err != nil {
			log.Printf("error while trying to login user: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if err := s.createUserSession(user.ID, w, r); err != nil {
			log.Printf("error while saving user to session: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = json.NewEncoder(w).Encode(&response{
			ID:      user.ID,
			Name:    user.Name,
			Email:   user.Email,
			Mini:    user.Mini,
			Picture: user.Picture,
		})
		if err != nil {
			log.Printf("error encoding a json response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func (s *Server) handleLogout() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, _ := s.sessions.Get(r, SessionName)

		session.Options.MaxAge = -1
		err := session.Save(r, w)
		if err != nil {
			log.Printf("error while deleting auth session: %v", err)
		}
	}
}

func (s *Server) createUserSession(id string, w http.ResponseWriter, r *http.Request) error {
	session, _ := s.sessions.Get(r, SessionName)
	session.Values["user_id"] = id

	return session.Save(r, w)
}

func (s *Server) expireUserSession(w http.ResponseWriter, r *http.Request) {
	session, _ := s.sessions.Get(r, SessionName)
	session.Options.MaxAge = -1
	if err := session.Save(r, w); err != nil {
		log.Printf("failed to expire session: %v", err)
	}
}

func (s *Server) authGuard(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, _ := s.sessions.Get(r, SessionName)

		id, ok := session.Values["user_id"].(string)
		if !ok {
			s.expireUserSession(w, r)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		u, err := s.user.Find(id)
		if err != nil {
			s.expireUserSession(w, r)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, backend.User{}, *u)
		handler.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *Server) guestGuard(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, _ := s.sessions.Get(r, SessionName)

		_, ok := session.Values["user_id"].(string)
		if ok {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		handler.ServeHTTP(w, r)
	})
}
