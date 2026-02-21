import { useState, useMemo, useRef, useEffect } from 'react';
import ServiceModal from '../modals/ServiceModal';

/* ── Generated maintenance data ── */
const _MAINT_VEHICLES = ['Tata Prima', 'Ashok Leyland 4825', 'Eicher Pro 3015', 'BharatBenz 3523R', 'Volvo FMX', 'Tata Winger Cargo', 'Mahindra Supro Maxitruck', 'Ashok Leyland Dost+', 'Maruti Suzuki Eeco Cargo', 'Force Traveller Delivery Van', 'Hero HF Deluxe', 'Bajaj CT 110', 'TVS XL100', 'Honda Shine', 'Suzuki Access 125'];
const _SERVICE_TYPES = ['Engine Oil Change', 'Brake Pad Replacement', 'Transmission Repair', 'Tire Rotation & Alignment', 'AC Compressor Fix', 'Battery Replacement', 'Clutch Plate Change', 'Radiator Flush', 'Suspension Overhaul', 'Headlight Assembly', 'Chain & Sprocket Kit', 'Turbocharger Service', 'Fuel Injector Cleaning', 'Wheel Bearing Replacement', 'Air Filter Replacement', 'Spark Plug Change', 'Timing Belt Replacement', 'Differential Repair', 'Exhaust System Fix', 'Power Steering Service'];
const _NOTES = ['Routine service', 'Parts replaced with OEM', 'Reported by driver', 'Under warranty claim', 'Preventive maintenance', 'Emergency repair', 'Scheduled overhaul', 'Minor adjustment', 'Complete rebuild', 'Inspection passed'];

const MAINTENANCE_DATA = Array.from({ length: 100 }, (_, i) => {
  const d = new Date(2026, 1, 21 - (i % 90));
  return {
    id: i + 1,
    vehicleId: _MAINT_VEHICLES[i % 15],
    serviceType: _SERVICE_TYPES[i % 20],
    date: d.toISOString().split('T')[0],
    cost: 1000 + ((i * 1571) % 45000),
    notes: i % 3 === 0 ? '' : _NOTES[i % 10],
  };
});

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
function Maintenance() {
  const [search, setSearch] = useState('');
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState(MAINTENANCE_DATA);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const sortRef = useRef(null);
  const filterRef = useRef(null);
  const sentinelRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const SORT_COLUMNS = [
    { key: 'vehicleId', label: 'Vehicle' },
    { key: 'serviceType', label: 'Service Type' },
    { key: 'date', label: 'Date' },
    { key: 'cost', label: 'Cost' },
    { key: 'notes', label: 'Notes' },
  ];

  const ALL_VEHICLES = [...new Set(MAINTENANCE_DATA.map((m) => m.vehicleId))].sort();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortDropdown(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddService = (formData) => {
    const newRecord = {
      id: maintenanceRecords.length > 0 ? Math.max(...maintenanceRecords.map((m) => m.id)) + 1 : 1,
      vehicleId: formData.vehicleId,
      serviceType: formData.serviceType,
      date: formData.date,
      cost: Number(formData.cost),
      notes: formData.notes || '',
    };
    setMaintenanceRecords((prev) => [newRecord, ...prev]);
  };

  const filtered = useMemo(() => {
    let data = maintenanceRecords;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (m) =>
          m.vehicleId.toLowerCase().includes(q) ||
          m.serviceType.toLowerCase().includes(q) ||
          m.date.includes(q) ||
          String(m.cost).includes(q) ||
          (m.notes && m.notes.toLowerCase().includes(q))
      );
    }
    if (vehicleFilter.length > 0) {
      data = data.filter((m) => vehicleFilter.includes(m.vehicleId));
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
  }, [search, maintenanceRecords, sortConfig, vehicleFilter]);

  useEffect(() => { setVisibleCount(10); }, [search, sortConfig, vehicleFilter]);

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
        <h2 className="text-2xl font-bold text-accent">Maintenance</h2>
        <p className="text-muted mt-1 text-sm">Track vehicle maintenance schedules and service history.</p>
      </div>

      {/* ── Maintenance Table Card ── */}
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
                placeholder="Search vehicles, issues, dates…"
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
                    vehicleFilter.length > 0 ? 'border-secondary/50 text-accent' : 'border-muted/20 text-muted hover:text-accent hover:bg-muted/15'
                  }`}
                >
                  <FilterIcon />
                  <span className="hidden md:inline">Filter</span>
                  {vehicleFilter.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-secondary/30 text-xs text-accent font-semibold">{vehicleFilter.length}</span>
                  )}
                </button>
                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-[#1e2b34] border border-muted/20 rounded-lg shadow-xl z-50 py-2 max-h-80 overflow-y-auto">
                    <p className="px-4 py-1.5 text-xs text-muted uppercase tracking-wider font-semibold">Vehicle</p>
                    {ALL_VEHICLES.map((vehicle) => (
                      <label key={vehicle} className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted hover:text-accent hover:bg-muted/10 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={vehicleFilter.includes(vehicle)}
                          onChange={() => setVehicleFilter((prev) => prev.includes(vehicle) ? prev.filter((v) => v !== vehicle) : [...prev, vehicle])}
                          className="rounded border-muted/30 bg-muted/10 text-secondary focus:ring-secondary/50 w-3.5 h-3.5"
                        />
                        {vehicle}
                      </label>
                    ))}
                    {vehicleFilter.length > 0 && (
                      <button
                        onClick={() => { setVehicleFilter([]); setShowFilterDropdown(false); }}
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

          {/* Create New Service button row */}
          <div className="flex items-center justify-between border-b border-muted/15 pb-4">
            <p className="text-sm text-muted">
              <span className="text-accent font-semibold">{filtered.length}</span> record{filtered.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={() => setServiceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-primary text-sm font-semibold rounded-lg hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-accent shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Service
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
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Service Type</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Date</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Cost</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {filtered.length > 0 ? (
                visibleRows.map((m, idx) => (
                  <tr
                    key={m.id}
                    className={`hover:bg-muted/8 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/[0.03]'}`}
                  >
                    <td className="px-5 py-4 text-muted font-mono text-center">{idx + 1}</td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition font-medium">
                        {m.vehicleId}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-accent text-center">{m.serviceType}</td>
                    <td className="px-5 py-4 text-muted text-center font-mono">
                      {new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-accent font-mono font-medium">₹{m.cost.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-5 py-4 text-muted text-center text-xs truncate max-w-45" title={m.notes}>
                      {m.notes || '—'}
                    </td>
                  </tr>
                ))
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
            Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} records
          </p>
          <div className="text-xs text-muted/60">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      {/* ── Service Modal ── */}
      <ServiceModal isOpen={serviceModalOpen} onClose={() => setServiceModalOpen(false)} onSubmit={handleAddService} />
    </div>
  );
}

export default Maintenance;
