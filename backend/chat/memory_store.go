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

func (m *MemoryStore) FindByParticipants(ids ...string) *backend.Chat {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	for _, chat := range m.chats {
		diff := difference(ids, chat.ParticipantIDs)
		if len(diff) != 0 {
			continue
		}

		return chat
	}

	return nil
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

// difference returns the elements in `a` that aren't in `b`.
func difference(a, b []string) []string {
	mb := make(map[string]struct{}, len(b))
	for _, x := range b {
		mb[x] = struct{}{}
	}

	var diff []string
	for _, x := range a {
		if _, found := mb[x]; !found {
			diff = append(diff, x)
		}
	}

	return diff
}
