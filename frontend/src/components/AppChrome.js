import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'
import * as auth from 'features/auth/store'
import * as chats from 'features/chats/store'
import { fetchUser } from 'features/auth/helpers'
import config from 'conf'
import App from 'components/App'
import Sidebar from 'components/Sidebar'
import Settings from 'features/settings/Settings'

const fetchChat = async (dispatch, { chat_id, sender_id, user_id }) => {
  const res = await fetch(`${config.api.host}/api/chats/${chat_id}`, {
    credentials: 'include',
  })
  if (res.status !== 200) {
    console.error(res)
    return
  }

  const chat = await res.json()
  const withoutYou = chat.participants.filter((uid) => uid !== user_id)
  const participants = await Promise.all(
    withoutYou.map(async (uid) => {
      const u = await fetchUser(uid)

      return {
        id: u.id,
        name: u.name,
        picture: u.picture,
      }
    })
  )
  const sender = participants.find((u) => u.id === sender_id)

  dispatch(
    chats.Create({
      id: chat.id,
      name: sender.name,
      mini: sender.mini,
      picture: sender.picture,
      participants: participants,
    })
  )
}

function AppChrome() {
  const dispatch = useDispatch()
  const [sendMessage, lastMessage, readyState] = useWebSocket(
    config.api.websocket
  )
  const convos = useSelector(chats.SelectChats)
  const user = useSelector(auth.SelectUser)

  useEffect(() => {
    dispatch(chats.SetSocketState({ readyState }))
  }, [readyState, dispatch])

  useEffect(() => {
    if (!lastMessage || lastMessage === null) {
      return
    }

    const { chat_id, user_id, body } = JSON.parse(lastMessage.data)
    const exists = convos.find((c) => c.id === chat_id)
    if (!exists) {
      fetchChat(dispatch, { chat_id, sender_id: user_id, user_id: user.id })
    }

    dispatch(
      chats.SetLastMessage({
        lastMessage: {
          chat_id: chat_id,
          user_id: user_id,
          body: body,
        },
      })
    )
  }, [lastMessage, convos, user.id, dispatch])

  return (
    <div className="h-full flex pt-3 px-4 pb-4">
      <div className="w-16 h-full">
        <Sidebar />
      </div>
      <Switch>
        <Route path="/app/settings" component={Settings} />
        <Route path="/app">
          <App sendMessage={sendMessage} />
        </Route>
      </Switch>
    </div>
  )
}

export default AppChrome
