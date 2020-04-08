import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import * as chats from 'features/chats/store'
import Conversation from 'features/chats/Conversation'
import SettingsButton from 'features/settings/SettingsButton'

function Sidebar() {
  const openChat = useSelector(chats.SelectOpenConversation)
  const conversations = useSelector(chats.SelectChats)
  const location = useLocation()

  return (
    <aside className="flex flex-col justify-between w-full h-full">
      <div className="flex-grow">
        <ul className="flex flex-col overflow-x-hidden overflow-y-auto">
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
      </div>

      <div className="h-16">
        <SettingsButton />
      </div>
    </aside>
  )
}

export default Sidebar
