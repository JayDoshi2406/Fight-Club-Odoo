import { useState, useMemo } from 'react';
import ServiceModal from '../modals/ServiceModal';

/* ── Sample maintenance data (matches ServiceLogSchema) ── */
const MAINTENANCE_DATA = [
  { id: 1, vehicleId: 'Volvo FH16', serviceType: 'Engine Oil Change', date: '2026-02-18', cost: 4500, notes: 'Routine 10K km service' },
  { id: 2, vehicleId: 'Scania R500', serviceType: 'Brake Pad Replacement', date: '2026-02-15', cost: 8200, notes: 'Front and rear pads replaced' },
  { id: 3, vehicleId: 'MAN TGX', serviceType: 'Transmission Repair', date: '2026-02-12', cost: 32000, notes: 'Gear slipping reported by driver' },
  { id: 4, vehicleId: 'DAF XF', serviceType: 'Tire Rotation & Alignment', date: '2026-02-10', cost: 6800, notes: '' },
  { id: 5, vehicleId: 'Mercedes Actros', serviceType: 'AC Compressor Fix', date: '2026-02-08', cost: 12500, notes: 'Compressor replaced with OEM part' },
  { id: 6, vehicleId: 'Tata Ace Gold', serviceType: 'Battery Replacement', date: '2026-02-05', cost: 3200, notes: 'Amaron Pro 65Ah installed' },
  { id: 7, vehicleId: 'Mahindra Supro', serviceType: 'Clutch Plate Change', date: '2026-02-03', cost: 7500, notes: '' },
  { id: 8, vehicleId: 'Kenworth T680', serviceType: 'Radiator Flush', date: '2026-01-28', cost: 5600, notes: 'Coolant topped up' },
  { id: 9, vehicleId: 'Peterbilt 579', serviceType: 'Suspension Overhaul', date: '2026-01-25', cost: 28000, notes: 'All leaf springs replaced' },
  { id: 10, vehicleId: 'Freightliner Cascadia', serviceType: 'Headlight Assembly', date: '2026-01-20', cost: 4200, notes: 'LED upgrade' },
  { id: 11, vehicleId: 'Bajaj Maxima', serviceType: 'Chain & Sprocket Kit', date: '2026-01-18', cost: 1800, notes: '' },
  { id: 12, vehicleId: 'Iveco S-Way', serviceType: 'Turbocharger Service', date: '2026-01-15', cost: 45000, notes: 'Turbo rebuilt, new bearings' },
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
function Maintenance() {
  const [search, setSearch] = useState('');
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return MAINTENANCE_DATA;
    const q = search.toLowerCase();
    return MAINTENANCE_DATA.filter(
      (m) =>
        m.vehicleId.toLowerCase().includes(q) ||
        m.serviceType.toLowerCase().includes(q) ||
        m.date.includes(q) ||
        String(m.cost).includes(q) ||
        (m.notes && m.notes.toLowerCase().includes(q))
    );
  }, [search]);

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
                filtered.map((m, idx) => (
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

        {/* ── Table footer ── */}
        <div className="px-5 py-3.5 border-t border-muted/10 flex items-center justify-between">
          <p className="text-xs text-muted">
            Showing {filtered.length} of {MAINTENANCE_DATA.length} records
          </p>
          <div className="text-xs text-muted/60">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      {/* ── Service Modal ── */}
      <ServiceModal isOpen={serviceModalOpen} onClose={() => setServiceModalOpen(false)} />
    </div>
  );
}

export default Maintenance;
