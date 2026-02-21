import { useState, useMemo } from 'react';
import ServiceModal from '../modals/ServiceModal';

/* ── Sample maintenance data ── */
const MAINTENANCE_DATA = [
  { id: 1, vehicle: 'Volvo FH16', issue: 'Engine Oil Change', date: '2026-02-18', cost: 4500 },
  { id: 2, vehicle: 'Scania R500', issue: 'Brake Pad Replacement', date: '2026-02-15', cost: 8200 },
  { id: 3, vehicle: 'MAN TGX', issue: 'Transmission Repair', date: '2026-02-12', cost: 32000 },
  { id: 4, vehicle: 'DAF XF', issue: 'Tire Rotation & Alignment', date: '2026-02-10', cost: 6800 },
  { id: 5, vehicle: 'Mercedes Actros', issue: 'AC Compressor Fix', date: '2026-02-08', cost: 12500 },
  { id: 6, vehicle: 'Tata Ace Gold', issue: 'Battery Replacement', date: '2026-02-05', cost: 3200 },
  { id: 7, vehicle: 'Mahindra Supro', issue: 'Clutch Plate Change', date: '2026-02-03', cost: 7500 },
  { id: 8, vehicle: 'Kenworth T680', issue: 'Radiator Flush', date: '2026-01-28', cost: 5600 },
  { id: 9, vehicle: 'Peterbilt 579', issue: 'Suspension Overhaul', date: '2026-01-25', cost: 28000 },
  { id: 10, vehicle: 'Freightliner Cascadia', issue: 'Headlight Assembly', date: '2026-01-20', cost: 4200 },
  { id: 11, vehicle: 'Bajaj Maxima', issue: 'Chain & Sprocket Kit', date: '2026-01-18', cost: 1800 },
  { id: 12, vehicle: 'Iveco S-Way', issue: 'Turbocharger Service', date: '2026-01-15', cost: 45000 },
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
        m.vehicle.toLowerCase().includes(q) ||
        m.issue.toLowerCase().includes(q) ||
        m.date.includes(q) ||
        String(m.cost).includes(q)
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
                placeholder="Search vehicles, issues, dates…"
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

          {/* Create New Service button row */}
          <div className="flex items-center justify-between border-b border-secondary/50 pb-4">
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
              <tr className="bg-secondary/15">
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Sr. No.</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Vehicle</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Issue / Service</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Date</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/30">
              {filtered.length > 0 ? (
                filtered.map((m, idx) => (
                  <tr
                    key={m.id}
                    className={`hover:bg-secondary/15 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-secondary/5'}`}
                  >
                    <td className="px-5 py-4 text-muted font-mono text-center">{idx + 1}</td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition font-medium">
                        {m.vehicle}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-accent text-center">{m.issue}</td>
                    <td className="px-5 py-4 text-muted text-center font-mono">
                      {new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-accent font-mono font-medium">₹{m.cost.toLocaleString('en-IN')}</span>
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
        <div className="px-5 py-3.5 border-t border-secondary/30 flex items-center justify-between">
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
