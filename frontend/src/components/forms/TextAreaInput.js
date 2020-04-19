import React from 'react'
import PropTypes from 'prop-types'
import TextAreaAutosize from 'react-textarea-autosize'
import Input from 'components/forms/Input'

const TextAreaInput = ({
  children,
  name,
  value,
  setValue,
  className,
  placeholder,
  hideLabel,
}) => (
  <Input name={name} label={children} hideLabel={hideLabel || false}>
    <TextAreaAutosize
      id={name}
      name={name}
      placeholder={placeholder}
      className={`${
        className || ''
      } block resize-none appearance-none bg-transparent border-b-4 border-gray-750 rounded w-full py-2 px-4 text-gray-200 leading-tight focus:outline-none focus:border-blue-500`}
      maxRows={4}
      value={value}
      onChange={(e) => setValue(e)}
    />
  </Input>
)

TextAreaInput.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  hideLabel: PropTypes.bool,
}

export default TextAreaInput
