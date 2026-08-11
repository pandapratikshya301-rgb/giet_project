import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const activeStyle = "px-4 py-2 rounded-full bg-violet-600 text-white font-medium shadow-md shadow-violet-500/20 transition-all duration-300";
  const inactiveStyle = "px-4 py-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all duration-300";

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <nav className="mx-auto max-w-5xl rounded-full border border-white/20 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 p-3 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-none flex items-center justify-between">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2 pl-3">
          <NavLink to="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
            GIET Portal
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 pr-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            Contact
          </NavLink>
          <NavLink 
            to="/library" 
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            Library
          </NavLink>
          <NavLink 
            to="/shop" 
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            Shop
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
