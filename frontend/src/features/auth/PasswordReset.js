import React from 'react'
import * as forms from 'components/forms'
import { useInputChange } from 'helpers'
import Button from 'components/Button'
import Card from 'components/Card'

function PasswordReset() {
  const [input, onInputChange] = useInputChange({
    email: '',
  })
  const onSubmit = e => {
    e.preventDefault()

    console.log(input)
  }

  return (
    <div className="sm:max-w-xs">
      <Card className="p-8">
        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <forms.TextInput
              type="email"
              name="email"
              value={input.email}
              setValue={onInputChange}
              placeholder="foobar@example.com"
              required>
              Email
            </forms.TextInput>
          </div>

          <div className="mb-6 mt-8 flex items-center justify-between">
            <Button type="submit">Request Password Reset</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default PasswordReset
