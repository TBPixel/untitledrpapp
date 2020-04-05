package user

import (
	"errors"
	"fmt"
	"log"

	"github.com/tbpixel/rp-app/backend/pkg/hash"

	"github.com/tbpixel/rp-app/backend"
)

type Auth struct {
	store Store
}

func NewAuth(store Store) *Auth {
	return &Auth{store}
}

func (a Auth) Authenticate(email, password string) (*backend.User, error) {
	u, err := a.store.FindByEmail(email)
	if err != nil {
		return nil, fmt.Errorf("failed to find user with email %s to authenticate", email)
	}

	if !hash.PasswordCheck(password, u.Password) {
		return nil, errors.New("no user with that matching email and password")
	}

	return u, nil
}

func (a Auth) Register(email, username, password string) (*backend.User, error) {
	p, err := hash.Password(password)
	if err != nil {
		log.Printf("error while attempting to hash password: %v", err)
		return nil, fmt.Errorf("failed to secure given password")
	}

	u, err := a.store.Create(email, username, p)
	if err != nil {
		return nil, fmt.Errorf("failed to register new user: %v", err)
	}

	return u, nil
}
