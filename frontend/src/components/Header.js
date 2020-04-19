import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as auth from 'features/auth/store'
import Navigation from 'components/Navigation'

const Header = () => {
  const user = useSelector(auth.SelectUser)

  return (
    <header className="px-4 pt-3 pb-5 flex flex-wrap sm:flex-no-wrap">
      <h1 className="sm:w-1/2 text-gray-600 font-bold">
        <Link to={user ? '/app' : '/'}>
          <span className="text-xs inline-block mr-1">UntitledRP.app</span>
          <span className="text-xs text-orange-600">
            <sup>alpha</sup>
          </span>
        </Link>
      </h1>

      <nav className="flex-grow sm:w-1/2">
        <Navigation />
      </nav>
    </header>
  )
}

export default Header
