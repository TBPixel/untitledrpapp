import React from 'react'
import PropTypes from 'prop-types'

const Input = ({ children, name, label, hideLabel }) => (
  <>
    {label && (
      <label
        htmlFor={name}
        className={`${
          hideLabel ? 'sr-only' : ''
        } block text-gray-500 text-sm font-bold mb-2`}>
        {label}
      </label>
    )}
    {children}
  </>
)

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hideLabel: PropTypes.bool,
}

export default Input
