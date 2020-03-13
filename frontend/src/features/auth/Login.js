import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { useInputChange } from 'helpers'
import * as auth from 'features/auth/store'
import * as forms from 'components/forms'
import Button from 'components/Button'
import Card from 'components/Card'

function Login() {
  const [input, onInputChange] = useInputChange({
    username: '',
    password: '',
  })
  const dispatch = useDispatch()
  const onSubmit = e => {
    e.preventDefault()

    dispatch(auth.Login(input))
  }
  const user = useSelector(auth.SelectUser)

  return (
    <>
      {user ? (
        <Redirect to="/" />
      ) : (
        <div className="sm:max-w-xs">
          <Card className="p-8">
            <form onSubmit={onSubmit}>
              <div className="mb-6">
                <forms.TextInput
                  name="username"
                  value={input.username}
                  setValue={onInputChange}
                  placeholder="Foobar"
                  required>
                  Username
                </forms.TextInput>
              </div>

              <div className="mb-6">
                <forms.TextInput
                  type="password"
                  name="password"
                  value={input.password}
                  setValue={onInputChange}
                  placeholder="**************"
                  required>
                  Password
                </forms.TextInput>
              </div>

              <div className="mb-6 mt-8 flex items-center justify-between">
                <Button type="submit">Login</Button>
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
      )}
    </>
  )
}

export default Login
