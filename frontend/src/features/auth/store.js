import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      id: 0,
      name: 'You',
      picture: 'https://placekitten.com/64/64',
      mini: '',
    },
  },
  reducers: {
    Login: (state, action) => {
      const { id, name, picture, mini } = action.payload

      state.user = {
        id,
        name,
        picture,
        mini,
      }
    },
    Register: (state, action) => {
      const { id, name } = action.payload

      state.user = {
        id,
        name,
        picture: '',
        mini: '',
      }
    },
    Logout: state => {
      state.user = {
        id: -1,
        name: '',
        picture: '',
        mini: '',
      }
    },
  },
})

export const { Login, Register, Logout } = slice.actions

export const SelectUser = state => {
  if (state.auth.user.id === -1) {
    return null
  }

  return state.auth.user
}

export default slice.reducer
