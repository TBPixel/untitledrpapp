import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'discovery',
  initialState: {
    users: [],
  },
  reducers: {
    PushUsers: (state, action) => {
      const { users } = action.payload

      state.users.push(...users)
    },
  },
})

export const { PushUsers } = slice.actions
export const SelectUsers = (state) => state.discovery.users

export default slice.reducer
