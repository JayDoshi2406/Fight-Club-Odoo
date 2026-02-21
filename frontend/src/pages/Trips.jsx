import { useState, useMemo } from 'react';
import TripModal from '../modals/TripModal';

/* ── Sample trip data (matches TripSchema) ── */
const TRIPS_DATA = [
  { id: 1, vehicleId: 'Volvo FH16', driverId: 'Arjun Mehta', cargoWeight: 12000, status: 'Dispatched', startOdometer: 45200, finalOdometer: null, dispatchedAt: '2026-02-18T08:30:00Z', completedAt: null },
  { id: 2, vehicleId: 'Tata Ace Gold', driverId: 'Priya Sharma', cargoWeight: 800, status: 'Draft', startOdometer: null, finalOdometer: null, dispatchedAt: null, completedAt: null },
  { id: 3, vehicleId: 'Scania R500', driverId: 'Vikram Singh', cargoWeight: 18500, status: 'Completed', startOdometer: 78000, finalOdometer: 79450, dispatchedAt: '2026-02-10T06:00:00Z', completedAt: '2026-02-12T18:30:00Z' },
  { id: 4, vehicleId: 'Bajaj Maxima', driverId: 'Neha Gupta', cargoWeight: 350, status: 'Cancelled', startOdometer: null, finalOdometer: null, dispatchedAt: null, completedAt: null },
  { id: 5, vehicleId: 'MAN TGX', driverId: 'Ravi Kumar', cargoWeight: 22000, status: 'Dispatched', startOdometer: 112500, finalOdometer: null, dispatchedAt: '2026-02-17T05:15:00Z', completedAt: null },
  { id: 6, vehicleId: 'Mahindra Supro', driverId: 'Anita Desai', cargoWeight: 600, status: 'Draft', startOdometer: null, finalOdometer: null, dispatchedAt: null, completedAt: null },
  { id: 7, vehicleId: 'DAF XF', driverId: 'Suresh Patel', cargoWeight: 15000, status: 'Completed', startOdometer: 64200, finalOdometer: 65800, dispatchedAt: '2026-02-08T07:00:00Z', completedAt: '2026-02-09T22:45:00Z' },
  { id: 8, vehicleId: 'Bajaj Maxima', driverId: 'Meera Nair', cargoWeight: 280, status: 'Dispatched', startOdometer: 15600, finalOdometer: null, dispatchedAt: '2026-02-19T09:00:00Z', completedAt: null },
  { id: 9, vehicleId: 'Mahindra Supro', driverId: 'Kiran Joshi', cargoWeight: 750, status: 'Completed', startOdometer: 32000, finalOdometer: 32480, dispatchedAt: '2026-02-05T10:30:00Z', completedAt: '2026-02-05T18:00:00Z' },
  { id: 10, vehicleId: 'Mercedes Actros', driverId: 'Deepak Rao', cargoWeight: 20000, status: 'Draft', startOdometer: null, finalOdometer: null, dispatchedAt: null, completedAt: null },
  { id: 11, vehicleId: 'Kenworth T680', driverId: 'Arjun Mehta', cargoWeight: 24000, status: 'Dispatched', startOdometer: 98700, finalOdometer: null, dispatchedAt: '2026-02-20T04:00:00Z', completedAt: null },
  { id: 12, vehicleId: 'Tata Ace Gold', driverId: 'Priya Sharma', cargoWeight: 900, status: 'Cancelled', startOdometer: null, finalOdometer: null, dispatchedAt: null, completedAt: null },
];

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
function Trips() {
  const [search, setSearch] = useState('');
  const [tripModalOpen, setTripModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return TRIPS_DATA;
    const q = search.toLowerCase();
    return TRIPS_DATA.filter(
      (t) =>
        t.vehicleId.toLowerCase().includes(q) ||
        t.driverId.toLowerCase().includes(q) ||
        String(t.cargoWeight).includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [search]);

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
              {[
                { label: 'Group By', Icon: GroupIcon },
                { label: 'Filter', Icon: FilterIcon },
                { label: 'Sort By', Icon: SortIcon },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-muted/8 border border-muted/20 rounded-lg text-sm font-medium text-muted hover:text-accent hover:bg-muted/15 transition focus:outline-none focus:ring-2 focus:ring-secondary/50"
                >
                  <Icon />
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
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
                filtered.map((t, idx) => (
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

        {/* ── Table footer ── */}
        <div className="px-5 py-3.5 border-t border-muted/10 flex items-center justify-between">
          <p className="text-xs text-muted">
            Showing {filtered.length} of {TRIPS_DATA.length} trips
          </p>
          <div className="text-xs text-muted/60">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* ── Trip Modal ── */}
      <TripModal isOpen={tripModalOpen} onClose={() => setTripModalOpen(false)} />
    </div>
  );
}

export default Trips;
