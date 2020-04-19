import React from 'react'
import PropTypes from 'prop-types'
import Input from 'components/forms/Input'

const TextInput = ({
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
}) => (
  <Input name={name} label={children} hideLabel={hideLabel}>
    <input
      onChange={(e) => setValue(e)}
      value={value || ''}
      name={name}
      type={type || 'text'}
      id={name}
      required={required}
      placeholder={placeholder}
      disabled={disabled || false}
      className={`${className || ''} ${
        disabled ? 'opacity-50' : ''
      } appearance-none bg-transparent border-b-4 border-gray-750 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:border-blue-500`}
    />
  </Input>
)

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
