import React from 'react'
import PropTypes from 'prop-types'

function Card({ children, className }) {
  return (
    <div className={`bg-gray-750 shadow-md rounded ${className || ''}`}>
      {children}
    </div>
  )
}

Card.propTypes = {
  className: PropTypes.string,
}

export default Card
