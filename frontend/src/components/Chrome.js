import React from 'react'
import Header from 'components/Header'

function Chrome({ children }) {
  return (
    <div className="px-2 py-4">
      <Header />
      <div>{children}</div>
    </div>
  )
}

export default Chrome
