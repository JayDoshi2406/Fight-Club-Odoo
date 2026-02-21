import { useState, useMemo } from 'react';
import ExpenseModal from '../modals/ExpenseModal';

/* ── Sample expense data ── */
const EXPENSES_DATA = [
  { id: 1, driver: 'James Carter', distance: 1240, fuelExpense: 14500, miscExpense: 3200, status: 'Approved' },
  { id: 2, driver: 'Maria Lopez', distance: 870, fuelExpense: 9800, miscExpense: 1500, status: 'Pending' },
  { id: 3, driver: 'Raj Patel', distance: 1560, fuelExpense: 18200, miscExpense: 4800, status: 'Approved' },
  { id: 4, driver: 'Emily Chen', distance: 640, fuelExpense: 7200, miscExpense: 900, status: 'Rejected' },
  { id: 5, driver: 'Ahmed Hassan', distance: 2100, fuelExpense: 24500, miscExpense: 6200, status: 'Approved' },
  { id: 6, driver: 'Luca Rossi', distance: 430, fuelExpense: 4800, miscExpense: 1200, status: 'Pending' },
  { id: 7, driver: 'Sarah Kim', distance: 1800, fuelExpense: 21000, miscExpense: 5500, status: 'Approved' },
  { id: 8, driver: 'David Brown', distance: 950, fuelExpense: 11200, miscExpense: 2800, status: 'Pending' },
  { id: 9, driver: 'Anna Schmidt', distance: 1120, fuelExpense: 13100, miscExpense: 3600, status: 'Rejected' },
  { id: 10, driver: 'Tom Wilson', distance: 760, fuelExpense: 8600, miscExpense: 2100, status: 'Approved' },
];

const STATUS_STYLES = {
  Approved: 'bg-green-500/20 text-green-300',
  Pending: 'bg-yellow-500/20 text-yellow-300',
  Rejected: 'bg-red-500/20 text-red-300',
};

const STATUS_DOT = {
  Approved: 'bg-green-400',
  Pending: 'bg-yellow-400',
  Rejected: 'bg-red-400',
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
function Expenses() {
  const [search, setSearch] = useState('');
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return EXPENSES_DATA;
    const q = search.toLowerCase();
    return EXPENSES_DATA.filter(
      (e) =>
        e.driver.toLowerCase().includes(q) ||
        e.status.toLowerCase().includes(q) ||
        String(e.distance).includes(q) ||
        String(e.fuelExpense).includes(q) ||
        String(e.miscExpense).includes(q)
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
                placeholder="Search drivers, expenses, status…"
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

          {/* Add Expense button row */}
          <div className="flex items-center justify-between border-b border-secondary/50 pb-4">
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
              Add Expense
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-secondary/15">
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Sr. No.</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Driver</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Distance (Km)</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Fuel Expense</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Misc. Expense</th>
                <th className="px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/30">
              {filtered.length > 0 ? (
                filtered.map((e, idx) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-secondary/15 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-secondary/5'}`}
                  >
                    <td className="px-5 py-4 text-muted font-mono text-center">{idx + 1}</td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-accent hover:underline underline-offset-2 cursor-pointer transition font-medium">
                        {e.driver}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-accent text-center font-mono">{e.distance.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-accent font-mono font-medium">₹{e.fuelExpense.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-accent font-mono font-medium">₹{e.miscExpense.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[e.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[e.status]}`} />
                        {e.status}
                      </span>
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
        <div className="px-5 py-3.5 border-t border-secondary/30 flex items-center justify-between">
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
