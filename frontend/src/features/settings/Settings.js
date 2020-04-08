import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useFetch from 'use-http'
import { useInputChange } from 'helpers'
import config from 'conf'
import * as auth from 'features/auth/store'
import * as forms from 'components/forms'
import Card from 'components/Card'

function Settings() {
  const dispatch = useDispatch()
  const user = useSelector(auth.SelectUser)
  const [request, response] = useFetch(config.api.host, {
    credentials: 'include',
  })
  const [input, onInputChange] = useInputChange({
    name: user.name,
    email: user.email,
    picture: user.picture,
    mini: user.mini,
  })

  const onSubmit = async () => {
    await request.put(`/api/users/${user.id}`, input)
    if (!response.ok) {
      return
    }

    // todo success message
  }

  return (
    <section className="flex-grow px-4">
      <Card className="h-full px-3 py-2">
        <form
          onSubmit={onSubmit}
          action={`${config.api.host}/api/users/${user.id}`}>
          <div className="flex">
            <div className="w-1/3">
              <h4>General</h4>
            </div>
            <div className="w-2/3">
              <div className="mb-6">
                <forms.TextInput
                  name="name"
                  value={input.name}
                  setValue={onInputChange}
                  placeholder="foobar"
                  disabled={true}>
                  Username
                </forms.TextInput>
              </div>

              <div className="mb-6">
                <forms.TextInput
                  name="email"
                  value={input.email}
                  setValue={onInputChange}
                  placeholder="foobar@example.com"
                  disabled={true}>
                  Email
                </forms.TextInput>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="w-1/3">
              <h4>Appearance</h4>
              <p></p>
            </div>
            <div className="w-2/3">
              <div className="mb-6">
                <forms.TextAreaInput
                  name="mini"
                  value={input.mini}
                  setValue={onInputChange}
                  placeholder="Your custom mini profile">
                  Mini
                </forms.TextAreaInput>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </section>
  )
}

export default Settings
