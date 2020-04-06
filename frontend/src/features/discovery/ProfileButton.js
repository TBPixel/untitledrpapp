import React from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { useDispatch } from 'react-redux'
import config from 'conf'
import * as chats from 'features/chats/store'
import MiniProfile from 'features/chats/MiniProfile'

function ProfileButton({ id, name, picture, mini }) {
  const dispatch = useDispatch()
  const [request, response] = useFetch(config.api.host, {
    credentials: 'include',
  })

  const onClick = async () => {
    const chat = await request.post('/api/chats', {
      participants: [id],
    })
    if (!response.ok) {
      return
    }

    const participants = chat.participants.map((u) => ({
      id: u.id,
      name: u.username,
      picture: u.picture || '',
      mini: u.mini || '',
    }))

    dispatch(chats.Create({ id: chat.chat_id, name, participants }))
  }

  return (
    <button onClick={onClick} className="block w-full">
      <MiniProfile name={name} picture={picture} mini={mini} />
    </button>
  )
}

ProfileButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  picture: PropTypes.string,
  mini: PropTypes.string,
}

export default ProfileButton
