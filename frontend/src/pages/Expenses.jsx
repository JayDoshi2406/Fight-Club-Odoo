import { useState, useMemo } from 'react';
import ExpenseModal from '../modals/ExpenseModal';

/* ── Sample fuel expense data (matches FuelExpenseSchema) ── */
const EXPENSES_DATA = [
  { id: 1, vehicleId: 'Volvo FH16', tripId: 'TRP-001', date: '2026-02-18', liters: 120, cost: 14500 },
  { id: 2, vehicleId: 'Tata Ace Gold', tripId: 'TRP-002', date: '2026-02-17', liters: 45, cost: 5400 },
  { id: 3, vehicleId: 'Scania R500', tripId: 'TRP-003', date: '2026-02-16', liters: 180, cost: 21600 },
  { id: 4, vehicleId: 'Bajaj Maxima', tripId: null, date: '2026-02-15', liters: 8, cost: 960 },
  { id: 5, vehicleId: 'MAN TGX', tripId: 'TRP-005', date: '2026-02-14', liters: 200, cost: 24000 },
  { id: 6, vehicleId: 'Mahindra Supro', tripId: 'TRP-006', date: '2026-02-13', liters: 35, cost: 4200 },
  { id: 7, vehicleId: 'DAF XF', tripId: 'TRP-007', date: '2026-02-12', liters: 160, cost: 19200 },
  { id: 8, vehicleId: 'Mercedes Actros', tripId: null, date: '2026-02-11', liters: 140, cost: 16800 },
  { id: 9, vehicleId: 'Kenworth T680', tripId: 'TRP-009', date: '2026-02-10', liters: 190, cost: 22800 },
  { id: 10, vehicleId: 'Peterbilt 579', tripId: 'TRP-010', date: '2026-02-09', liters: 175, cost: 21000 },
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
function Expenses() {
  const [search, setSearch] = useState('');
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return EXPENSES_DATA;
    const q = search.toLowerCase();
    return EXPENSES_DATA.filter(
      (e) =>
        e.vehicleId.toLowerCase().includes(q) ||
        (e.tripId && e.tripId.toLowerCase().includes(q)) ||
        e.date.includes(q) ||
        String(e.liters).includes(q) ||
        String(e.cost).includes(q)
    );
  }, [search]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-350 mx-auto">
      {/* ── Page Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-accent">Trip & Expense</h2>
        <p className="text-muted mt-1 text-sm">Monitor trip costs and manage driver expenses.</p>
      </div>

      {/* ── Expense Table Card ── */}
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
                placeholder="Search vehicle, trip ID, date…"
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

          {/* Add Expense button row */}
          <div className="flex items-center justify-between border-b border-muted/15 pb-4">
            <p className="text-sm text-muted">
              <span className="text-accent font-semibold">{filtered.length}</span> record{filtered.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={() => setExpenseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-primary text-sm font-semibold rounded-lg hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-accent shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Fuel Expense
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
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Trip ID</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Date</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Liters</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {filtered.length > 0 ? (
                filtered.map((e, idx) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-muted/8 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/[0.03]'}`}
                  >
                    <td className="px-5 py-4 text-muted font-mono text-center">{idx + 1}</td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition font-medium">
                        {e.vehicleId}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-muted text-center font-mono text-xs">{e.tripId || '—'}</td>
                    <td className="px-5 py-4 text-muted text-center font-mono">
                      {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-accent text-center font-mono">{e.liters}</td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-accent font-mono font-medium">₹{e.cost.toLocaleString('en-IN')}</span>
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
            Showing {filtered.length} of {EXPENSES_DATA.length} records
          </p>
          <div className="text-xs text-muted/60">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* ── Expense Modal ── */}
      <ExpenseModal isOpen={expenseModalOpen} onClose={() => setExpenseModalOpen(false)} />
    </div>
  );
}

export default Expenses;
