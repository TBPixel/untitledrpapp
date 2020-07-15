export default {
  api: {
    host:
      process.env.NODE_ENV === 'production'
        ? 'https://app.untitledrp.app'
        : 'http://localhost:8080',
    websocket:
      process.env.NODE_ENV === 'production'
        ? 'wss://app.untitledrp.app/connect'
        : 'ws://localhost:8080/connect',
  },
}
