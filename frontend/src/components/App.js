import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useWebSocket from 'react-use-websocket'
import config from 'conf'
import * as chats from 'features/chats/store'
import Card from 'components/Card'
import Chat from 'features/chats/Chat'
import NoChat from 'features/chats/NoChat'
import Conversations from 'features/chats/Conversations'
import Discovery from 'features/discovery/Discovery'

function App() {
  const dispatch = useDispatch()
  const openChat = useSelector(chats.SelectOpenConversation)
  const [sendMessage, lastMessage, readyState] = useWebSocket(
    config.api.websocket
  )

  useEffect(() => {
    dispatch(chats.SetSocketState({ readyState }))
  }, [dispatch, readyState])

  useEffect(() => {
    if (!lastMessage || lastMessage === null) {
      return
    }

    const message = JSON.parse(lastMessage.data)
    const participants = message.chat.participants.map((u) => ({
      id: u.id,
      name: u.username,
      picture: u.picture,
    }))
    const sender = participants.find((u) => u.id === message.user_id)

    dispatch(
      chats.Create({
        id: message.chat.id,
        name: sender.name,
        mini: sender.mini,
        picture: sender.picture,
        participants: participants,
      })
    )
    dispatch(
      chats.SetLastMessage({
        lastMessage: {
          user_id: message.user_id,
          body: message.body,
          chat: {
            id: message.chat.id,
            participants: participants,
          },
        },
      })
    )
  }, [lastMessage, dispatch])

  return (
    <div className="h-screen flex px-2 py-4">
      <aside className="w-16 h-full">
        <Conversations />
      </aside>

      <section className="flex-grow px-2">
        <Card className="h-full px-3 py-2">
          {openChat ? (
            <Chat id={openChat.id} sender={sendMessage} />
          ) : (
            <NoChat />
          )}
        </Card>
      </section>

      <section className="h-full w-64 lg:w-84 xl:w-96">
        <Discovery />
      </section>
    </div>
  )
}

export default App
