package user

import (
	"errors"
	"fmt"
	"sync"

	"github.com/google/uuid"
	"github.com/tbpixel/rp-app/backend"
)

type MemoryStore struct {
	users      map[string]*backend.User
	emailIndex map[string]string
	nameIndex  map[string]string

	usersMutex *sync.RWMutex
	emailMutex *sync.RWMutex
	nameMutex  *sync.RWMutex
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		users:      make(map[string]*backend.User),
		emailIndex: make(map[string]string),
		nameIndex:  make(map[string]string),

		usersMutex: &sync.RWMutex{},
		emailMutex: &sync.RWMutex{},
		nameMutex:  &sync.RWMutex{},
	}
}

func (m *MemoryStore) Find(id string) (*backend.User, error) {
	m.usersMutex.RLock()
	defer m.usersMutex.RUnlock()

	u, ok := m.users[id]
	if !ok {
		return nil, errors.New("not found")
	}

	return u, nil
}

func (m *MemoryStore) FindByEmail(email string) (*backend.User, error) {
	m.emailMutex.RLock()
	defer m.emailMutex.RUnlock()

	id, ok := m.emailIndex[email]
	if !ok {
		return nil, errors.New("not found")
	}

	return m.Find(id)
}

func (m *MemoryStore) FindByName(name string) (*backend.User, error) {
	m.nameMutex.RLock()
	defer m.nameMutex.RUnlock()

	id, ok := m.nameIndex[name]
	if !ok {
		return nil, errors.New("not found")
	}

	return m.Find(id)
}

func (m *MemoryStore) Create(email, name, password string) (*backend.User, error) {
	if u, _ := m.FindByEmail(email); u != nil {
		return nil, errors.New("already exists")
	}

	id := uuid.New().String()
	u := &backend.User{
		ID:       id,
		Email:    email,
		Name:     name,
		Password: password,
	}

	m.usersMutex.Lock()
	defer m.usersMutex.Unlock()
	m.users[id] = u

	m.emailMutex.Lock()
	defer m.emailMutex.Unlock()
	m.emailIndex[email] = id

	m.nameMutex.Lock()
	defer m.nameMutex.Unlock()
	m.nameIndex[name] = id

	return u, nil
}

func (m *MemoryStore) Update(user *backend.User) error {
	m.usersMutex.Lock()
	defer m.usersMutex.Unlock()

	if _, exists := m.users[user.ID]; !exists {
		return fmt.Errorf("not found")
	}

	m.users[user.ID] = user

	return nil
}
