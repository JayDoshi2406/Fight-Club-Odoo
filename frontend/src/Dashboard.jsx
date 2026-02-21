import { useState, useMemo } from 'react';
import VehicleModal from './modals/VehicleModal';
import TripModal from './modals/TripModal';

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

const STATUS_DOT = {
  Available: 'bg-green-400',
  'On Trip': 'bg-blue-400',
  'In Shop': 'bg-yellow-400',
  'Out of Service': 'bg-red-400',
};

/* ── KPI cards data ── */
const KPI_CARDS = [
  {
    label: 'Total Vehicles',
    value: 10,
    icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0h2m4 0h1a1 1 0 001-1v-4.586a1 1 0 00-.293-.707l-3-3A1 1 0 0017.414 7H14',
    change: '+2 this week',
    accent: 'from-secondary/60 to-secondary/20',
  },
  {
    label: 'Active Trips',
    value: 4,
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    change: '40% utilization',
    accent: 'from-blue-500/30 to-blue-500/10',
  },
  {
    label: 'Maintenance Alerts',
    value: 3,
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
    change: '1 critical',
    accent: 'from-yellow-500/30 to-yellow-500/10',
  },
  {
    label: 'Pending Cargo',
    value: 4,
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    change: '₹2.4L value',
    accent: 'from-purple-500/30 to-purple-500/10',
  },
];

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
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [tripModalOpen, setTripModalOpen] = useState(false);

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
    <div className="p-6 lg:p-8 space-y-8 max-w-350 mx-auto">
      {/* ── Welcome banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary via-secondary/80 to-secondary border border-secondary/50 p-8">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-accent">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
          </h2>
          <p className="text-muted mt-2 text-base max-w-xl">
            Here's what's happening with your fleet today. You have{' '}
            <span className="text-accent font-semibold">4 active trips</span> and{' '}
            <span className="text-yellow-300 font-semibold">3 maintenance alerts</span> that need attention.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-accent/5" />
        <div className="absolute -right-5 -bottom-12 w-32 h-32 rounded-full bg-accent/5" />
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-xl border border-secondary/50 bg-linear-to-br ${card.accent} p-5 transition hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-xs font-medium uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-bold text-accent mt-1">{card.value}</p>
                <p className="text-muted text-xs mt-2">{card.change}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-primary/40">
                <svg className="w-6 h-6 text-accent/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Fleet Overview Card ── */}
      <div className="rounded-2xl border border-secondary/50 bg-primary/40 backdrop-blur-sm overflow-hidden">
        {/* Card header with search + actions */}
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
                placeholder="Search trips, vehicles, drivers…"
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

          {/* ── Tabs + action buttons ── */}
          <div className="flex items-center border-b border-secondary/50">
            <div className="flex items-center gap-1 flex-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
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
                        : 'bg-secondary/40 text-muted'
                    }`}
                  >
                    {tab.data.length}
                  </span>
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Right-side action buttons */}
            <div className="flex items-center gap-2 pb-2 ml-4">
              <button
                onClick={() => setTripModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-primary text-sm font-semibold rounded-lg hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-accent shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Trip
              </button>
              <button
                onClick={() => setVehicleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary/60 text-accent text-sm font-semibold rounded-lg hover:bg-secondary/80 border border-secondary/50 transition focus:outline-none focus:ring-2 focus:ring-accent shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Vehicle
              </button>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-secondary/15">
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Trip</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Vehicle</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Driver</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/30">
              {filtered.length > 0 ? (
                filtered.map((row, idx) => (
                  <tr
                    key={row.trip}
                    className={`hover:bg-secondary/15 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-secondary/5'}`}
                  >
                    <td className="px-5 py-4 text-accent font-mono font-medium text-center">#{row.trip}</td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition font-medium">
                        {row.vehicle}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition font-medium">
                        {row.driver}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[row.status]}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[row.status]}`} />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                      <p className="text-muted text-sm">No results found.</p>
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
            Showing {filtered.length} of {currentTab.data.length} records
          </p>
          <div className="text-xs text-muted/60">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <VehicleModal isOpen={vehicleModalOpen} onClose={() => setVehicleModalOpen(false)} />
      <TripModal isOpen={tripModalOpen} onClose={() => setTripModalOpen(false)} />
    </div>
  );
}

export default Dashboard;
