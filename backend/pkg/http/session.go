package http

import (
	"encoding/gob"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/tbpixel/rp-app/backend"
)

const SessionName = "sess"

func NewSessionStore(key []byte, path string) sessions.Store {
	cs := sessions.NewFilesystemStore(path, key)
	cs.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 30,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	}

	gob.Register(&backend.User{})

	return cs
}
