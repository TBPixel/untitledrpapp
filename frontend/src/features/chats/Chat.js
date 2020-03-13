import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import * as chats from 'features/chats/store'
import Form from 'features/chats/Form'
import History from 'features/chats/History'
import MiniProfile from 'features/chats/MiniProfile'

function Chat({ id }) {
  const chat = useSelector(chats.SelectChatByID(id))

  return (
    <div className="flex flex-col h-full">
      <div className="h-20">
        <div className="min-h-full box-content border-b-2 border-gray-200 overflow-y-scroll">
          <MiniProfile
            name={chat.name}
            content={chat.mini}
            picture={chat.picture}
          />
        </div>
      </div>

      <div className="flex-grow pb-4">
        <History messages={chat.messages} participants={chat.participants} />
      </div>

      <div>
        <Form conversationID={id} name={chat.name} />
      </div>
    </div>
  )
}

Chat.propTypes = {
  id: PropTypes.number.isRequired,
}

export default Chat
