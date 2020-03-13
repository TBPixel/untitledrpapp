import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import * as auth from 'features/auth/store'
import * as chats from 'features/chats/store'
import MiniProfile from 'features/chats/MiniProfile'

function ProfileButton({ id, name, picture, content }) {
  const dispatch = useDispatch()
  const user = useSelector(auth.SelectUser)

  const onClick = () => {
    dispatch(
      chats.Create({
        id,
        name,
        content,
        picture,
        participants: [user, { id, name, picture }],
      })
    )
  }

  return (
    <button onClick={onClick} className="block w-full h-16">
      <MiniProfile name={name} picture={picture} content={content} />
    </button>
  )
}

ProfileButton.propTypes = {
  picture: PropTypes.string,
  content: PropTypes.string,
  name: PropTypes.string.isRequired,
}

export default ProfileButton
