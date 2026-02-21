import { useState, useMemo, useRef, useEffect } from 'react';
import TripModal from '../modals/TripModal';

/* ── Vehicle & driver catalog ── */
const _TRIP_VEHICLES = ['Tata Prima', 'Ashok Leyland 4825', 'Eicher Pro 3015', 'BharatBenz 3523R', 'Volvo FMX', 'Tata Winger Cargo', 'Mahindra Supro Maxitruck', 'Ashok Leyland Dost+', 'Maruti Suzuki Eeco Cargo', 'Force Traveller Delivery Van', 'Hero HF Deluxe', 'Bajaj CT 110', 'TVS XL100', 'Honda Shine', 'Suzuki Access 125'];
const _DRIVERS = ['Arjun Mehta', 'Priya Sharma', 'Vikram Singh', 'Neha Gupta', 'Ravi Kumar', 'Anita Desai', 'Suresh Patel', 'Meera Nair', 'Kiran Joshi', 'Deepak Rao', 'Sanjay Verma', 'Kavitha Reddy', 'Manoj Tiwari', 'Pooja Mishra', 'Rahul Sharma', 'Sunita Yadav', 'Amit Chauhan', 'Lakshmi Iyer', 'Naveen Shetty', 'Divya Pillai'];
const _TST = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

const TRIPS_DATA = Array.from({ length: 100 }, (_, i) => {
  const st = _TST[i % 4];
  const vIdx = i % 15;
  const isTruck = vIdx < 5;
  const isVan = vIdx >= 5 && vIdx < 10;
  const baseOdo = 10000 + ((i * 3571) % 90000);
  const dispDate = new Date(2026, 1, 21 - (i % 60));
  return {
    id: i + 1,
    vehicleId: _TRIP_VEHICLES[vIdx],
    driverId: _DRIVERS[i % 20],
    cargoWeight: isTruck ? 8000 + ((i * 571) % 18000) : isVan ? 300 + ((i * 71) % 1700) : 10 + ((i * 13) % 180),
    status: st,
    startOdometer: st === 'Dispatched' || st === 'Completed' ? baseOdo : null,
    finalOdometer: st === 'Completed' ? baseOdo + 500 + ((i * 113) % 2000) : null,
    dispatchedAt: st === 'Dispatched' || st === 'Completed' ? dispDate.toISOString() : null,
    completedAt: st === 'Completed' ? new Date(dispDate.getTime() + (24 + (i * 7) % 72) * 3600000).toISOString() : null,
  };
});

const STATUS_STYLES = {
  Draft: 'bg-gray-500/20 text-gray-300',
  Dispatched: 'bg-blue-500/20 text-blue-300',
  Completed: 'bg-green-500/20 text-green-300',
  Cancelled: 'bg-red-500/20 text-red-300',
};

