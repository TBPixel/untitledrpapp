import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import * as chats from 'features/chats/store'
import Button from 'components/Button'
import TooltipButton from 'components/TooltipButton'

function Conversation({ id, name, picture, isFocussed }) {
  const dispatch = useDispatch()
  const onOpen = () => dispatch(chats.Focus({ id }))

  return (
    <div className="h-16">
      {picture ? (
        <TooltipButton
          tip={name}
          center
          onClick={onOpen}
          isFocussed={isFocussed}>
          <img src={picture} alt={name} className="block object-cover" />
        </TooltipButton>
      ) : (
        <Button
          onClick={onOpen}
          styles="borderBottom"
          className={`${isFocussed ? 'border-blue-500' : ''} h-full`}>
          <div className="flex justify-center items-center h-full">{name}</div>
        </Button>
      )}
    </div>
  )
}

Conversation.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  isFocussed: PropTypes.bool.isRequired,
  picture: PropTypes.string,
}

export default Conversation
