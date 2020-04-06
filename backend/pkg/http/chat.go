package http

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi"

	"github.com/tbpixel/rp-app/backend"
)

type ChatManager interface {
	Find(ChatID string) (*backend.Chat, error)
	Create(UserIDs ...string) *backend.Chat
}

func (s *Server) handleFindChat() http.HandlerFunc {
	type participant struct {
		ID      string `json:"id"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
		Mini    string `json:"mini"`
	}

	type response struct {
		ChatID       string        `json:"chat_id"`
		Participants []participant `json:"participants"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		chatID := chi.URLParam(r, "chatID")
		chat, err := s.chat.Find(chatID)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		var participants []participant
		for _, id := range chat.ParticipantIDs {
			u, err := s.user.Find(id)
			if err != nil {
				log.Printf("failed to lookup user %v for chat %v", id, chatID)
				continue
			}

			participants = append(participants, participant{
				ID:      u.ID,
				Name:    u.Name,
				Picture: u.Picture,
				Mini:    u.Mini,
			})
		}

		err = json.NewEncoder(w).Encode(&response{
			ChatID:       chatID,
			Participants: participants,
		})
		if err != nil {
			log.Printf("error encoding a json response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func (s *Server) handleChatCreate() http.HandlerFunc {
	type participant struct {
		ID      string `json:"id"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
		Mini    string `json:"mini"`
	}

	type request struct {
		Participants []string `json:"participants"`
	}

	type response struct {
		ChatID       string        `json:"chat_id"`
		Participants []participant `json:"participants"`
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

		session, err := s.sessions.Get(r, SessionName)
		if err != nil {
			// no return since error is non-fatal
			log.Printf("error while decoding session: %v", err)
		}

		user := session.Values["auth"].(*backend.User)
		ids := append(req.Participants, user.ID)
		var participants []participant
		for _, id := range ids {
			u, err := s.user.Find(id)
			if err != nil {
				log.Printf("cannot create chat with unknown user id %v", id)
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			ids = append(ids, u.ID)
			participants = append(participants, participant{
				ID:      u.ID,
				Name:    u.Name,
				Picture: u.Picture,
				Mini:    u.Mini,
			})
		}

		c := s.chat.Create(ids...)
		if err := s.hub.Create(c.ID, ids...); err != nil {
			log.Printf("error while creating chat: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		err = json.NewEncoder(w).Encode(&response{
			ChatID:       c.ID,
			Participants: participants,
		})
		if err != nil {
			log.Printf("error encoding a json response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}
