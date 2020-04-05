import React from 'react'
import Chrome from 'components/Chrome'

function AuthChrome({ children }) {
  return (
    <Chrome>
      <div className="h-screen flex items-center justify-center">
        {children}
      </div>
    </Chrome>
  )
}

export default AuthChrome
