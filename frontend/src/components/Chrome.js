import React from 'react'
import Header from 'components/Header'

function Chrome({ children }) {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  )
}

export default Chrome
