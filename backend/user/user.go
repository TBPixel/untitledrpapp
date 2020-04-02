package user

import (
	"errors"
	"fmt"

	"github.com/tbpixel/rp-app/backend"
)

type Auth struct {
	store Store
}

func NewAuth(store Store) *Auth {
	return &Auth{store}
}

type Store interface {
	FindFromEmail(email string) (*backend.User, error)
	Create(email, username, password string) (*backend.User, error)
}

func (a Auth) Authenticate(email, password string) (*backend.User, error) {
	u, err := a.store.FindFromEmail(email)
	if err != nil {
		return nil, fmt.Errorf("failed to find user with email %s to authenticate", email)
	}

	// TODO: compare password hashes
	if password != u.Password {
		return nil, errors.New("no user with that matching email and password")
	}

	return u, nil
}

func (a Auth) Register(email, username, password string) (*backend.User, error) {
	u, _ := a.store.FindFromEmail(email)
	if u != nil {
		return nil, fmt.Errorf("a user with the email %s already exists", email)
	}

	u, err := a.store.Create(email, username, password)
	if err != nil {
		return nil, fmt.Errorf("failed to register new user: %v", err)
	}

	return u, nil
}

type MemoryStore struct {
	users map[string]*backend.User
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		users: make(map[string]*backend.User),
	}
}

func (m *MemoryStore) FindFromEmail(email string) (*backend.User, error) {
	u, ok := m.users[email]
	if !ok {
		return nil, errors.New("not found")
	}

	return u, nil
}

func (m *MemoryStore) Create(email, username, password string) (*backend.User, error) {
	_, ok := m.users[email]
	if ok {
		return nil, errors.New("already exists")
	}

	u := &backend.User{
		Email:    email,
		Name:     username,
		Password: password,
	}
	m.users[email] = u

	return u, nil
}
