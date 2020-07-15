import React from 'react'
import { useDispatch } from 'react-redux'
import { MdSearch } from 'react-icons/md'
import config from 'conf'
import { useInputChange } from 'helpers'
import * as discovery from 'features/discovery/store'
import * as forms from 'components/forms'
import Button from 'components/Button'

function Form() {
  const dispatch = useDispatch()
  const [input, onInputChange] = useInputChange({
    query: '',
  })
  const onSearch = async (e) => {
    e.preventDefault()

    const res = await fetch(`${config.api.host}/api/active`, {
      credentials: 'include',
    })
    if (res.status !== 200) {
      return
    }
    const data = await res.json()
    const users = data.users.map((u) => ({
      id: u.id,
      name: u.name,
      picture: u.picture || '',
      mini: u.mini || '',
    }))

    dispatch(discovery.Empty())
    dispatch(discovery.PushUsers({ users }))
  }

  return (
    <form onSubmit={onSearch} className="flex" autoComplete="off">
      <div className="flex-grow pr-3">
        <forms.TextInput
          name="query"
          value={input.query}
          setValue={(e) => onInputChange(e, e.currentTarget.value)}
          placeholder="Search"
          hideLabel>
          Search
        </forms.TextInput>
      </div>

      <div>
        <Button type="submit">
          <MdSearch size={20} />
        </Button>
      </div>
    </form>
  )
}

export default Form
