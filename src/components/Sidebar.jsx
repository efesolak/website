import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaHome, 
  FaVideo, 
  FaComments, 
  FaShieldAlt, 
  FaUserShield,
  FaUsers,
  FaQuestion,
  FaTimes
} from 'react-icons/fa';

function Sidebar({ onClose }) {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();

  const navigation = [
    { name: 'Feed', href: '/', icon: FaHome },
    { name: 'Shorts', href: '/shorts', icon: FaVideo },
    { name: 'Chat', href: '/chat', icon: FaComments },
    { name: 'Cyber Defense', href: '/defense', icon: FaShieldAlt },
    { name: 'Security Tips', href: '/tips', icon: FaUserShield },
    { name: 'Communities', href: '/communities', icon: FaUsers },
    { name: 'Support', href: '/support', icon: FaQuestion }
  ];

  return (
    <div className="h-full flex flex-col bg-primary text-text">
      <div className="px-4 py-4 flex items-center justify-between border-b border-blue-900/30 md:hidden">
        <Link to="/" className="flex items-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 9C8 9 9 7 12 7C15 7 16 9 16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7 14L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M17 14L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7.5 11C7.5 11 9 15 12 15C15 15 16.5 11 16.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="ml-2 text-xl font-bold">SSocieyt</span>
        </Link>
        <button 
          onClick={onClose}
          className="p-2 rounded-md text-text hover:bg-secondary focus:outline-none"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>

      {/* User profile section */}
      <div className="px-4 py-6 border-b border-blue-900/30">
        <Link to={`/profile/${currentUser?.uid}`} className="flex items-center">
          {currentUser?.photoURL ? (
            <img
              className="h-10 w-10 rounded-full object-cover border border-blue-800"
              src={currentUser.photoURL}
              alt={`${currentUser.displayName || 'User'}'s profile`}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-accent font-semibold border border-blue-800">
              {currentUser?.displayName?.charAt(0) || 'U'}
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-medium">{currentUser?.displayName || 'User'}</p>
            <p className="text-xs text-gray-400 truncate max-w-[150px]">
              {currentUser?.email || ''}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-secondary text-accent'
                  : 'text-gray-300 hover:bg-secondary hover:text-text'
              }`}
              onClick={() => onClose()}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-accent' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-blue-900/30">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">© 2025 SSocieyt</p>
          <a href="#" className="text-xs text-accent hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;