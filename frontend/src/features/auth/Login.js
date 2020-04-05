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
        name: user.username,
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
        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <forms.TextInput
              name="email"
              value={input.email}
              setValue={onInputChange}
              placeholder="foobar@example.com"
              disabled={request.loading}
              required>
              Email
            </forms.TextInput>
          </div>

          <div className="mb-6">
            <forms.TextInput
              type="password"
              name="password"
              value={input.password}
              setValue={onInputChange}
              placeholder="**************"
              disabled={request.loading}
              required>
              Password
            </forms.TextInput>
          </div>

          <div className="mb-6 mt-8 flex items-center justify-between">
            <Button type="submit" disabled={request.loading}>
              Login
            </Button>
            <Button styles="plain">
              <Link to="/password-reset">Forgot Password?</Link>
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
