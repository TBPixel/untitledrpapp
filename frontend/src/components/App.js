import React from 'react'
import { useSelector } from 'react-redux'
import * as auth from 'features/auth/store'
import * as chats from 'features/chats/store'
import Home from 'components/Home'
import Card from 'components/Card'
import Chat from 'features/chats/Chat'
import NoChat from 'features/chats/NoChat'
import Conversations from 'features/chats/Conversations'
import Discovery from 'features/discovery/Discovery'

function App() {
  const user = useSelector(auth.SelectUser)
  const openChat = useSelector(chats.SelectOpenConversation)

  return (
    <>
      {user ? (
        <div className="h-full flex">
          <aside className="w-16 h-full">
            <Conversations />
          </aside>

          <section className="flex-grow px-2">
            <Card className="h-full px-3 py-2">
              {openChat ? <Chat id={openChat.id} /> : <NoChat />}
            </Card>
          </section>

          <section className="h-full w-64 lg:w-84 xl:w-96">
            <Discovery />
          </section>
        </div>
      ) : (
        <Home />
      )}
    </>
  )
}

export default App
