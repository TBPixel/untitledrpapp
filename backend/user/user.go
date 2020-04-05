package user

import (
	"sync"

	"github.com/tbpixel/rp-app/backend"
)

type Store interface {
	Find(id string) (*backend.User, error)
	FindByEmail(email string) (*backend.User, error)
	FindByName(name string) (*backend.User, error)
	Create(email, username, password string) (*backend.User, error)
}

// Manager provides full CRUD access to managing users
type Manager struct {
	store  Store
	mutex  *sync.RWMutex
	active map[string]*backend.User
}

// New creates a new user.Manager
func New(store Store) *Manager {
	return &Manager{
		store:  store,
		mutex:  &sync.RWMutex{},
		active: make(map[string]*backend.User),
	}
}

func (m *Manager) AddActive(user *backend.User) {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	m.active[user.ID] = user
}

func (m *Manager) RemoveActive(id string) {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	delete(m.active, id)
}

func (m *Manager) ListActive() []*backend.User {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	var users []*backend.User
	for _, u := range m.active {
		users = append(users, u)
	}

	return users
}

func (m *Manager) Find(id string) (*backend.User, error) {
	return m.store.Find(id)
}

func (m *Manager) FindByName(name string) (*backend.User, error) {
	return m.store.FindByName(name)
}
