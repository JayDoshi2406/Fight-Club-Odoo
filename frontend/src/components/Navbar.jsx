import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useUser } from '../context/UserContext';

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  /* Initials fallback when no image */
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-primary/95 backdrop-blur-md border-b border-muted/15 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Brand */}
          <h1
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-accent tracking-wide cursor-pointer hover:opacity-80 transition"
          >
            Fleet Flow
          </h1>

          <div className="flex items-center gap-4">
            {/* User pill — clickable to profile */}
            {user && (
              <button
                onClick={() => navigate('/profile')}
                className="hidden sm:flex items-center gap-2.5 bg-muted/10 border border-muted/20 rounded-full px-3 py-1.5 cursor-pointer hover:bg-muted/20 transition focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-accent/30" />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-accent">
                    {getInitials(user.name)}
                  </span>
                )}
                <span className="text-sm font-medium text-accent">{user.name}</span>
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-accent hover:text-muted transition focus:outline-none"
              aria-label="Open menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

export default Navbar;
