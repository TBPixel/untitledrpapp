import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import ReactResizeDetector from 'react-resize-detector'
import * as chats from 'features/chats/store'
import Card from 'components/Card'
import Form from 'features/chats/Form'
import History from 'features/chats/History'
import MiniProfile from 'features/chats/MiniProfile'

function Chat({ id, sender }) {
  const dispatch = useDispatch()
  const [height, setHeight] = useState(0)
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

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col flex-grow h-full">
        <div className="h-16">
          <div className="min-h-full box-content overflow-y-scroll">
            <MiniProfile
              name={chat.name}
              mini={chat.mini}
              picture={chat.picture}
            />
          </div>
        </div>

        <div className="flex-grow h-full pb-4 px-3">
          <History messages={chat.messages} textAreaHeight={height} />
        </div>
      </Card>

      <div className="flex-grow pt-3">
        <ReactResizeDetector
          handleHeight
          onResize={(_, h) => setHeight(h - 40)}>
          <Form conversationID={id} name={chat.name} sender={sender} />
        </ReactResizeDetector>
      </div>
    </div>
  )
}

Chat.propTypes = {
  id: PropTypes.string.isRequired,
  sender: PropTypes.func.isRequired,
}

export default Chat
