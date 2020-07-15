import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MdSettings } from 'react-icons/md'
import Tooltip from 'components/Tooltip'

function SettingsButton({ isFocussed }) {
  return (
    <Tooltip tip={'Settings'} center>
      <Link to="/app/settings">
        <MdSettings
          size={64}
          className={`${
            isFocussed ? 'text-blue-500' : 'text-gray-700'
          } hover:text-blue-500`}
        />
      </Link>
    </Tooltip>
  )
}

SettingsButton.propTypes = {
  isFocussed: PropTypes.bool,
}

export default SettingsButton
