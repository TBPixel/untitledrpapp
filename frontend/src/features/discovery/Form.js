import React from 'react'
import { MdSearch } from 'react-icons/md'
import { useInputChange } from 'helpers'
import * as forms from 'components/forms'
import Button from 'components/Button'

function Form() {
  const [input, onInputChange] = useInputChange({
    query: '',
  })
  const onSearch = e => {
    e.preventDefault()

    console.log(input)
  }

  return (
    <form onSubmit={onSearch} className="flex">
      <div className="flex-grow pr-3">
        <forms.TextInput
          name="query"
          value={input.query}
          setValue={onInputChange}
          placeholder="Search"
          required
          hideLabel
          className="border-gray-400">
          Search
        </forms.TextInput>
      </div>

      <div>
        <Button type="submit" disabled={!input.query}>
          <MdSearch size={20} />
        </Button>
      </div>
    </form>
  )
}

export default Form
