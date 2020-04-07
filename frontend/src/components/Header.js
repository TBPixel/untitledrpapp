import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from 'components/Navigation'

const Header = () => (
  <header className="px-4 py-4 flex flex-wrap sm:flex-no-wrap">
    <h1 className="sm:w-1/2 text-gray-600 font-bold">
      <Link to="/">
        <span className="inline-block mr-1">UntitledRP.app</span>
        <span className="text-orange-600">
          <sup>alpha</sup>
        </span>
      </Link>
    </h1>

    <nav className="flex-grow sm:w-1/2">
      <Navigation />
    </nav>
  </header>
)

export default Header
