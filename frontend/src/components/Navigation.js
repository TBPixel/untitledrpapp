import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as auth from 'features/auth/store'

const NavItem = ({ children }) => (
  <li className="block lg:inline-block mr-4 sm:mr-0 sm:ml-4 lg:mt-0 text-blue-500 hover:text-blue-400">
    {children}
  </li>
)

function Navigation() {
  const user = useSelector(auth.SelectUser)
  const dispatch = useDispatch()
  const onLogout = () => dispatch(auth.Logout())

  return (
    <ul className="flex sm:justify-end">
      {user ? (
        <NavItem>
          <button onClick={onLogout}>Logout</button>
        </NavItem>
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
