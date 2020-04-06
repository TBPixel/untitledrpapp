import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'
import * as chats from 'features/chats/store'
import config from 'conf'
import App from 'components/App'
import Settings from 'features/settings/Settings'
import Conversations from 'features/chats/Conversations'
import SettingsButton from 'features/settings/SettingsButton'

const fetchChat = async (dispatch, { chat_id, user_id }) => {
  const res = await fetch(`${config.api.host}/api/chats/${chat_id}`, {
    credentials: 'include',
  })
  if (res.status !== 200) {
    console.error(res)
    return
  }

  const chat = await res.json()
  const participants = chat.participants.map((u) => ({
    id: u.id,
    name: u.name,
    picture: u.picture,
  }))
  const sender = participants.find((u) => u.id === user_id)

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

function AppConn() {
  const dispatch = useDispatch()
  const [sendMessage, lastMessage, readyState] = useWebSocket(
    config.api.websocket
  )
  const convos = useSelector(chats.SelectChats)

  useEffect(() => {
    dispatch(chats.SetSocketState({ readyState }))
  }, [readyState])

  useEffect(() => {
    if (!lastMessage || lastMessage === null) {
      return
    }

    const { chat_id, user_id, body } = JSON.parse(lastMessage.data)
    const exists = convos.find((c) => c.id === chat_id)
    if (!exists) {
      fetchChat(dispatch, { chat_id, user_id })
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
  }, [lastMessage])

  return (
    <div className="h-screen flex px-2 py-4">
      <aside className="flex flex-col justify-between w-16 h-full">
        <div className="flex-grow">
          <Conversations />
        </div>
        <div className="h-16">
          <SettingsButton />
        </div>
      </aside>
      <Switch>
        <Route path="/app/settings" component={Settings} />
        <Route path="/app">
          <App sendMessage={sendMessage} />
        </Route>
      </Switch>
    </div>
  )
}

export default AppConn