import React from 'react'
import useFetch from 'use-http'
import { useDispatch } from 'react-redux'
import { MdSearch } from 'react-icons/md'
import config from 'conf'
import { useInputChange } from 'helpers'
import * as discovery from 'features/discovery/store'
import * as forms from 'components/forms'
import Button from 'components/Button'

function Form() {
  const dispatch = useDispatch()
  const [request, response] = useFetch(config.api.host, {
    credentials: 'include',
  })
  const [input, onInputChange] = useInputChange({
    query: '',
  })
  const onSearch = async (e) => {
    e.preventDefault()

    const data = await request.get('/api/active')
    if (!response.ok) {
      return
    }
    const users = data.users.map((u) => ({
      id: u.id,
      name: u.username,
      picture: u.picture || '',
      content: u.content || '',
    }))

    dispatch(discovery.Empty())
    dispatch(discovery.PushUsers({ users }))
  }

  return (
    <form onSubmit={onSearch} className="flex">
      <div className="flex-grow pr-3">
        <forms.TextInput
          name="query"
          value={input.query}
          setValue={onInputChange}
          placeholder="Search"
          hideLabel
          className="border-gray-400"
          disabled={request.loading}>
          Search
        </forms.TextInput>
      </div>

      <div>
        <Button type="submit" disabled={request.loading}>
          <MdSearch size={20} />
        </Button>
      </div>
    </form>
  )
}

export default Form
