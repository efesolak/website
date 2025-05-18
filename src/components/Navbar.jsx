import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({ onMenuClick }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
    // Reset search query
    setSearchQuery('');
  };

  return (
    <nav className="bg-primary text-text border-b border-blue-900/30">
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-md text-text hover:bg-secondary focus:outline-none"
            >
              <FaBars className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center ml-2 md:ml-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 9C8 9 9 7 12 7C15 7 16 9 16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7 14L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 14L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7.5 11C7.5 11 9 15 12 15C15 15 16.5 11 16.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="ml-2 text-xl font-bold hidden sm:block">SSocieyt</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for cybersecurity topics..."
                className="w-full bg-secondary py-1.5 pl-10 pr-4 rounded-full text-sm border border-blue-800 focus:outline-none focus:ring-1 focus:ring-accent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Right section */}
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-300 hover:text-accent focus:outline-none relative">
              <FaBell className="h-5 w-5" />
              <span className="absolute top-0 right-1 block h-2 w-2 rounded-full bg-accent ring-2 ring-primary"></span>
            </button>
            
            <div className="relative ml-3">
              <div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-accent"
                >
                  {currentUser?.photoURL ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover border border-blue-800"
                      src={currentUser.photoURL}
                      alt={`${currentUser.displayName || 'User'}'s profile`}
                    />
                  ) : (
                    <FaUserCircle className="h-8 w-8 text-gray-300" />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
                  >
                    <div className="py-1 rounded-md bg-surface border border-blue-900/30 shadow-lg">
                      <Link
                        to={`/profile/${currentUser?.uid}`}
                        className="block px-4 py-2 text-sm text-text hover:bg-secondary"
                        onClick={() => setShowDropdown(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-text hover:bg-secondary"
                        onClick={() => setShowDropdown(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-danger hover:bg-secondary"
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;