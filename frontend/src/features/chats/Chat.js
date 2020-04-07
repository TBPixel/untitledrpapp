import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import * as chats from 'features/chats/store'
import Form from 'features/chats/Form'
import History from 'features/chats/History'
import MiniProfile from 'features/chats/MiniProfile'

function Chat({ id, sender }) {
  const dispatch = useDispatch()
  const textareaRef = useRef()
  const [textareaHeight, setTextareaHeight] = useState(0)
  const chat = useSelector(chats.SelectChatByID(id))
  const lastMessage = useSelector(chats.SelectLastMessage)
  useEffect(() => {
    if (!lastMessage) {
      return
    }

    if (lastMessage.chat_id !== id) {
      return
    }

    const sender = chat.participants.find((u) => u.id === lastMessage.user_id)

    dispatch(
      chats.PushMessage({
        conversationID: id,
        participant: sender,
        body: lastMessage.body,
      })
    )
  }, [lastMessage, id, dispatch, chat.participants])

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      setTextareaHeight(textarea.offsetHeight)
    }
  }, [textareaRef])

  return (
    <div className="flex flex-col h-full">
      <div className="h-20">
        <div className="min-h-full box-content border-b-2 border-gray-200 overflow-y-scroll">
          <MiniProfile
            name={chat.name}
            mini={chat.mini}
            picture={chat.picture}
          />
        </div>
      </div>

      <div className="flex-grow h-full pb-4">
        <History messages={chat.messages} textareaHeight={textareaHeight} />
      </div>

      <div className="flex-grow" ref={textareaRef}>
        <Form conversationID={id} name={chat.name} sender={sender} />
      </div>
    </div>
  )
}

Chat.propTypes = {
  id: PropTypes.string.isRequired,
  sender: PropTypes.func.isRequired,
}

export default Chat
