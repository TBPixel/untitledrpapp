import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { MdSend } from 'react-icons/md'
import * as auth from 'features/auth/store'
import * as chats from 'features/chats/store'
import * as forms from 'components/forms'
import Button from 'components/Button'

function Form({ name, conversationID }) {
  const dispatch = useDispatch()
  const user = useSelector(auth.SelectUser)

  const [message, setMessage] = useState('')
  const onSubmit = e => {
    e.preventDefault()

    if (!message) {
      return
    }

    console.log({
      conversationID,
      participantID: user.id,
      body: message,
    })

    dispatch(
      chats.PushMessage({
        conversationID,
        participantID: user.id,
        body: message,
      })
    )

    setMessage('')
  }

  return (
    <form className="flex" onSubmit={onSubmit}>
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
  conversationID: PropTypes.number.isRequired,
}

export default Form
