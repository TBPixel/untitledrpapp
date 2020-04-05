import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { VariableSizeList as List } from 'react-window'
import Message from 'features/chats/Message'

function History({ messages, participants }) {
  const chatHistoryRef = useRef()
  const listRef = useRef()

  const [listHeight, setListHeight] = useState(0)

  const sizeMap = useRef({})
  const getSize = useCallback((index) => sizeMap.current[index] || 60, [])
  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size }
    const list = listRef.current
    if (list) {
      list.resetAfterIndex(index)
    }
  }, [])

  useEffect(() => {
    const chatHistory = chatHistoryRef.current
    if (chatHistory) {
      setListHeight(chatHistory.offsetHeight)
    }
  }, [])

  return (
    <div ref={chatHistoryRef} className="h-full">
      <List
        width="100%"
        height={listHeight}
        itemCount={messages.length}
        itemSize={getSize}
        ref={listRef}>
        {({ index, style }) => (
          <div style={style}>
            <Message
              index={index}
              key={messages[index].id}
              body={messages[index].body}
              sentAt={messages[index].sentAt}
              setSize={setSize}
              participant={messages[index].participant}
            />
          </div>
        )}
      </List>
    </div>
  )
}

const participant = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
})

const message = PropTypes.shape({
  id: PropTypes.number.isRequired,
  body: PropTypes.string.isRequired,
  participant: participant.isRequired,
  sentAt: PropTypes.instanceOf(Date),
})

History.propTypes = {
  messages: PropTypes.arrayOf(message).isRequired,
  participants: PropTypes.arrayOf(participant).isRequired,
}

export default History
