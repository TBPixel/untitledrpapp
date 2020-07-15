import { configureStore } from '@reduxjs/toolkit'
import alerts from 'features/alerts/store'
import auth from 'features/auth/store'
import chats from 'features/chats/store'
import discovery from 'features/discovery/store'

export default configureStore({
  reducer: {
    alerts,
    auth,
    chats,
    discovery,
  },
})
