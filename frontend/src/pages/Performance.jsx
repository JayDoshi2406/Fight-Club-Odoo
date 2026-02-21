import { useState, useMemo } from 'react';

/* ── Sample performance data ── */
const PERFORMANCE_DATA = [
  { id: 1, name: 'James Carter', license: 'DL-2024-001234', expiry: '2027-08-15', completionRate: 96, safetyScore: 92 },
  { id: 2, name: 'Maria Lopez', license: 'MH-2023-005678', expiry: '2026-11-20', completionRate: 89, safetyScore: 88 },
  { id: 3, name: 'Raj Patel', license: 'GJ-2022-009012', expiry: '2026-05-10', completionRate: 94, safetyScore: 95 },
  { id: 4, name: 'Emily Chen', license: 'KA-2024-003456', expiry: '2028-02-28', completionRate: 78, safetyScore: 82 },
  { id: 5, name: 'Ahmed Hassan', license: 'TN-2023-007890', expiry: '2027-01-05', completionRate: 92, safetyScore: 90 },
  { id: 6, name: 'Luca Rossi', license: 'DL-2021-002345', expiry: '2026-03-18', completionRate: 65, safetyScore: 70 },
  { id: 7, name: 'Sarah Kim', license: 'MH-2024-006789', expiry: '2028-07-22', completionRate: 98, safetyScore: 97 },
  { id: 8, name: 'David Brown', license: 'UP-2023-001122', expiry: '2027-04-30', completionRate: 85, safetyScore: 84 },
  { id: 9, name: 'Anna Schmidt', license: 'RJ-2022-003344', expiry: '2026-09-12', completionRate: 72, safetyScore: 76 },
  { id: 10, name: 'Tom Wilson', license: 'AP-2024-005566', expiry: '2028-12-01', completionRate: 91, safetyScore: 89 },
];

/* ── Helpers ── */
const scoreColor = (val) => {
  if (val >= 90) return 'text-green-300';
  if (val >= 75) return 'text-yellow-300';
  return 'text-red-300';
};

const scoreBg = (val) => {
  if (val >= 90) return 'bg-green-500/20';
  if (val >= 75) return 'bg-yellow-500/20';
  return 'bg-red-500/20';
};

const expiryStatus = (dateStr) => {
  const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return { label: 'Expired', style: 'bg-red-500/20 text-red-300', dot: 'bg-red-400' };
  if (diff < 90) return { label: 'Expiring Soon', style: 'bg-yellow-500/20 text-yellow-300', dot: 'bg-yellow-400' };
  return { label: 'Valid', style: 'bg-green-500/20 text-green-300', dot: 'bg-green-400' };
};

/* ── Icons ── */
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
);

const GroupIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

/* ── Component ── */
function Performance() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return PERFORMANCE_DATA;
    const q = search.toLowerCase();
    return PERFORMANCE_DATA.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.license.toLowerCase().includes(q) ||
        p.expiry.includes(q) ||
        String(p.completionRate).includes(q) ||
        String(p.safetyScore).includes(q)
    );
  }, [search]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-350 mx-auto">
      {/* ── Page Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-accent">Performance</h2>
        <p className="text-muted mt-1 text-sm">View fleet performance metrics and driver scorecards.</p>
      </div>

      {/* ── Performance Table Card ── */}
      <div className="rounded-2xl border border-secondary/50 bg-primary/40 backdrop-blur-sm overflow-hidden">
        {/* Toolbar: search + actions */}
        <div className="p-5 pb-0 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search drivers, licenses, scores…"
                className="w-full pl-10 pr-4 py-2.5 bg-secondary/20 border border-secondary/50 rounded-lg text-accent placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {[
                { label: 'Group By', Icon: GroupIcon },
                { label: 'Filter', Icon: FilterIcon },
                { label: 'Sort By', Icon: SortIcon },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-secondary/20 border border-secondary/50 rounded-lg text-sm font-medium text-muted hover:text-accent hover:bg-secondary/40 transition focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <Icon />
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Record count */}
          <div className="flex items-center justify-between border-b border-secondary/50 pb-4">
            <p className="text-sm text-muted">
              <span className="text-accent font-semibold">{filtered.length}</span> driver{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-secondary/15">
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Sr. No.</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Name</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">License</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Expiry</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Completion Rate</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Safety Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/30">
              {filtered.length > 0 ? (
                filtered.map((p, idx) => {
                  const exp = expiryStatus(p.expiry);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-secondary/15 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-secondary/5'}`}
                    >
                      <td className="px-5 py-4 text-muted font-mono text-center">{idx + 1}</td>
                      <td className="px-5 py-4 text-center">
                        <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition font-medium">
                          {p.name}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-mono text-accent/80 bg-secondary/20 px-2 py-0.5 rounded text-xs">{p.license}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-muted font-mono text-xs">
                            {new Date(p.expiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${exp.style}`}>
                            <span className={`w-1 h-1 rounded-full ${exp.dot}`} />
                            {exp.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${scoreBg(p.completionRate)} ${scoreColor(p.completionRate)}`}>
                          {p.completionRate}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${scoreBg(p.safetyScore)} ${scoreColor(p.safetyScore)}`}>
                          {p.safetyScore}/100
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                      <p className="text-muted text-sm">No records found.</p>
                      <p className="text-muted/60 text-xs">Try adjusting your search terms.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table footer ── */}
        <div className="px-5 py-3.5 border-t border-secondary/30 flex items-center justify-between">
          <p className="text-xs text-muted">
            Showing {filtered.length} of {PERFORMANCE_DATA.length} drivers
          </p>
          <div className="text-xs text-muted/60">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Performance;
