import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const Nav: FC = () => (
  <nav className="flex justify-between">
    <Link to="/" className="font-bold tracking-wide text-xl text-gray-300">UntitledRP.app</Link>

    <ul>
      <li>
        <Link to="/login" className="block bg-gray-300 rounded-full px-4 py-2 text-sm font-semibold tracking-wide text-gray-800 hover:text-blue-800 focus:text-blue-800">Login</Link>
      </li>
    </ul>
  </nav>
);

export default Nav;
