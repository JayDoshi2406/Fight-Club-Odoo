import { useState, useMemo, useRef, useEffect } from 'react';

/* ── Sample performance data ── */
const PERFORMANCE_DATA = [
  { id: 1, name: 'James Carter', licenseCategory: 'DL-2024-001234', licenseExpiryDate: '2027-08-15', tripCompletionRate: 96, safetyScore: 92, dutyStatus: 'On Duty', availabilityStatus: 'Available' },
  { id: 2, name: 'Maria Lopez', licenseCategory: 'MH-2023-005678', licenseExpiryDate: '2026-11-20', tripCompletionRate: 89, safetyScore: 88, dutyStatus: 'On Duty', availabilityStatus: 'On Trip' },
  { id: 3, name: 'Raj Patel', licenseCategory: 'GJ-2022-009012', licenseExpiryDate: '2026-05-10', tripCompletionRate: 94, safetyScore: 95, dutyStatus: 'On Duty', availabilityStatus: 'Available' },
  { id: 4, name: 'Emily Chen', licenseCategory: 'KA-2024-003456', licenseExpiryDate: '2028-02-28', tripCompletionRate: 78, safetyScore: 82, dutyStatus: 'On Duty', availabilityStatus: 'On Trip' },
  { id: 5, name: 'Ahmed Hassan', licenseCategory: 'TN-2023-007890', licenseExpiryDate: '2027-01-05', tripCompletionRate: 92, safetyScore: 90, dutyStatus: 'On Duty', availabilityStatus: 'Available' },
  { id: 6, name: 'Luca Rossi', licenseCategory: 'DL-2021-002345', licenseExpiryDate: '2026-03-18', tripCompletionRate: 65, safetyScore: 70, dutyStatus: 'Suspended', availabilityStatus: 'Available' },
  { id: 7, name: 'Sarah Kim', licenseCategory: 'MH-2024-006789', licenseExpiryDate: '2028-07-22', tripCompletionRate: 98, safetyScore: 97, dutyStatus: 'On Duty', availabilityStatus: 'On Trip' },
  { id: 8, name: 'David Brown', licenseCategory: 'UP-2023-001122', licenseExpiryDate: '2027-04-30', tripCompletionRate: 85, safetyScore: 84, dutyStatus: 'Off Duty', availabilityStatus: 'Available' },
  { id: 9, name: 'Anna Schmidt', licenseCategory: 'RJ-2022-003344', licenseExpiryDate: '2026-09-12', tripCompletionRate: 72, safetyScore: 76, dutyStatus: 'On Duty', availabilityStatus: 'Available' },
  { id: 10, name: 'Tom Wilson', licenseCategory: 'AP-2024-005566', licenseExpiryDate: '2028-12-01', tripCompletionRate: 91, safetyScore: 89, dutyStatus: 'On Duty', availabilityStatus: 'On Trip' },
];

/* ── Status styles ── */
const DUTY_STYLES = {
  'On Duty': 'bg-green-500/20 text-green-300',
  'Off Duty': 'bg-gray-500/20 text-gray-300',
  'Suspended': 'bg-red-500/20 text-red-300',
};

const DUTY_DOT = {
  'On Duty': 'bg-green-400',
  'Off Duty': 'bg-gray-400',
  'Suspended': 'bg-red-400',
};

const AVAIL_STYLES = {
  'Available': 'bg-emerald-500/20 text-emerald-300',
  'On Trip': 'bg-blue-500/20 text-blue-300',
};