const STATUS_DOT = {
  Draft: 'bg-gray-400',
  Dispatched: 'bg-blue-400',
  Completed: 'bg-green-400',
  Cancelled: 'bg-red-400',
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
function Trips() {
  const [search, setSearch] = useState('');
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [trips, setTrips] = useState(TRIPS_DATA);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const sortRef = useRef(null);
  const filterRef = useRef(null);
  const sentinelRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const SORT_COLUMNS = [
    { key: 'vehicleId', label: 'Vehicle' },
    { key: 'driverId', label: 'Driver' },
    { key: 'cargoWeight', label: 'Cargo Weight' },
    { key: 'status', label: 'Status' },
    { key: 'startOdometer', label: 'Start Odometer' },
    { key: 'finalOdometer', label: 'Final Odometer' },
    { key: 'dispatchedAt', label: 'Dispatched At' },
  ];

  const ALL_STATUSES = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortDropdown(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTrip = (formData) => {
    const newTrip = {
      id: trips.length > 0 ? Math.max(...trips.map((t) => t.id)) + 1 : 1,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      cargoWeight: Number(formData.cargoWeight),
      status: 'Draft',
      startOdometer: formData.startOdometer ? Number(formData.startOdometer) : null,
      finalOdometer: null,
      dispatchedAt: null,
      completedAt: null,
    };
    setTrips((prev) => [newTrip, ...prev]);
  };

  const filtered = useMemo(() => {
    let data = trips;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (t) =>
          t.vehicleId.toLowerCase().includes(q) ||
          t.driverId.toLowerCase().includes(q) ||
          String(t.cargoWeight).includes(q) ||
          t.status.toLowerCase().includes(q)
      );
    }
    if (statusFilter.length > 0) {
      data = data.filter((t) => statusFilter.includes(t.status));
    }
    if (sortConfig.key) {
      data = [...data].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [search, trips, sortConfig, statusFilter]);

  useEffect(() => { setVisibleCount(10); }, [search, sortConfig, statusFilter]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    let timer;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        timer = setTimeout(() => setVisibleCount((prev) => prev + 10), 200);
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(timer); };
  }, [visibleCount, filtered.length]);

  const visibleRows = filtered.slice(0, visibleCount);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-350 mx-auto">
      {/* ── Page Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-accent">Trip Dispatcher</h2>
        <p className="text-muted mt-1 text-sm">Dispatch and manage all fleet trips.</p>
      </div>

      {/* ── Trip Table Card ── */}
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
                placeholder="Search vehicle, driver, cargo weight, status…"
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
                    statusFilter.length > 0 ? 'border-secondary/50 text-accent' : 'border-muted/20 text-muted hover:text-accent hover:bg-muted/15'
                  }`}
                >
                  <FilterIcon />
                  <span className="hidden md:inline">Filter</span>
                  {statusFilter.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-secondary/30 text-xs text-accent font-semibold">{statusFilter.length}</span>
                  )}
                </button>
                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-[#1e2b34] border border-muted/20 rounded-lg shadow-xl z-50 py-2">
                    <p className="px-4 py-1.5 text-xs text-muted uppercase tracking-wider font-semibold">Status</p>
                    {ALL_STATUSES.map((status) => (
                      <label key={status} className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted hover:text-accent hover:bg-muted/10 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statusFilter.includes(status)}
                          onChange={() => setStatusFilter((prev) => prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status])}
                          className="rounded border-muted/30 bg-muted/10 text-secondary focus:ring-secondary/50 w-3.5 h-3.5"
                        />
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
                        {status}
                      </label>
                    ))}
                    {statusFilter.length > 0 && (
                      <button
                        onClick={() => { setStatusFilter([]); setShowFilterDropdown(false); }}
                        className="w-full px-4 py-2 text-sm text-red-400 hover:bg-muted/10 transition border-t border-muted/15 mt-1"
                      >
                        Clear Filters
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
                  <div className="absolute right-0 top-full mt-1 w-56 bg-[#1e2b34] border border-muted/20 rounded-lg shadow-xl z-50 py-1 max-h-80 overflow-y-auto">
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

          {/* New Trip button row */}
          <div className="flex items-center justify-between border-b border-muted/15 pb-4">
            <p className="text-sm text-muted">
              <span className="text-accent font-semibold">{filtered.length}</span> trip{filtered.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={() => setTripModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-primary text-sm font-semibold rounded-lg hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-accent shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Trip
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted/5">
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Sr. No.</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Vehicle</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Driver</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Cargo (Kg)</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Start Odo</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Final Odo</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Dispatched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {filtered.length > 0 ? (
                visibleRows.map((t, idx) => (
                  <tr
                    key={t.id}
                    className={`hover:bg-muted/8 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/[0.03]'}`}
                  >
                    <td className="px-5 py-4 text-muted font-mono text-center">{idx + 1}</td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition font-medium">
                        {t.vehicleId}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-accent text-center font-medium">{t.driverId}</td>
                    <td className="px-5 py-4 text-accent text-center font-mono">{t.cargoWeight.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-muted text-center font-mono">{t.startOdometer != null ? t.startOdometer.toLocaleString('en-IN') : '—'}</td>
                    <td className="px-5 py-4 text-muted text-center font-mono">{t.finalOdometer != null ? t.finalOdometer.toLocaleString('en-IN') : '—'}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[t.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[t.status]}`} />
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted text-center text-xs font-mono">
                      {t.dispatchedAt ? new Date(t.dispatchedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                      <p className="text-muted text-sm">No trips found.</p>
                      <p className="text-muted/60 text-xs">Try adjusting your search terms.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Lazy load sentinel ── */}
        {visibleCount < filtered.length && (
          <div ref={sentinelRef} className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-muted text-sm">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading more…
            </div>
          </div>
        )}

        {/* ── Table footer ── */}
        <div className="px-5 py-3.5 border-t border-muted/10 flex items-center justify-between">
          <p className="text-xs text-muted">
            Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} trips
          </p>
          <div className="text-xs text-muted/60">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* ── Trip Modal ── */}
      <TripModal isOpen={tripModalOpen} onClose={() => setTripModalOpen(false)} onSubmit={handleAddTrip} />
    </div>
  );
}

export default Trips;
