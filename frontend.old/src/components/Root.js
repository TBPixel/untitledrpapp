import React, { useEffect } from 'react'
import Routes from 'components/Routes'
import { useDispatch } from 'react-redux'
import useFetch from 'use-http'
import config from 'conf'
import * as auth from 'features/auth/store'
import Chrome from 'components/Chrome'

function Root() {
  const dispatch = useDispatch()
  const [request, response] = useFetch(config.api.host, {
    credentials: 'include',
  })

  useEffect(() => {
    const checkAuth = async () => {
      const user = await request.get('/api/me')
      if (!response.ok) {
        return
      }

      dispatch(
        auth.Login({
          id: user.id,
          name: user.name,
          email: user.email,
          mini: user.mini,
          picture: user.picture,
        })
      )
    }

    checkAuth()
    // ignored since we just wanna check if
    // the user is logged in on the first load
    // eslint-disable-next-line
  }, [])

  return (
    <Chrome>
      <Routes />
    </Chrome>
  )
}

export default Root
