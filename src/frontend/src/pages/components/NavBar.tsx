import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginButtonOrUsername from "./loginButtonOrUsername";

export default function NavBar() {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          Argo Mini-ERP
        </h1>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
          <a className="hover:text-white cursor-pointer" onClick={() => navigate('/favorites')}>
            Buy Stuff
          </a>
        </nav>

        <LoginButtonOrUsername></LoginButtonOrUsername>
      </div>
    </div>
  );

}