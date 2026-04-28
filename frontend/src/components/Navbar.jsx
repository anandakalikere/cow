import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <span>CowMart 🐄</span>
        </div>
        <nav className="flex items-center gap-4">
          <NavLink to="/" end className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'}>Home</NavLink>
          <NavLink to="/buy" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'}>Buy Cow</NavLink>
          <NavLink to="/nearby" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'}>Nearby</NavLink>
          <NavLink to="/add" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'}>Sell Cow</NavLink>
        </nav>
      </div>
    </header>
  );
}
