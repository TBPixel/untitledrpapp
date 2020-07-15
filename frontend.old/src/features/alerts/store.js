import { createSlice } from '@reduxjs/toolkit'

export const LEVELS = ['info', 'warning', 'error', 'success']
const SUCCESS_CONGRATS = [
  'Noice!',
  'Nice!',
  'Killing it!',
  'Minkus!',
  'Yoooo!',
  "Let's go!",
]

/**
 * @typedef {Object} Alert
 * @property {String} title
 * @property {String} message
 * @property {String} level
 */

/**
 * notify returns an alert after validating the inputs.
 *
 * @param {String} title
 * @param {String} message
 * @param {String} level
 * @returns {Alert}
 */
function notify(title, message, level) {
  if (!String(title).length) {
    throw Error('alert title cannot be empty')
  }

  if (!String(message).length) {
    throw Error('alerts cannot be empty')
  }

  if (!LEVELS.includes(level)) {
    const levelStr = LEVELS.join(', ')
    throw Error(`alerts can only be of levels: ${levelStr}`)
  }

  return { title, message, level }
}

export const slice = createSlice({
  name: 'discovery',
  initialState: {
    notifications: [],
  },
  reducers: {
    Close: (state, action) => {
      const { index } = action.payload
      if (!state.notifications[index]) {
        return
      }

      state.notifications.splice(index, 1)
    },
    Notify: (state, action) => {
      const { title, message, level } = action.payload

      state.notifications.push(notify(title, message, level))
    },
    Info: (state, action) => {
      const { title, message } = action.payload

      state.notifications.push(notify(title, message, 'info'))
    },
    Warning: (state, action) => {
      const { title, message } = action.payload

      state.notifications.push(notify(title, message, 'warning'))
    },
    Error: (state, action) => {
      const { title, message } = action.payload

      state.notifications.push(notify(title, message, 'error'))
    },
    Success: (state, action) => {
      const { title, message } = action.payload
      const congrats =
        SUCCESS_CONGRATS[Math.floor(Math.random() * SUCCESS_CONGRATS.length)]

      state.notifications.push(
        notify(title, `${congrats} ${message}`, 'success')
      )
    },
  },
})

export const { Close, Notify, Info, Warning, Error, Success } = slice.actions
export const SelectAlerts = (state) => state.alerts.notifications

export default slice.reducer
