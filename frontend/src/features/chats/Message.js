import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWindowSize } from 'helpers'

function Message({ index, picture, body, participant, sentAt, setSize }) {
  const root = useRef()
  const [windowWidth] = useWindowSize()
  useEffect(() => {
    const msg = root.current
    if (msg) {
      setSize(index, msg.getBoundingClientRect().height)
    }
  }, [index, windowWidth, setSize])

  return (
    <div ref={root} className="flex">
      <div className="pr-1">
        {picture ? (
          <img src={picture} alt={`${participant.name}'s profile`} />
        ) : (
          `${participant.name}:`
        )}
      </div>
      <div>{body}</div>
    </div>
  )
}

Message.propTypes = {
  body: PropTypes.string.isRequired,
  sentAt: PropTypes.instanceOf(Date),
  participant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string,
  }).isRequired,
}

export default Message
