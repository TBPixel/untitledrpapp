import React from 'react'
import { useSelector } from 'react-redux'
import * as chats from 'features/chats/store'
import Conversation from 'features/chats/Conversation'

function Conversations() {
  const openChat = useSelector(chats.SelectOpenConversation)
  const conversations = useSelector(chats.SelectChats)

  return (
    <ul className="flex flex-col">
      {conversations.map((c) => (
        <li key={c.id} className="mb-1">
          <Conversation
            id={c.id}
            name={c.name}
            picture={c.picture}
            isFocussed={openChat !== null && openChat.id === c.id}
          />
        </li>
      ))}
    </ul>
  )
}

export default Conversations
