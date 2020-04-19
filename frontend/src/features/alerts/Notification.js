import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import {
  MdInfo,
  MdWarning,
  MdError,
  MdCheckCircle,
  MdClose,
} from 'react-icons/md'
import * as alerts from 'features/alerts/store'
import Card from 'components/Card'

function Notification({ title, message, level, index }) {
  const dispatch = useDispatch()
  const onClose = () => dispatch(alerts.Close({ index }))
  const icon = {
    info: <MdInfo className="w-10 h-10 text-gray-500" />,
    warning: <MdWarning className="w-10 h-10 text-orange-500" />,
    error: <MdError className="w-10 h-10 text-red-500" />,
    success: <MdCheckCircle className="w-10 h-10 text-green-500" />,
  }[level]
  const bg = {
    info: 'bg-gray-100',
    warning: 'bg-orange-200',
    error: 'bg-red-200',
    success: 'bg-green-200',
  }[level]

  return (
    <Card className={`flex relative w-96 pr-4 z-10 ${bg}`}>
      <div className="pl-2 pr-4 self-stretch flex items-center">{icon}</div>
      <div className="flex-grow py-4">
        <div className="flex justify-between">
          <h6 className="font-bold">{title}</h6>
          <button onClick={onClose}>
            <MdClose />
          </button>
        </div>
        <p className="pr-4">{message}</p>
      </div>
    </Card>
  )
}

Notification.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  level: PropTypes.oneOf(alerts.LEVELS).isRequired,
}

export default Notification
