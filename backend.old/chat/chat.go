package chat

import (
	"github.com/tbpixel/rp-app/backend"
)

type Store interface {
	Find(id string) (*backend.Chat, error)
	FindByParticipants(ids ...string) *backend.Chat
	Create(participants ...string) *backend.Chat
}

type Manager struct {
	store Store
}

func NewManager(store Store) *Manager {
	return &Manager{store}
}

func (m *Manager) Find(ChatID string) (*backend.Chat, error) {
	return m.store.Find(ChatID)
}

func (m *Manager) FindByParticipants(UserIDs ...string) *backend.Chat {
	return m.store.FindByParticipants(UserIDs...)
}

func (m *Manager) Create(UserIDs ...string) *backend.Chat {
	return m.store.Create(UserIDs...)
}
