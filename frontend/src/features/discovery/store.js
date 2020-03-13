import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'discovery',
  initialState: {
    users: [],
    pagination: {
      current: 1,
    },
  },
  reducers: {
    PushUsers: (state, action) => {
      const { users, currentPage } = action.payload

      state.users.push(...users)
      state.pagination.current = currentPage
    },
  },
})

export const { PushUsers } = slice.actions
export const SelectUsers = state => state.discovery.users

export default slice.reducer
