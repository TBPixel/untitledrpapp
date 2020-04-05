package chat

import (
	"fmt"
	"sync"

	"github.com/google/uuid"
	"github.com/tbpixel/rp-app/backend"
)

type MemoryStore struct {
	mutex *sync.RWMutex
	chats map[string]*backend.Chat
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		mutex: &sync.RWMutex{},
		chats: make(map[string]*backend.Chat),
	}
}

func (m *MemoryStore) Find(id string) (*backend.Chat, error) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	c, ok := m.chats[id]
	if !ok {
		return nil, fmt.Errorf("no chat with id %v found", id)
	}

	return c, nil
}

func (m *MemoryStore) Create(participants ...string) *backend.Chat {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	id := uuid.New().String()
	c := &backend.Chat{
		ID:             id,
		ParticipantIDs: participants,
	}

	m.chats[id] = c

	return c
}
