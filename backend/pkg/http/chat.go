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
	FindByParticipants(UserIDs ...string) *backend.Chat
	Create(UserIDs ...string) *backend.Chat
}

func (s *Server) handleFindChat() http.HandlerFunc {
	type response struct {
		ID           string   `json:"id"`
		Participants []string `json:"participants"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		chatID := chi.URLParam(r, "chatID")
		chat, err := s.chat.Find(chatID)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		err = json.NewEncoder(w).Encode(&response{
			ID:           chat.ID,
			Participants: chat.ParticipantIDs,
		})
		if err != nil {
			log.Printf("error encoding a json response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func (s *Server) handleChatCreate() http.HandlerFunc {
	type request struct {
		Participants []string `json:"participants"`
	}

	type response struct {
		ChatID       string   `json:"chat_id"`
		Participants []string `json:"participants"`
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
		for _, id := range ids {
			_, err := s.user.Find(id)
			if err != nil {
				log.Printf("cannot create chat with unknown user id %v", id)
				http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
				return
			}
		}

		chat := s.chat.FindByParticipants(ids...)
		if chat == nil {
			chat = s.chat.Create(ids...)

			// ignore error because it just means a chat group
			// already exists, which is what the user wants
			_ = s.hub.Create(chat.ID, ids...)
		}

		err = json.NewEncoder(w).Encode(&response{
			ChatID:       chat.ID,
			Participants: ids,
		})
		if err != nil {
			log.Printf("error encoding a json response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}
