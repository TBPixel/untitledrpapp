import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      id: '',
      name: '',
      email: '',
      picture: '',
      mini: '',
    },
  },
  reducers: {
    Login: (state, action) => {
      const { id, name, email, picture, mini } = action.payload

      state.user = {
        id,
        name,
        email,
        picture,
        mini,
      }
    },
    Logout: (state) => {
      state.user = {
        id: '',
        name: '',
        email: '',
        picture: '',
        mini: '',
      }
    },
    Update: (state, action) => {
      const { picture, mini } = action.payload

      state.user.picture = picture
      state.user.mini = mini
    },
  },
})

export const { Login, Logout, Update } = slice.actions

export const SelectUser = (state) => {
  if (state.auth.user.id === '') {
    return null
  }

  return state.auth.user
}

export default slice.reducer
