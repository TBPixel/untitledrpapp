import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { MdSend } from 'react-icons/md'
import * as auth from 'features/auth/store'
import * as chats from 'features/chats/store'
import * as forms from 'components/forms'
import Button from 'components/Button'

function Form({ name, conversationID, sender }) {
  const dispatch = useDispatch()
  const user = useSelector(auth.SelectUser)
  const [message, setMessage] = useState('')
  const send = useCallback(() => {
    sender(
      JSON.stringify({
        chat_id: conversationID,
        user_id: user.id,
        body: message,
      })
    )
  }, [conversationID, user.id, message, sender])
  const onSubmit = (e) => {
    e.preventDefault()

    if (!message) {
      return
    }

    send()

    dispatch(
      chats.PushMessage({
        conversationID,
        participant: user,
        body: message,
      })
    )

    setMessage('')
  }

  return (
    <form className="flex items-end" onSubmit={onSubmit}>
      <forms.TextAreaInput
        value={message}
        setValue={setMessage}
        placeholder={`Message ${name}`}
      />
      <div className="ml-2">
        <Button type="submit" disabled={!message}>
          <MdSend />
        </Button>
      </div>
    </form>
  )
}

Form.propTypes = {
  name: PropTypes.string.isRequired,
  conversationID: PropTypes.string.isRequired,
  sender: PropTypes.func.isRequired,
}

export default Form
