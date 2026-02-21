import { useUser } from '../context/UserContext';

/* ── Role config ── */
const ROLE_CONFIG = {
  'Fleet Manager': { style: 'bg-indigo-500/20 text-indigo-300 ring-indigo-500/30', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  'Dispatcher': { style: 'bg-teal-500/20 text-teal-300 ring-teal-500/30', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  'Safety Officer': { style: 'bg-amber-500/20 text-amber-300 ring-amber-500/30', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  'Financial Analyst': { style: 'bg-violet-500/20 text-violet-300 ring-violet-500/30', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
};

function Profile() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-muted text-sm">No user logged in.</p>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  const roleCfg = ROLE_CONFIG[user.role] || { style: 'bg-secondary/30 text-muted ring-secondary/50', icon: '' };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-350 mx-auto">

      {/* ══════════════════════════════════════
          Hero Banner
         ══════════════════════════════════════ */}
      <div className="relative rounded-2xl overflow-hidden border border-muted/15 bg-primary/40 backdrop-blur-sm">
        {/* Banner gradient */}
        <div className="h-44 sm:h-52 bg-linear-to-br from-[#1e2b34] via-primary to-secondary/15 relative">
          {/* Decorative shapes */}
          <div className="absolute top-6 right-10 w-32 h-32 rounded-full bg-accent/5 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 w-48 h-24 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute top-4 left-6 w-16 h-16 rounded-full border border-accent/10" />
          <div className="absolute top-10 left-14 w-8 h-8 rounded-full border border-accent/5" />

          {/* Page title on banner */}
          <div className="absolute top-6 right-8">
            <h2 className="text-lg font-bold text-accent/60 tracking-wide">My Profile</h2>
          </div>
        </div>

        {/* Avatar (overlapping banner) */}
        <div className="absolute left-8 sm:left-10" style={{ top: 'calc(13rem - 3.5rem)' }}>
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-primary shadow-2xl"
            />
          ) : (
            <span className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-secondary flex items-center justify-center text-3xl sm:text-4xl font-bold text-accent ring-4 ring-primary shadow-2xl">
              {getInitials(user.name)}
            </span>
          )}
        </div>

        {/* Identity section */}
        <div className="pt-20 sm:pt-16 px-8 sm:px-10 pb-6 sm:pl-48">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-accent leading-tight">{user.name}</h3>
              <p className="text-sm text-muted mt-1">{user.email}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 self-start px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 ${roleCfg.style}`}>
              {roleCfg.icon && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={roleCfg.icon} />
                </svg>
              )}
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          Stats Row
         ══════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Role',
            value: user.role,
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            color: 'text-indigo-300 bg-indigo-500/10',
            iconBg: 'bg-indigo-500/20',
          },
          {
            label: 'Member Since',
            value: memberSince,
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            color: 'text-teal-300 bg-teal-500/10',
            iconBg: 'bg-teal-500/20',
          },
          {
            label: 'Account Status',
            value: 'Active',
            icon: 'M5 13l4 4L19 7',
            color: 'text-green-300 bg-green-500/10',
            iconBg: 'bg-green-500/20',
          },
          {
            label: 'Security',
            value: 'Password Set',
            icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
            color: 'text-amber-300 bg-amber-500/10',
            iconBg: 'bg-amber-500/20',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-muted/15 bg-primary/40 backdrop-blur-sm p-5 flex items-start gap-4"
          >
            <span className={`shrink-0 w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
              <svg className={`w-5 h-5 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted font-medium">{stat.label}</p>
              <p className="text-sm font-semibold text-accent mt-0.5 truncate">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          Details Cards (2-column)
         ══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Personal Information ── */}
        <div className="rounded-2xl border border-muted/15 bg-primary/40 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-muted/12 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h4 className="text-sm font-semibold text-accent">Personal Information</h4>
          </div>

          <div className="p-6 space-y-4">
            {/* Full Name */}
            <div className="flex items-center justify-between py-3 border-b border-muted/10">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs text-muted uppercase tracking-wider">Full Name</span>
              </div>
              <span className="text-sm text-accent font-medium">{user.name}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-3 border-b border-muted/10">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-muted uppercase tracking-wider">Email</span>
              </div>
              <span className="text-sm text-accent font-medium">{user.email}</span>
            </div>

            {/* Role */}
            <div className="flex items-center justify-between py-3 border-b border-muted/10">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs text-muted uppercase tracking-wider">Role</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${roleCfg.style}`}>
                {user.role}
              </span>
            </div>

            {/* Member Since */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-muted uppercase tracking-wider">Joined</span>
              </div>
              <span className="text-sm text-accent font-medium">{memberSince}</span>
            </div>
          </div>
        </div>

        {/* ── Security & Media ── */}
        <div className="rounded-2xl border border-muted/15 bg-primary/40 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-muted/12 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h4 className="text-sm font-semibold text-accent">Security & Media</h4>
          </div>

          <div className="p-6 space-y-4">
            {/* Password */}
            <div className="flex items-center justify-between py-3 border-b border-muted/10">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-muted uppercase tracking-wider">Password</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-accent font-medium tracking-widest">••••••••</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/20 text-green-300">
                  <span className="w-1 h-1 rounded-full bg-green-400" />
                  Secured
                </span>
              </div>
            </div>

            {/* Profile Image */}
            <div className="py-3 border-b border-muted/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-muted uppercase tracking-wider">Profile Image</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${user.image ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                  <span className={`w-1 h-1 rounded-full ${user.image ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  {user.image ? 'Uploaded' : 'Not Set'}
                </span>
              </div>
              {user.image ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/5 rounded-xl">
                  <img src={user.image} alt="preview" className="w-10 h-10 rounded-lg object-cover ring-1 ring-muted/20" />
                  <span className="text-xs text-muted truncate flex-1">{user.image}</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/5 rounded-xl">
                  <span className="w-10 h-10 rounded-lg bg-muted/15 flex items-center justify-center text-xs font-bold text-accent">
                    {getInitials(user.name)}
                  </span>
                  <span className="text-xs text-muted">Using initials as fallback avatar</span>
                </div>
              )}
            </div>

            {/* Account Status */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-muted uppercase tracking-wider">Account</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-500/20 text-green-300 ring-1 ring-green-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
