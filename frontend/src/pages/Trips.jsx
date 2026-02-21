import { useState, useMemo } from 'react';
import TripModal from '../modals/TripModal';

/* ── Sample trip data ── */
const TRIPS_DATA = [
  { id: 1, fleetType: 'Truck', origin: 'Mumbai', destination: 'Delhi', status: 'Dispatched' },
  { id: 2, fleetType: 'Van', origin: 'Bangalore', destination: 'Chennai', status: 'Draft' },
  { id: 3, fleetType: 'Truck', origin: 'Kolkata', destination: 'Patna', status: 'Completed' },
  { id: 4, fleetType: 'Bike', origin: 'Jaipur', destination: 'Ajmer', status: 'Cancelled' },
  { id: 5, fleetType: 'Truck', origin: 'Hyderabad', destination: 'Visakhapatnam', status: 'Dispatched' },
  { id: 6, fleetType: 'Van', origin: 'Pune', destination: 'Nashik', status: 'Draft' },
  { id: 7, fleetType: 'Truck', origin: 'Ahmedabad', destination: 'Surat', status: 'Completed' },
  { id: 8, fleetType: 'Bike', origin: 'Lucknow', destination: 'Kanpur', status: 'Dispatched' },
  { id: 9, fleetType: 'Van', origin: 'Chennai', destination: 'Coimbatore', status: 'Completed' },
  { id: 10, fleetType: 'Truck', origin: 'Delhi', destination: 'Chandigarh', status: 'Draft' },
  { id: 11, fleetType: 'Truck', origin: 'Indore', destination: 'Bhopal', status: 'Dispatched' },
  { id: 12, fleetType: 'Van', origin: 'Kochi', destination: 'Thiruvananthapuram', status: 'Cancelled' },
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

const FLEET_TYPE_STYLES = {
  Truck: 'bg-indigo-500/20 text-indigo-300',
  Van: 'bg-teal-500/20 text-teal-300',
  Bike: 'bg-orange-500/20 text-orange-300',
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
        t.fleetType.toLowerCase().includes(q) ||
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
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
                placeholder="Search trips, fleet type, origin, destination…"
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

          {/* New Trip button row */}
          <div className="flex items-center justify-between border-b border-secondary/50 pb-4">
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
              <tr className="bg-secondary/15">
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Sr. No.</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Fleet Type</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Origin</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Destination</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/30">
              {filtered.length > 0 ? (
                filtered.map((t, idx) => (
                  <tr
                    key={t.id}
                    className={`hover:bg-secondary/15 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-secondary/5'}`}
                  >
                    <td className="px-5 py-4 text-muted font-mono text-center">{idx + 1}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${FLEET_TYPE_STYLES[t.fleetType]}`}>
                        {t.fleetType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-accent text-center font-medium">{t.origin}</td>
                    <td className="px-5 py-4 text-accent text-center font-medium">{t.destination}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[t.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[t.status]}`} />
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
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
        <div className="px-5 py-3.5 border-t border-secondary/30 flex items-center justify-between">
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