const AVAIL_DOT = {
  'Available': 'bg-emerald-400',
  'On Trip': 'bg-blue-400',
};

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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [dutyFilter, setDutyFilter] = useState([]);
  const [availFilter, setAvailFilter] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const sortRef = useRef(null);
  const filterRef = useRef(null);

  const SORT_COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'licenseExpiryDate', label: 'License Expiry' },
    { key: 'tripCompletionRate', label: 'Completion Rate' },
    { key: 'safetyScore', label: 'Safety Score' },
    { key: 'dutyStatus', label: 'Duty Status' },
    { key: 'availabilityStatus', label: 'Availability' },
  ];

  const ALL_DUTY = ['On Duty', 'Off Duty', 'Suspended'];
  const ALL_AVAIL = ['Available', 'On Trip'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortDropdown(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilterCount = dutyFilter.length + availFilter.length;

  const filtered = useMemo(() => {
    let data = PERFORMANCE_DATA;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.licenseCategory.toLowerCase().includes(q) ||
          p.licenseExpiryDate.includes(q) ||
          String(p.tripCompletionRate).includes(q) ||
          String(p.safetyScore).includes(q) ||
          p.dutyStatus.toLowerCase().includes(q) ||
          p.availabilityStatus.toLowerCase().includes(q)
      );
    }
    if (dutyFilter.length > 0) {
      data = data.filter((p) => dutyFilter.includes(p.dutyStatus));
    }
    if (availFilter.length > 0) {
      data = data.filter((p) => availFilter.includes(p.availabilityStatus));
    }
    if (sortConfig.key) {
      data = [...data].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal ?? '').toLowerCase();
        const bStr = String(bVal ?? '').toLowerCase();
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [search, sortConfig, dutyFilter, availFilter]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-350 mx-auto">
      {/* ── Page Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-accent">Performance</h2>
        <p className="text-muted mt-1 text-sm">View fleet performance metrics and driver scorecards.</p>
      </div>

      {/* ── Performance Table Card ── */}
      <div className="rounded-2xl border border-muted/15 bg-primary/40 backdrop-blur-sm overflow-hidden">
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
                className="w-full pl-10 pr-4 py-2.5 bg-muted/8 border border-muted/20 rounded-lg text-accent placeholder-muted focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Filter */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => { setShowFilterDropdown(!showFilterDropdown); setShowSortDropdown(false); }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-muted/8 border rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-secondary/50 ${
                    activeFilterCount > 0 ? 'border-secondary/50 text-accent' : 'border-muted/20 text-muted hover:text-accent hover:bg-muted/15'
                  }`}
                >
                  <FilterIcon />
                  <span className="hidden md:inline">Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-secondary/30 text-xs text-accent font-semibold">{activeFilterCount}</span>
                  )}
                </button>
                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-[#1e2b34] border border-muted/20 rounded-lg shadow-xl z-50 py-2 max-h-80 overflow-y-auto">
                    <p className="px-4 py-1.5 text-xs text-muted uppercase tracking-wider font-semibold">Duty Status</p>
                    {ALL_DUTY.map((status) => (
                      <label key={status} className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted hover:text-accent hover:bg-muted/10 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dutyFilter.includes(status)}
                          onChange={() => setDutyFilter((prev) => prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status])}
                          className="rounded border-muted/30 bg-muted/10 text-secondary focus:ring-secondary/50 w-3.5 h-3.5"
                        />
                        <span className={`w-1.5 h-1.5 rounded-full ${DUTY_DOT[status]}`} />
                        {status}
                      </label>
                    ))}
                    <p className="px-4 py-1.5 text-xs text-muted uppercase tracking-wider font-semibold mt-2 border-t border-muted/15 pt-2">Availability</p>
                    {ALL_AVAIL.map((status) => (
                      <label key={status} className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted hover:text-accent hover:bg-muted/10 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={availFilter.includes(status)}
                          onChange={() => setAvailFilter((prev) => prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status])}
                          className="rounded border-muted/30 bg-muted/10 text-secondary focus:ring-secondary/50 w-3.5 h-3.5"
                        />
                        <span className={`w-1.5 h-1.5 rounded-full ${AVAIL_DOT[status]}`} />
                        {status}
                      </label>
                    ))}
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => { setDutyFilter([]); setAvailFilter([]); setShowFilterDropdown(false); }}
                        className="w-full px-4 py-2 text-sm text-red-400 hover:bg-muted/10 transition border-t border-muted/15 mt-1"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Sort */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => { setShowSortDropdown(!showSortDropdown); setShowFilterDropdown(false); }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-muted/8 border rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-secondary/50 ${
                    sortConfig.key ? 'border-secondary/50 text-accent' : 'border-muted/20 text-muted hover:text-accent hover:bg-muted/15'
                  }`}
                >
                  <SortIcon />
                  <span className="hidden md:inline">Sort By</span>
                  {sortConfig.key && (
                    <span className="text-secondary text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-[#1e2b34] border border-muted/20 rounded-lg shadow-xl z-50 py-1">
                    {SORT_COLUMNS.map((col) => (
                      <button
                        key={col.key}
                        onClick={() => {
                          setSortConfig((prev) => ({
                            key: col.key,
                            direction: prev.key === col.key && prev.direction === 'asc' ? 'desc' : 'asc',
                          }));
                          setShowSortDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition ${
                          sortConfig.key === col.key ? 'text-accent bg-muted/10' : 'text-muted hover:text-accent hover:bg-muted/10'
                        }`}
                      >
                        <span>{col.label}</span>
                        {sortConfig.key === col.key && (
                          <span className="text-secondary font-bold">{sortConfig.direction === 'asc' ? '↑ Asc' : '↓ Desc'}</span>
                        )}
                      </button>
                    ))}
                    {sortConfig.key && (
                      <button
                        onClick={() => { setSortConfig({ key: null, direction: 'asc' }); setShowSortDropdown(false); }}
                        className="w-full px-4 py-2 text-sm text-red-400 hover:bg-muted/10 transition border-t border-muted/15 mt-1"
                      >
                        Clear Sort
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Record count */}
          <div className="flex items-center justify-between border-b border-muted/15 pb-4">
            <p className="text-sm text-muted">
              <span className="text-accent font-semibold">{filtered.length}</span> driver{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted/5">
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Sr. No.</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Name</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">License</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Expiry</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Completion Rate</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Safety Score</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Duty Status</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {filtered.length > 0 ? (
                filtered.map((p, idx) => {
                  const exp = expiryStatus(p.licenseExpiryDate);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-muted/8 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/[0.03]'}`}
                    >
                      <td className="px-5 py-4 text-muted font-mono text-center">{idx + 1}</td>
                      <td className="px-5 py-4 text-center">
                        <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition font-medium">
                          {p.name}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-mono text-accent/80 bg-muted/10 px-2 py-0.5 rounded text-xs">{p.licenseCategory}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-muted font-mono text-xs">
                            {new Date(p.licenseExpiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${exp.style}`}>
                            <span className={`w-1 h-1 rounded-full ${exp.dot}`} />
                            {exp.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${scoreBg(p.tripCompletionRate)} ${scoreColor(p.tripCompletionRate)}`}>
                          {p.tripCompletionRate}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${scoreBg(p.safetyScore)} ${scoreColor(p.safetyScore)}`}>
                          {p.safetyScore}/100
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${DUTY_STYLES[p.dutyStatus]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${DUTY_DOT[p.dutyStatus]}`} />
                          {p.dutyStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${AVAIL_STYLES[p.availabilityStatus]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${AVAIL_DOT[p.availabilityStatus]}`} />
                          {p.availabilityStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
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
        <div className="px-5 py-3.5 border-t border-muted/10 flex items-center justify-between">
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
