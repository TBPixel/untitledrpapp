import React from 'react'
import { useSelector } from 'react-redux'
import * as alerts from 'features/alerts/store'
import Notification from 'features/alerts/Notification'

function Alerts() {
  const notifications = useSelector(alerts.SelectAlerts)

  return (
    <div className="absolute top-0 right-0 mr-4 mt-4">
      <ul>
        {notifications.map((n, i) => (
          <li key={i} className="mb-2">
            <Notification
              index={i}
              level={n.level}
              title={n.title}
              message={n.message}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Alerts
