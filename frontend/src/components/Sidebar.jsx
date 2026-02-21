import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard', roles: [], icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { label: 'Vehicle Registry', path: '/vehicles', roles: ['Fleet Manager'], icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0h2m4 0h1a1 1 0 001-1v-4.586a1 1 0 00-.293-.707l-3-3A1 1 0 0017.414 7H14' },
  { label: 'Trip Dispatcher', path: '/trips', roles: ['Dispatcher'], icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  { label: 'Maintenance', path: '/maintenance', roles: ['Fleet Manager'], icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Trip & Expense', path: '/expenses', roles: ['Financial Analyst'], icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Performance', path: '/performance', roles: ['Safety Officer'], icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { label: 'Analytics', path: '/analytics', roles: ['Financial Analyst'], icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { label: 'My Profile', path: '/profile', roles: [], icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-primary border-l border-muted/15 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-muted/15">
          <span className="text-lg font-semibold text-accent">Menu</span>
          <button
            onClick={onClose}
            className="text-muted hover:text-accent transition focus:outline-none"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Profile Card */}
        {user && (
          <div className="px-5 py-4 border-b border-muted/15">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/30" />
              ) : (
                <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-accent">
                  {getInitials(user.name)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-accent truncate">{user.name}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
            </div>
            <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-secondary/25 text-secondary">
              {user.role}
            </span>
          </div>
        )}

        {/* Navigation Links (filtered by role) */}
        <nav className="px-4 py-4 space-y-1">
          {NAV_LINKS.filter((link) => link.roles.length === 0 || (user && link.roles.includes(user.role))).map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-secondary/20 text-accent'
                    : 'text-muted hover:bg-muted/10 hover:text-accent'
                }`
              }
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-muted/15 space-y-3">
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/15 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          )}
          <p className="text-xs text-muted text-center">Fleet Flow &copy; 2026</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
