import React from 'react'
import Header from 'components/Header'
import Alerts from 'features/alerts/Alerts'

function Chrome({ children }) {
  return (
    <>
      <div className="h-full flex flex-col">
        <Header />
        <div className="flex-grow">{children}</div>
      </div>
      <Alerts />
    </>
  )
}

export default Chrome
