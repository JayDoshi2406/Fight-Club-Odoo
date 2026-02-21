import { useState, useMemo, useRef, useEffect } from 'react';
import VehicleModal from '../modals/VehicleModal';

/* ── Vehicle fleet catalog ── */
const VEHICLE_CATALOG = [
  { name: 'Tata Prima', model: 'Prima 4928', type: 'Truck', baseCapacity: 16000, baseCost: 3200000 },
  { name: 'Ashok Leyland 4825', model: '4825 IL', type: 'Truck', baseCapacity: 18000, baseCost: 3500000 },
  { name: 'Eicher Pro 3015', model: 'Pro 3015 BSV', type: 'Truck', baseCapacity: 14000, baseCost: 2800000 },
  { name: 'BharatBenz 3523R', model: '3523R Mining', type: 'Truck', baseCapacity: 20000, baseCost: 4200000 },
  { name: 'Volvo FMX', model: 'FMX 460', type: 'Truck', baseCapacity: 22000, baseCost: 5500000 },
  { name: 'Tata Winger Cargo', model: 'Winger 2024', type: 'Van', baseCapacity: 1500, baseCost: 680000 },
  { name: 'Mahindra Supro Maxitruck', model: 'Supro MT T2', type: 'Van', baseCapacity: 1200, baseCost: 550000 },
  { name: 'Ashok Leyland Dost+', model: 'Dost+ CNG', type: 'Van', baseCapacity: 1800, baseCost: 720000 },
  { name: 'Maruti Suzuki Eeco Cargo', model: 'Eeco Cargo 5S', type: 'Van', baseCapacity: 800, baseCost: 450000 },
  { name: 'Force Traveller Delivery Van', model: 'Traveller DV', type: 'Van', baseCapacity: 2000, baseCost: 950000 },
  { name: 'Hero HF Deluxe', model: 'HF Deluxe i3S', type: 'Bike', baseCapacity: 150, baseCost: 65000 },
  { name: 'Bajaj CT 110', model: 'CT 110 KS', type: 'Bike', baseCapacity: 130, baseCost: 58000 },
  { name: 'TVS XL100', model: 'XL100 HD', type: 'Bike', baseCapacity: 100, baseCost: 48000 },
  { name: 'Honda Shine', model: 'Shine 125', type: 'Bike', baseCapacity: 140, baseCost: 78000 },
  { name: 'Suzuki Access 125', model: 'Access 125 SE', type: 'Bike', baseCapacity: 120, baseCost: 85000 },
];

const _REGIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Pune', 'Kolkata', 'Jaipur', 'Lucknow', 'Surat', 'Nagpur', 'Indore', 'Bhopal', 'Kochi', 'Patna', 'Chandigarh', 'Coimbatore', 'Vadodara', 'Ranchi'];
const _SC = ['MH', 'DL', 'KA', 'TN', 'TS', 'GJ', 'MH', 'WB', 'RJ', 'UP', 'GJ', 'MH', 'MP', 'MP', 'KL', 'BR', 'CH', 'TN', 'GJ', 'JH'];
const _VST = ['Available', 'On Trip', 'In Shop', 'Out of Service'];

const VEHICLES_DATA = Array.from({ length: 100 }, (_, i) => {
  const c = VEHICLE_CATALOG[i % 15];
  const r = i % 20;
  const l1 = String.fromCharCode(65 + (i % 26));
  const l2 = String.fromCharCode(65 + ((i * 7) % 26));
  return {
    id: i + 1, name: c.name, image: null, model: c.model,
    licensePlate: `${_SC[r]}-${String((i % 20) + 1).padStart(2, '0')}-${l1}${l2}-${String(1000 + ((i * 37) % 9000))}`,
    vehicleType: c.type, region: _REGIONS[r],
    maxLoadCapacity: c.baseCapacity + ((i * 137) % Math.max(Math.floor(c.baseCapacity * 0.3), 1)),
    odometer: 5000 + ((i * 3571) % 95000),
    acquisitionCost: c.baseCost + ((i * 4713) % Math.max(Math.floor(c.baseCost * 0.2), 1)),
    status: _VST[i % 4],
  };
});

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
  const [vehicles, setVehicles] = useState(VEHICLES_DATA);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const sortRef = useRef(null);
  const filterRef = useRef(null);
  const sentinelRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const SORT_COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'licensePlate', label: 'License Plate' },
    { key: 'vehicleType', label: 'Vehicle Type' },
    { key: 'region', label: 'Region' },
    { key: 'maxLoadCapacity', label: 'Capacity' },
    { key: 'odometer', label: 'Odometer' },
    { key: 'status', label: 'Status' },
  ];

  const ALL_STATUSES = ['Available', 'On Trip', 'In Shop', 'Out of Service'];
  const ALL_TYPES = ['Truck', 'Van', 'Bike'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortDropdown(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddVehicle = (formData) => {
    const newVehicle = {
      id: vehicles.length > 0 ? Math.max(...vehicles.map((v) => v.id)) + 1 : 1,
      name: formData.name,
      image: formData.image || null,
      model: formData.model,
      licensePlate: formData.licensePlate,
      vehicleType: formData.vehicleType,
      region: formData.region,
      maxLoadCapacity: Number(formData.maxLoadCapacity),
      odometer: Number(formData.odometer),
      acquisitionCost: Number(formData.acquisitionCost),
      status: 'Available',
    };
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  const activeFilterCount = statusFilter.length + typeFilter.length;

  const filtered = useMemo(() => {
    let data = vehicles;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
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
    }
    if (statusFilter.length > 0) {
      data = data.filter((v) => statusFilter.includes(v.status));
    }
    if (typeFilter.length > 0) {
      data = data.filter((v) => typeFilter.includes(v.vehicleType));
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
  }, [search, vehicles, sortConfig, statusFilter, typeFilter]);

  useEffect(() => { setVisibleCount(10); }, [search, sortConfig, statusFilter, typeFilter]);

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
                    <p className="px-4 py-1.5 text-xs text-muted uppercase tracking-wider font-semibold mt-2 border-t border-muted/15 pt-2">Vehicle Type</p>
                    {ALL_TYPES.map((type) => (
                      <label key={type} className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted hover:text-accent hover:bg-muted/10 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={typeFilter.includes(type)}
                          onChange={() => setTypeFilter((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type])}
                          className="rounded border-muted/30 bg-muted/10 text-secondary focus:ring-secondary/50 w-3.5 h-3.5"
                        />
                        {type}
                      </label>
                    ))}
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => { setStatusFilter([]); setTypeFilter([]); setShowFilterDropdown(false); }}
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
                visibleRows.map((v, idx) => (
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
            Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} vehicles
          </p>
          <div className="text-xs text-muted/60">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* ── Vehicle Modal ── */}
      <VehicleModal isOpen={vehicleModalOpen} onClose={() => setVehicleModalOpen(false)} onSubmit={handleAddVehicle} />
    </div>
  );
}

export default Vehicles;
