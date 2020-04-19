import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as chats from 'features/chats/store'
import TooltipButton from 'components/TooltipButton'

function Conversation({ id, name, picture, isFocussed }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const onOpen = () => {
    dispatch(chats.Focus({ id }))

    history.replace('/app')
  }

  return (
    <div className="h-16">
      <TooltipButton tip={name} center onClick={onOpen} isFocussed={isFocussed}>
        {picture ? (
          <img src={picture} alt={name} className="block object-cover" />
        ) : (
          <div className="flex justify-center items-center h-full">{name}</div>
        )}
      </TooltipButton>
    </div>
  )
}

Conversation.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isFocussed: PropTypes.bool.isRequired,
  picture: PropTypes.string,
}

export default Conversation
