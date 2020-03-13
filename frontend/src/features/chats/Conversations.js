import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as auth from 'features/auth/store'
import * as chats from 'features/chats/store'
import Conversation from 'features/chats/Conversation'

function Conversations() {
  const dispatch = useDispatch()

  const user = useSelector(auth.SelectUser)
  const openChat = useSelector(chats.SelectOpenConversation)
  const conversations = useSelector(chats.SelectChats)

  useEffect(() => {
    dispatch(
      chats.Create({
        id: 0,
        name: user.name,
        mini: user.mini,
        picture: user.picture,
        participants: [user],
      })
    )
  }, [])

  return (
    <ul className="flex flex-col">
      {conversations.map(c => (
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
