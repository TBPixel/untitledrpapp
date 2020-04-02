import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { useInputChange } from 'helpers'
import * as auth from 'features/auth/store'
import * as forms from 'components/forms'
import Button from 'components/Button'
import Card from 'components/Card'

function Register() {
  const [input, onInputChange] = useInputChange({
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
  })
  const onSubmit = e => {
    e.preventDefault()
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
                  name="email"
                  type="email"
                  value={input.email}
                  setValue={onInputChange}
                  placeholder="foobar@example.com"
                  required>
                  Email
                </forms.TextInput>
              </div>

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

              <div className="mb-6">
                <forms.TextInput
                  name="password_confirmation"
                  value={input.password_confirmation}
                  setValue={onInputChange}
                  placeholder="**************"
                  required>
                  Confirm Password
                </forms.TextInput>
              </div>

              <div className="mt-8 mb-4 flex justify-center">
                <Button type="submit">Register</Button>
              </div>

              <div className="flex justify-center">
                <Button styles="link">
                  <Link to="/login">Trying to Login?</Link>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  )
}

export default Register
