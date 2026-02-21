import { useState, useMemo } from 'react';
import VehicleModal from '../modals/VehicleModal';

/* ── Sample vehicle data ── */
const VEHICLES_DATA = [
  { id: 1, name: 'Volvo FH16', image: null, model: 'FH16 2024', licensePlate: 'KA-01-AB-1234', vehicleType: 'Truck', region: 'Bangalore', maxLoadCapacity: 16000, odometer: 45200, acquisitionCost: 4200000, status: 'Available' },
  { id: 2, name: 'Scania R500', image: null, model: 'R500 2023', licensePlate: 'MH-02-CD-5678', vehicleType: 'Truck', region: 'Mumbai', maxLoadCapacity: 18000, odometer: 62300, acquisitionCost: 4800000, status: 'On Trip' },
  { id: 3, name: 'MAN TGX', image: null, model: 'TGX 2022', licensePlate: 'DL-03-EF-9012', vehicleType: 'Truck', region: 'Delhi', maxLoadCapacity: 15000, odometer: 78500, acquisitionCost: 3900000, status: 'In Shop' },
  { id: 4, name: 'DAF XF', image: null, model: 'XF 2024', licensePlate: 'TN-04-GH-3456', vehicleType: 'Truck', region: 'Chennai', maxLoadCapacity: 14000, odometer: 31200, acquisitionCost: 3600000, status: 'On Trip' },
  { id: 5, name: 'Mercedes Actros', image: null, model: 'Actros 2023', licensePlate: 'GJ-05-IJ-7890', vehicleType: 'Truck', region: 'Ahmedabad', maxLoadCapacity: 20000, odometer: 55800, acquisitionCost: 5200000, status: 'Available' },
  { id: 6, name: 'Tata Ace Gold', image: null, model: 'Ace Gold 2024', licensePlate: 'KA-06-KL-1122', vehicleType: 'Van', region: 'Pune', maxLoadCapacity: 1000, odometer: 12400, acquisitionCost: 450000, status: 'Available' },
  { id: 7, name: 'Mahindra Supro', image: null, model: 'Supro 2023', licensePlate: 'RJ-07-MN-3344', vehicleType: 'Van', region: 'Jaipur', maxLoadCapacity: 800, odometer: 28900, acquisitionCost: 520000, status: 'On Trip' },
  { id: 8, name: 'Bajaj Maxima', image: null, model: 'Maxima C 2024', licensePlate: 'UP-08-OP-5566', vehicleType: 'Bike', region: 'Lucknow', maxLoadCapacity: 500, odometer: 8700, acquisitionCost: 280000, status: 'Out of Service' },
  { id: 9, name: 'Kenworth T680', image: null, model: 'T680 2023', licensePlate: 'AP-09-QR-7788', vehicleType: 'Truck', region: 'Hyderabad', maxLoadCapacity: 22000, odometer: 91400, acquisitionCost: 5500000, status: 'On Trip' },
  { id: 10, name: 'Peterbilt 579', image: null, model: '579 2024', licensePlate: 'WB-10-ST-9900', vehicleType: 'Truck', region: 'Kolkata', maxLoadCapacity: 19000, odometer: 41600, acquisitionCost: 4900000, status: 'Available' },
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

const TYPE_STYLES = {
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
function Vehicles() {
  const [search, setSearch] = useState('');
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return VEHICLES_DATA;
    const q = search.toLowerCase();
    return VEHICLES_DATA.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.licensePlate.toLowerCase().includes(q) ||
        v.vehicleType.toLowerCase().includes(q) ||
        v.region.toLowerCase().includes(q) ||
        v.status.toLowerCase().includes(q) ||
        String(v.maxLoadCapacity).includes(q) ||
        String(v.odometer).includes(q)
    );
  }, [search]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-350 mx-auto">
      {/* ── Page Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-accent">Vehicle Registry</h2>
        <p className="text-muted mt-1 text-sm">Manage and monitor all vehicles in your fleet.</p>
      </div>

      {/* ── Vehicle Table Card ── */}
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
                placeholder="Search vehicles, models, plates, regions…"
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

          {/* New Vehicle button row */}
          <div className="flex items-center justify-between border-b border-muted/15 pb-4">
            <p className="text-sm text-muted">
              <span className="text-accent font-semibold">{filtered.length}</span> vehicle{filtered.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={() => setVehicleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-primary text-sm font-semibold rounded-lg hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-accent shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Vehicle
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted/5">
                <th className="px-4 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Sr. No.</th>
                <th className="px-4 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Name</th>
                <th className="px-4 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Model</th>
                <th className="px-4 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">License Plate</th>
                <th className="px-4 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Vehicle Type</th>
                <th className="px-4 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Region</th>
                <th className="px-4 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Capacity (Kg)</th>
                <th className="px-4 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Odometer (Km)</th>
                <th className="px-4 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Status</th>
                <th className="px-4 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {filtered.length > 0 ? (
                filtered.map((v, idx) => (
                  <tr
                    key={v.id}
                    className={`hover:bg-muted/8 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/[0.03]'}`}
                  >
                    <td className="px-4 py-4 text-muted font-mono text-center">{idx + 1}</td>
                    <td className="px-4 py-4 text-center">
                      <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition font-medium">
                        {v.name}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-muted text-center">{v.model}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-mono text-accent/80 bg-muted/10 px-2 py-0.5 rounded text-xs">{v.licensePlate}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_STYLES[v.vehicleType]}`}>
                        {v.vehicleType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted text-center">{v.region}</td>
                    <td className="px-4 py-4 text-accent text-center font-mono">{v.maxLoadCapacity.toLocaleString()}</td>
                    <td className="px-4 py-4 text-accent text-center font-mono">{v.odometer.toLocaleString()}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[v.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[v.status]}`} />
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* View */}
                        <button
                          title="View"
                          className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-muted/15 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {/* Edit */}
                        <button
                          title="Edit"
                          className="p-1.5 rounded-lg text-muted hover:text-blue-300 hover:bg-blue-500/20 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          title="Delete"
                          className="p-1.5 rounded-lg text-muted hover:text-red-300 hover:bg-red-500/20 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                      <p className="text-muted text-sm">No vehicles found.</p>
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
            Showing {filtered.length} of {VEHICLES_DATA.length} vehicles
          </p>
          <div className="text-xs text-muted/60">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* ── Vehicle Modal ── */}
      <VehicleModal isOpen={vehicleModalOpen} onClose={() => setVehicleModalOpen(false)} />
    </div>
  );
}

export default Vehicles;
