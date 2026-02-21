import { useState } from 'react';
import Sidebar from './Sidebar';

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-primary border-b border-secondary shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Brand */}
          <h1 className="text-2xl font-bold text-accent tracking-wide">
            Fleet Flow
          </h1>

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
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

export default Navbar;
