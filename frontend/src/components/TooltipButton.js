import React from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'

const TooltipButton = ({ children, tip, center, onClick, isFocussed }) => (
  <div className="tooltip h-full" title={tip}>
    {onClick ? (
      <Button
        onClick={onClick}
        styles="borderBottom"
        className={`${isFocussed ? 'border-blue-500' : ''} h-full`}>
        {children}
      </Button>
    ) : null}
    <span className={`tooltip__text ${center ? 'tooltip__text--center' : ''}`}>
      {tip}
    </span>
  </div>
)

TooltipButton.propTypes = {
  tip: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  center: PropTypes.bool,
  isFocussed: PropTypes.bool,
}

export default TooltipButton
