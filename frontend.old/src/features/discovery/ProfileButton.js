import React from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import config from 'conf'
import * as auth from 'features/auth/store'
import * as chats from 'features/chats/store'
import { fetchUser } from 'features/auth/helpers'
import MiniProfile from 'features/chats/MiniProfile'

function ProfileButton({ id, name, picture, mini }) {
  const dispatch = useDispatch()
  const [request, response] = useFetch(config.api.host, {
    credentials: 'include',
  })
  const user = useSelector(auth.SelectUser)
  const history = useHistory()

  const onClick = async () => {
    const chat = await request.post('/api/chats', {
      participants: [id],
    })
    if (!response.ok) {
      return
    }

    const withoutYou = chat.participants.filter((uid) => uid !== user.id)
    const participants = await Promise.all(
      withoutYou.map(async (uid) => {
        const u = await fetchUser(uid)

        return {
          id: u.id,
          name: u.name,
          picture: u.picture,
        }
      })
    )

    dispatch(chats.Create({ id: chat.chat_id, name, participants }))

    history.replace('/app')
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
