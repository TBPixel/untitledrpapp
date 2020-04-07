import React, { useEffect } from 'react'
import Routes from 'components/Routes'
import { useDispatch } from 'react-redux'
import useFetch from 'use-http'
import config from 'conf'
import * as auth from 'features/auth/store'

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
        })
      )
    }

    checkAuth()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="bg-gray-200">
      <Routes />
    </div>
  )
}

export default Root
