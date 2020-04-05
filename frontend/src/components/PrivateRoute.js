import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as auth from 'features/auth/store'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, redirect, ...rest }) {
  const user = useSelector(auth.SelectUser)

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user !== null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirect,
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

export default PrivateRoute
