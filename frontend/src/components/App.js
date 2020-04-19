import React from 'react'
import { useSelector } from 'react-redux'
import * as chats from 'features/chats/store'
import Chat from 'features/chats/Chat'
import NoChat from 'features/chats/NoChat'
import Discovery from 'features/discovery/Discovery'

function App({ sendMessage }) {
  const openChat = useSelector(chats.SelectOpenConversation)

  return (
    <>
      <section className="flex-grow px-4">
        {openChat ? <Chat id={openChat.id} sender={sendMessage} /> : <NoChat />}
      </section>

      <section className="h-full w-64 lg:w-84 xl:w-96">
        <Discovery />
      </section>
    </>
  )
}

export default App
