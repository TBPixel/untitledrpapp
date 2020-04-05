import React from 'react'
import PropTypes from 'prop-types'
import TextAreaAutosize from 'react-textarea-autosize'

const TextAreaInput = ({ value, setValue, className, placeholder }) => (
  <TextAreaAutosize
    placeholder={placeholder}
    className={`${className ||
      ''} block resize-none appearance-none bg-transparent border-b-4 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-700`}
    maxRows={4}
    value={value}
    onChange={e => setValue(e.currentTarget.value)}
  />
)

TextAreaInput.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
}

export default TextAreaInput
