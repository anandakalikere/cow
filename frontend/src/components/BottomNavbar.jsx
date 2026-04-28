import { useLocation, Link } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiPlus, FiMessageCircle, FiUser } from 'react-icons/fi';

export default function BottomNavbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-green-600' : 'text-gray-500';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <Link
          to="/"
          className={`flex-1 flex flex-col items-center justify-center py-3 ${isActive('/')}`}
        >
          <FiHome size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/buy"
          className={`flex-1 flex flex-col items-center justify-center py-3 ${isActive('/buy')}`}
        >
          <FiShoppingBag size={24} />
          <span className="text-xs mt-1">Buy</span>
        </Link>

        <Link
          to="/sell"
          className={`flex-1 flex flex-col items-center justify-center py-3 ${isActive('/sell')}`}
        >
          <FiPlus size={24} />
          <span className="text-xs mt-1">Sell</span>
        </Link>

        <Link
          to="/chat"
          className={`flex-1 flex flex-col items-center justify-center py-3 ${isActive('/chat')}`}
        >
          <FiMessageCircle size={24} />
          <span className="text-xs mt-1">Chat</span>
        </Link>

        <Link
          to="/profile"
          className={`flex-1 flex flex-col items-center justify-center py-3 ${isActive('/profile')}`}
        >
          <FiUser size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
