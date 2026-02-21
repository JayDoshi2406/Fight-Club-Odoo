import { useState, useMemo } from 'react';

/* ── Sample data ── */
const FLEET_DATA = [
  { trip: 1012, vehicle: 'Volvo FH16', driver: 'James Carter', status: 'On Trip' },
  { trip: 1013, vehicle: 'Scania R500', driver: 'Maria Lopez', status: 'Available' },
  { trip: 1014, vehicle: 'MAN TGX', driver: 'Raj Patel', status: 'In Shop' },
  { trip: 1015, vehicle: 'DAF XF', driver: 'Emily Chen', status: 'On Trip' },
  { trip: 1016, vehicle: 'Mercedes Actros', driver: 'Ahmed Hassan', status: 'Available' },
  { trip: 1017, vehicle: 'Iveco S-Way', driver: 'Luca Rossi', status: 'Out of Service' },
  { trip: 1018, vehicle: 'Kenworth T680', driver: 'Sarah Kim', status: 'On Trip' },
  { trip: 1019, vehicle: 'Peterbilt 579', driver: 'David Brown', status: 'Available' },
  { trip: 1020, vehicle: 'Freightliner Cascadia', driver: 'Anna Schmidt', status: 'In Shop' },
  { trip: 1021, vehicle: 'Volvo VNL', driver: 'Tom Wilson', status: 'On Trip' },
];

const MAINTENANCE_DATA = [
  { trip: 1014, vehicle: 'MAN TGX', driver: 'Raj Patel', status: 'In Shop' },
  { trip: 1020, vehicle: 'Freightliner Cascadia', driver: 'Anna Schmidt', status: 'In Shop' },
  { trip: 1017, vehicle: 'Iveco S-Way', driver: 'Luca Rossi', status: 'Out of Service' },
];

const CARGO_DATA = [
  { trip: 1022, vehicle: 'Scania R500', driver: 'Maria Lopez', status: 'Available' },
  { trip: 1023, vehicle: 'Mercedes Actros', driver: 'Ahmed Hassan', status: 'Available' },
  { trip: 1024, vehicle: 'Peterbilt 579', driver: 'David Brown', status: 'Available' },
  { trip: 1025, vehicle: 'DAF XF', driver: 'Emily Chen', status: 'Available' },
];

const TABS = [
  { key: 'fleet', label: 'Active Fleet', data: FLEET_DATA },
  { key: 'maintenance', label: 'Maintenance Alert', data: MAINTENANCE_DATA },
  { key: 'cargo', label: 'Pending Cargo', data: CARGO_DATA },
];

const STATUS_STYLES = {
  Available: 'bg-green-500/20 text-green-300',
  'On Trip': 'bg-blue-500/20 text-blue-300',
  'In Shop': 'bg-yellow-500/20 text-yellow-300',
  'Out of Service': 'bg-red-500/20 text-red-300',
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
function Dashboard() {
  const [activeTab, setActiveTab] = useState('fleet');
  const [search, setSearch] = useState('');

  const currentTab = TABS.find((t) => t.key === activeTab);

  const filtered = useMemo(() => {
    if (!search.trim()) return currentTab.data;
    const q = search.toLowerCase();
    return currentTab.data.filter(
      (row) =>
        String(row.trip).includes(q) ||
        row.vehicle.toLowerCase().includes(q) ||
        row.driver.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
    );
  }, [search, currentTab]);

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-accent">Dashboard</h2>
        <p className="text-muted mt-1 text-sm">Overview of your fleet operations</p>
      </div>

      {/* ── Search bar + action buttons ── */}
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
            placeholder="Search trips, vehicles, drivers…"
            className="w-full pl-10 pr-4 py-2.5 bg-secondary/30 border border-secondary rounded-lg text-accent placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm"
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
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-secondary/30 border border-secondary rounded-lg text-sm font-medium text-accent hover:bg-secondary/50 transition focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabs + action buttons ── */}
      <div className="flex items-center border-b border-secondary">
        <div className="flex items-center gap-1 flex-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-accent'
                  : 'text-muted hover:text-accent'
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === tab.key
                    ? 'bg-accent text-primary'
                    : 'bg-secondary/50 text-muted'
                }`}
              >
                {tab.data.length}
              </span>
              {/* Active indicator */}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right-side action buttons */}
        <div className="flex items-center gap-2 pb-2">
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-primary text-sm font-semibold rounded-lg hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-accent">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Trip
          </button>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-accent text-sm font-semibold rounded-lg hover:bg-secondary/80 transition focus:outline-none focus:ring-2 focus:ring-accent">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Vehicle
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border border-secondary">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-secondary/30 border-b border-secondary">
              <th className="px-5 py-3.5 font-semibold text-accent">Trip</th>
              <th className="px-5 py-3.5 font-semibold text-accent">Vehicle</th>
              <th className="px-5 py-3.5 font-semibold text-accent">Driver</th>
              <th className="px-5 py-3.5 font-semibold text-accent">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((row) => (
                <tr
                  key={row.trip}
                  className="border-b border-secondary/50 hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-5 py-3.5 text-accent font-medium">#{row.trip}</td>
                  <td className="px-5 py-3.5">
                    <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition">
                      {row.vehicle}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition">
                      {row.driver}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer info ── */}
      <p className="text-xs text-muted">
        Showing {filtered.length} of {currentTab.data.length} records
      </p>
    </div>
  );
}

export default Dashboard;
