import { useState } from 'react';

const initialForm = {
  tripId: '',
  driver: '',
  fuelCost: '',
  miscExpense: '',
};

function ExpenseModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.tripId.trim()) newErrors.tripId = 'Trip ID is required';
    if (!formData.driver.trim()) newErrors.driver = 'Driver name is required';
    if (!formData.fuelCost || Number(formData.fuelCost) < 0)
      newErrors.fuelCost = 'Valid fuel cost is required';
    if (formData.miscExpense !== '' && Number(formData.miscExpense) < 0)
      newErrors.miscExpense = 'Miscellaneous expense cannot be negative';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // TODO: API call to create expense
    console.log('New Expense:', formData);
    setFormData(initialForm);
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 bg-secondary/30 border rounded-lg text-accent placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm ${
      errors[field] ? 'border-red-500' : 'border-secondary'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg bg-primary border border-secondary rounded-2xl shadow-2xl flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-accent">Add Expense</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-accent transition focus:outline-none"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 flex-1">
          {/* Trip ID */}
          <div>
            <label htmlFor="e-tripId" className="block text-sm font-medium text-accent mb-1.5">
              Trip ID
            </label>
            <input
              id="e-tripId"
              name="tripId"
              type="text"
              value={formData.tripId}
              onChange={handleChange}
              placeholder="e.g. 661f1a2b3c4d5e6f7a8b9c0d"
              className={inputClass('tripId')}
            />
            {errors.tripId && <p className="text-red-400 text-xs mt-1">{errors.tripId}</p>}
          </div>

          {/* Driver */}
          <div>
            <label htmlFor="e-driver" className="block text-sm font-medium text-accent mb-1.5">
              Driver
            </label>
            <input
              id="e-driver"
              name="driver"
              type="text"
              value={formData.driver}
              onChange={handleChange}
              placeholder="e.g. James Carter"
              className={inputClass('driver')}
            />
            {errors.driver && <p className="text-red-400 text-xs mt-1">{errors.driver}</p>}
          </div>

          {/* Fuel Cost + Miscellaneous Expense */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="e-fuel" className="block text-sm font-medium text-accent mb-1.5">
                Fuel Cost (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">₹</span>
                <input
                  id="e-fuel"
                  name="fuelCost"
                  type="number"
                  min="0"
                  value={formData.fuelCost}
                  onChange={handleChange}
                  placeholder="e.g. 12000"
                  className={`${inputClass('fuelCost')} pl-8`}
                />
              </div>
              {errors.fuelCost && <p className="text-red-400 text-xs mt-1">{errors.fuelCost}</p>}
            </div>
            <div>
              <label htmlFor="e-misc" className="block text-sm font-medium text-accent mb-1.5">
                Miscellaneous Expense (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">₹</span>
                <input
                  id="e-misc"
                  name="miscExpense"
                  type="number"
                  min="0"
                  value={formData.miscExpense}
                  onChange={handleChange}
                  placeholder="e.g. 2500"
                  className={`${inputClass('miscExpense')} pl-8`}
                />
              </div>
              {errors.miscExpense && <p className="text-red-400 text-xs mt-1">{errors.miscExpense}</p>}
            </div>
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-muted hover:text-accent border border-secondary rounded-lg transition focus:outline-none"
          >
            Discard
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-accent text-primary text-sm font-semibold rounded-lg hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseModal;
