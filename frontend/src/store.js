import { configureStore } from '@reduxjs/toolkit'
import auth from 'features/auth/store'
import chats from 'features/chats/store'
import discovery from 'features/discovery/store'

export default configureStore({
  reducer: {
    auth,
    chats,
    discovery,
  },
})
