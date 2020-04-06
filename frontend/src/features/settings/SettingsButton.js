import React from 'react'
import { Link } from 'react-router-dom'
import { MdSettings } from 'react-icons/md'
import Tooltip from 'components/Tooltip'

function SettingsButton() {
  return (
    <Tooltip tip={'Settings'} center>
      <Link to="/app/settings">
        <MdSettings size={64} className="text-gray-500" />
      </Link>
    </Tooltip>
  )
}

export default SettingsButton
