import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useFetch from 'use-http'
import { useInputChange } from 'helpers'
import config from 'conf'
import * as alerts from 'features/alerts/store'
import * as auth from 'features/auth/store'
import * as forms from 'components/forms'
import Card from 'components/Card'

function Settings() {
  const dispatch = useDispatch()
  const [picture, setPicture] = useState(null)
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
    const u = await request.put(`/api/users/${user.id}`, {
      picture: input.picture,
      mini: input.mini,
    })
    if (!response.ok) {
      return
    }

    dispatch(
      auth.Update({
        mini: u.mini,
        picture: u.picture,
      })
    )

    dispatch(
      alerts.Success({
        title: 'Profile updated!',
        message: 'Your profile has been updated!',
      })
    )
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
  }

  return (
    <section className="flex-grow px-4">
      <Card className="p-6">
        <form
          encType="multipart/form-data"
          onSubmit={handleFileUpload}
          action={`${config.api.host}/upload/users/${user.id}`}
          autoComplete="off">
          <div className="flex">
            <div className="w-1/3">
              <h4>Profile Picture</h4>
            </div>
            <div className="w-2/3">
              <div className="mb-8">
                <forms.ImageInput
                  name="picture"
                  value={picture}
                  setValue={setPicture}>
                  Profile Picture
                </forms.ImageInput>
              </div>
            </div>
          </div>
        </form>
      </Card>

      <form
        onSubmit={onSubmit}
        action={`${config.api.host}/api/users/${user.id}`}>
        <Card className="flex p-6">
          <div className="w-1/3">
            <h4>General</h4>
          </div>
          <div className="w-2/3">
            <div className="flex mb-8">
              <div className="w-1/2 mr-8">
                <forms.TextInput
                  name="name"
                  value={input.name}
                  setValue={(e) => onInputChange(e, e.currentTarget.value)}
                  placeholder="foobar"
                  disabled={true}>
                  Username
                </forms.TextInput>
              </div>

              <div className="w-1/2">
                <forms.TextInput
                  name="email"
                  value={input.email}
                  setValue={(e) => onInputChange(e, e.currentTarget.value)}
                  placeholder="foobar@example.com"
                  disabled={true}>
                  Email
                </forms.TextInput>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex p-6">
          <div className="w-1/3">
            <h4>Appearance</h4>
            <p></p>
          </div>
          <div className="w-2/3">
            <div className="mb-8">
              <forms.TextAreaInput
                name="mini"
                value={input.mini}
                setValue={(e) => onInputChange(e, e.currentTarget.value)}>
                Mini Profile
              </forms.TextAreaInput>
            </div>
          </div>
        </Card>
      </form>
    </section>
  )
}

export default Settings
