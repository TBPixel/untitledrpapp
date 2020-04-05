import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      id: '',
      name: '',
      picture: '',
      mini: '',
    },
  },
  reducers: {
    Login: (state, action) => {
      const { id, name } = action.payload

      state.user = {
        id,
        name,
        picture: '',
        mini: '',
      }
    },
    Logout: (state) => {
      state.user = {
        id: '',
        name: '',
        picture: '',
        mini: '',
      }
    },
  },
})

export const { Login, Logout } = slice.actions

export const SelectUser = (state) => {
  if (state.auth.user.id === '') {
    return null
  }

  return state.auth.user
}

export default slice.reducer
