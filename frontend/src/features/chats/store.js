import { createSlice } from '@reduxjs/toolkit'
import { ReadyState } from 'react-use-websocket'

const windowProto = {
  id: '',
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
    socket: {
      state: ReadyState.CONNECTING,
      lastMessage: null,
    },
  },
  reducers: {
    Focus: (state, action) => {
      const { id } = action.payload
      const index = state.windows.findIndex((w) => w.id === id)
      if (index === -1) {
        return
      }

      state.open = index
    },
    Create: (state, action) => {
      const { id, name, picture, content, participants } = action.payload
      const index = state.windows.findIndex((w) => w.id === id)
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
      const index = state.windows.findIndex((w) => w.id === id)
      if (index === -1) {
        return
      }

      if (state.open === index) {
        state.open -= 1
      }

      state.windows.splice(index, 1)
    },
    PushMessage: (state, action) => {
      const { conversationID, participant, body } = action.payload
      const index = state.windows.findIndex((w) => w.id === conversationID)
      if (index === -1) {
        return
      }

      state.windows[index].messages.push({
        body,
        id: state.windows[index].messages.length + 1,
        participant: participant,
      })
    },
    SetSocketState: (state, action) => {
      const { readyState } = action.payload

      state.socket.state = readyState
    },
    SetLastMessage: (state, action) => {
      const { lastMessage } = action.payload

      state.socket.lastMessage = lastMessage
    },
  },
})

export const {
  Focus,
  Create,
  Destroy,
  PushMessage,
  SetSocketState,
  SetLastMessage,
} = slice.actions
export const SelectOpenConversation = (state) => {
  const open = state.chats.open
  if (open === -1) {
    return null
  }

  return state.chats.windows[open]
}
export const SelectChats = (state) => state.chats.windows
export const SelectChatByID = (id) => (state) => {
  const chat = state.chats.windows.find((w) => w.id === id)
  if (chat === undefined) {
    return null
  }

  return chat
}
export const SelectSocket = (state) => state.chats.socket
export const SelectLastMessage = (state) => state.chats.socket.lastMessage

export default slice.reducer
