import React from 'react'
import { Switch, Route } from 'react-router-dom'
import App from 'components/App'
import AuthPage from 'features/auth/AuthPage'
import Login from 'features/auth/Login'
import Register from 'features/auth/Register'
import PasswordReset from 'features/auth/PasswordReset'
import Settings from 'features/settings/Settings'

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/settings" component={Settings} />

      <Route path="/login">
        <AuthPage>
          <Login />
        </AuthPage>
      </Route>
      <Route path="/register">
        <AuthPage>
          <Register />
        </AuthPage>
      </Route>
      <Route path="/password-reset">
        <AuthPage>
          <PasswordReset />
        </AuthPage>
      </Route>
    </Switch>
  )
}

export default Routes
