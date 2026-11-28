import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiBell, FiPlus } from 'react-icons/fi';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About Us' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary text-xl">&#9752;</span>
            <span className="font-heading font-bold text-lg text-secondary">
              The Daily Plate
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-500 hover:text-primary transition-colors">
              <FiSearch size={20} />
            </button>
            <button className="text-gray-500 hover:text-primary transition-colors">
              <FiBell size={20} />
            </button>
            <Link
              to="/create"
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <FiPlus size={16} />
              Create Post
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-cream-dark px-4 pb-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-sm font-medium border-b border-cream-dark ${
                  isActive ? 'text-primary' : 'text-gray-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/create"
            onClick={() => setMobileOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <FiPlus size={16} />
            Create Post
          </Link>
        </nav>
      )}
    </header>
  );
}
