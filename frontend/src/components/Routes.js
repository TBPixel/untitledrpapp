import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PrivateRoute from 'components/PrivateRoute'
import App from 'components/App'
import Home from 'components/Home'
import AuthChrome from 'features/auth/AuthChrome'
import Login from 'features/auth/Login'
import Register from 'features/auth/Register'
import PasswordReset from 'features/auth/PasswordReset'
import Settings from 'features/settings/Settings'

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />

      <Route path="/login">
        <AuthChrome>
          <Login />
        </AuthChrome>
      </Route>
      <Route path="/register">
        <AuthChrome>
          <Register />
        </AuthChrome>
      </Route>
      <Route path="/password-reset">
        <AuthChrome>
          <PasswordReset />
        </AuthChrome>
      </Route>

      <PrivateRoute redirect="/login">
        <Route path="/app" component={App} />
      </PrivateRoute>
      <PrivateRoute redirect="/login">
        <Route path="/settings" component={Settings} />
      </PrivateRoute>
    </Switch>
  )
}

export default Routes
