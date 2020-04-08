import React from 'react'
import Header from 'components/Header'

function Chrome({ children }) {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-grow">{children}</div>
    </div>
  )
}

export default Chrome
