import React from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'
import Tooltip from 'components/Tooltip'

const TooltipButton = ({ children, tip, center, onClick, isFocussed }) => (
  <Tooltip tip={tip} center={center}>
    <Button
      onClick={onClick}
      styles="borderBottom"
      className={`${isFocussed ? 'border-blue-500' : ''} h-full`}>
      {children}
    </Button>
  </Tooltip>
)

TooltipButton.propTypes = {
  onClick: PropTypes.func,
  isFocussed: PropTypes.bool,
}

export default TooltipButton
