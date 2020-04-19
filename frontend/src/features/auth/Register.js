import React from 'react'
import useFetch from 'use-http'
import { Link, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import config from 'conf'
import { useInputChange } from 'helpers'
import * as auth from 'features/auth/store'
import * as forms from 'components/forms'
import Button from 'components/Button'
import Card from 'components/Card'

function Register() {
  const dispatch = useDispatch()
  const [request, response] = useFetch(config.api.host, {
    credentials: 'include',
  })
  const [input, onInputChange] = useInputChange({
    email: '',
    name: '',
    password: '',
    password_confirmation: '',
  })
  const onSubmit = async (e) => {
    e.preventDefault()

    // TODO: This should be email authenticated instead
    const user = await request.post('/api/register', input)

    if (!response.ok) {
      return
    }

    dispatch(
      auth.Login({
        id: user.id,
        email: user.email,
        name: user.name,
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
          action={`${config.api.host}/api/register`}
          autoComplete="off">
          <div className="mb-8">
            <forms.TextInput
              name="email"
              type="email"
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
              name="name"
              value={input.name}
              setValue={(e) => onInputChange(e, e.currentTarget.value)}
              placeholder="Foobar"
              disabled={request.loading}
              required>
              Username
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

          <div className="mb-8">
            <forms.TextInput
              type="password"
              name="password_confirmation"
              value={input.password_confirmation}
              setValue={(e) => onInputChange(e, e.currentTarget.value)}
              placeholder="**************"
              disabled={request.loading}
              required>
              Confirm Password
            </forms.TextInput>
          </div>

          <div className="mt-8 mb-4 flex justify-center">
            <Button type="submit" disabled={request.loading}>
              Register
            </Button>
          </div>

          <div className="flex justify-center">
            <Button styles="link">
              <Link to="/login">Trying to Login?</Link>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Register
