import React from 'react'
import PropTypes from 'prop-types'

function Tooltip({ children, tip, center }) {
  return (
    <div className="tooltip h-full" title={tip}>
      {children}

      <span
        className={`tooltip__text ${center ? 'tooltip__text--center' : ''}`}>
        {tip}
      </span>
    </div>
  )
}

Tooltip.propTypes = {
  tip: PropTypes.string.isRequired,
  center: PropTypes.bool,
}

export default Tooltip
