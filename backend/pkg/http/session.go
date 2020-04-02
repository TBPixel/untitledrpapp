package http

import (
	"github.com/gorilla/sessions"
)

const SessionName = "session"

type SessionStore struct {
	sessions.Store
}

func NewSessionStore(key []byte) *SessionStore {
	// Note: Don't store your key in your source code. Pass it via an
	// environmental variable, or flag (or both), and don't accidentally commit it
	// alongside your code. Ensure your key is sufficiently random - i.e. use Go's
	// crypto/rand or securecookie.GenerateRandomKey(32) and persist the result.
	return &SessionStore{
		sessions.NewCookieStore(key),
	}
}
