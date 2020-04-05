import React from 'react'
import PropTypes from 'prop-types'

function TextInput({
  children,
  required,
  type,
  name,
  placeholder,
  hideLabel,
  value,
  setValue,
  className,
  disabled,
}) {
  return (
    <>
      <label
        htmlFor={name}
        className={`${
          hideLabel ? 'sr-only' : ''
        } block text-gray-700 text-sm font-bold mb-2`}>
        {children}
      </label>
      <input
        onChange={(e) => setValue(e)}
        value={value || ''}
        name={name}
        type={type || 'text'}
        id={name}
        required={required}
        placeholder={placeholder}
        disabled={disabled || false}
        className={`${
          className || ''
        } appearance-none bg-transparent border-b-4 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-700`}
      />
    </>
  )
}

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'email']),
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  hideLabel: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}

export default TextInput
