import React from 'react'
import PropTypes from 'prop-types'

const allStyles = {
  simple:
    'block w-full bg-blue-500 hover:bg-blue-400 focus:outline-none text-white font-bold py-2 px-4 border-b-4 border-blue-700 rounded hover:border-blue-500 active:border-transparent transition-colors duration-75 ease-linear',
  transparent:
    'block w-full hover:bg-blue-200 active:bg-blue-300 focus:outline-none rounded transition-colors duration-75 ease-linear',
  borderBottom:
    'block w-full border-b-4 border-gray-400 hover:border-blue-500 focus:border-blue-500 focus:outline-none rounded transition-colors duration-75 ease-linear overflow-hidden',
  plain: 'block w-full text-blue-500 hover:text-blue-800 font-bold',
  link: 'inline-block text-blue-500 hover:text-blue-800',
}

function Button({ children, styles, className, type, disabled, onClick }) {
  return (
    <button
      className={
        (allStyles[styles] || allStyles['simple']) +
        `${disabled ? ' opacity-50 cursor-not-allowed' : ''}` +
        ` ${className || ''}`
      }
      type={type || 'button'}
      onClick={onClick}
      disabled={disabled || false}>
      {children}
    </button>
  )
}

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit']),
  styles: PropTypes.oneOf(Object.keys(allStyles)),
  disabled: PropTypes.bool,
}

export default Button
