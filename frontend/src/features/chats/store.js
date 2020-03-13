import { createSlice } from '@reduxjs/toolkit'

const windowProto = {
  id: -1,
  name: '',
  mini: '',
  picture: '',
  messages: [],
  participants: [],
}

export const slice = createSlice({
  name: 'chats',
  initialState: {
    open: -1,
    windows: [],
  },
  reducers: {
    Focus: (state, action) => {
      const { id } = action.payload
      const index = state.windows.findIndex(w => w.id === id)
      if (index === -1) {
        return
      }

      state.open = index
    },
    Create: (state, action) => {
      const { id, name, picture, content, participants } = action.payload
      const index = state.windows.findIndex(w => w.id === id)
      if (index !== -1) {
        state.open = index
        return
      }

      const length = state.windows.push({
        ...windowProto,
        id,
        name,
        picture,
        participants,
        mini: content || '',
      })
      state.open = length - 1
    },
    Destroy: (state, action) => {
      const { id } = action.payload
      const index = state.windows.findIndex(c => c.id === id)
      if (index === -1) {
        return
      }

      if (state.open === index) {
        state.open -= 1
      }

      state.windows.splice(index, 1)
    },
    PushMessage: (state, action) => {
      const { conversationID, participantID, body } = action.payload
      const index = state.windows.findIndex(w => w.id === conversationID)
      if (index === -1) {
        return
      }

      state.windows[index].messages.push({
        body,
        id: state.windows[index].messages.length + 1,
        participant: participantID,
      })
    },
  },
})

export const { Focus, Create, Destroy, PushMessage } = slice.actions
export const SelectOpenConversation = state => {
  const open = state.chats.open
  if (open === -1) {
    return null
  }

  return state.chats.windows[open]
}
export const SelectChats = state => state.chats.windows
export const SelectChatByID = id => state => {
  const chat = state.chats.windows.find(w => w.id === id)
  if (chat === undefined) {
    return null
  }

  return chat
}

export default slice.reducer
