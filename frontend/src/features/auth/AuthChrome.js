import React from 'react'
import Chrome from 'components/Chrome'

function AuthChrome({ children }) {
  return (
    <Chrome>
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </Chrome>
  )
}

export default AuthChrome
