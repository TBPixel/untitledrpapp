import React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import config from 'conf'
import * as auth from 'features/auth/store'

const NavItem = ({ children }) => (
  <li className="block text-sm lg:inline-block mr-6 sm:mr-0 sm:ml-6 lg:mt-0 text-blue-500 hover:text-blue-400">
    {children}
  </li>
)

function Navigation() {
  const history = useHistory()
  const location = useLocation()
  const user = useSelector(auth.SelectUser)
  const dispatch = useDispatch()
  const onLogout = async () => {
    dispatch(auth.Logout())

    await fetch(`${config.api.host}/api/logout`, { credentials: 'include' })

    history.push('/')
  }

  return (
    <ul className="flex sm:justify-end">
      {user ? (
        <>
          {!location.pathname.includes('/app') && (
            <NavItem>
              <Link to="/app">Chat</Link>
            </NavItem>
          )}
          <NavItem>
            <button onClick={onLogout}>Logout</button>
          </NavItem>
        </>
      ) : (
        <>
          <NavItem>
            <Link to="/login">Login</Link>
          </NavItem>
          <NavItem>
            <Link to="/register">Register</Link>
          </NavItem>
        </>
      )}
    </ul>
  )
}

export default Navigation
