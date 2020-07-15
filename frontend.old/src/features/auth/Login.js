import React from 'react'
import useFetch from 'use-http'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import config from 'conf'
import { useInputChange } from 'helpers'
import * as auth from 'features/auth/store'
import * as forms from 'components/forms'
import Button from 'components/Button'
import Card from 'components/Card'

function Login() {
  const [request, response] = useFetch(config.api.host, {
    credentials: 'include',
  })
  const [input, onInputChange] = useInputChange({
    email: '',
    password: '',
  })
  const dispatch = useDispatch()
  const onSubmit = async (e) => {
    e.preventDefault()

    const user = await request.post('/api/login', input)
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
  const user = useSelector(auth.SelectUser)
  if (user !== null) {
    return <Redirect to="/app" />
  }

  return (
    <div className="sm:max-w-xs">
      <Card className="p-8">
        <form
          onSubmit={onSubmit}
          action={`${config.api.host}/api/login`}
          autoComplete="off">
          <div className="mb-8">
            <forms.TextInput
              name="email"
              value={input.email}
              setValue={(e) => onInputChange(e, e.currentTarget.value)}
              placeholder="foobar@example.com"
              disabled={request.loading}
              required>
              Email
            </forms.TextInput>
          </div>

          <div className="mb-8">
            <forms.TextInput
              type="password"
              name="password"
              value={input.password}
              setValue={(e) => onInputChange(e, e.currentTarget.value)}
              placeholder="**************"
              disabled={request.loading}
              required>
              Password
            </forms.TextInput>
          </div>

          <div className="mb-8 mt-8 flex items-center justify-between">
            <Button type="submit" disabled={request.loading}>
              Login
            </Button>
          </div>

          <div className="flex justify-center">
            <Button styles="link">
              <Link to="/register">Trying to Register?</Link>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Login
