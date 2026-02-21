import { useState } from 'react';

const initialForm = {
  vehicleId: '',
  tripId: '',
  date: '',
  liters: '',
  cost: '',
};

function ExpenseModal({ isOpen, onClose, onSubmit }) {
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
    if (!formData.vehicleId.trim()) newErrors.vehicleId = 'Vehicle is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.liters || Number(formData.liters) <= 0)
      newErrors.liters = 'Valid liters value is required';
    if (!formData.cost || Number(formData.cost) <= 0)
      newErrors.cost = 'Valid cost is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (onSubmit) onSubmit(formData);
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
          {/* Vehicle (vehicleId) */}
          <div>
            <label htmlFor="e-vehicleId" className="block text-sm font-medium text-accent mb-1.5">
              Vehicle
            </label>
            <input
              id="e-vehicleId"
              name="vehicleId"
              type="text"
              value={formData.vehicleId}
              onChange={handleChange}
              placeholder="e.g. Volvo FH16"
              className={inputClass('vehicleId')}
            />
            {errors.vehicleId && <p className="text-red-400 text-xs mt-1">{errors.vehicleId}</p>}
          </div>

          {/* Trip ID (optional) + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="e-tripId" className="block text-sm font-medium text-accent mb-1.5">
                Trip ID <span className="text-muted text-xs">(optional)</span>
              </label>
              <input
                id="e-tripId"
                name="tripId"
                type="text"
                value={formData.tripId}
                onChange={handleChange}
                placeholder="e.g. TRP-001"
                className={inputClass('tripId')}
              />
              {errors.tripId && <p className="text-red-400 text-xs mt-1">{errors.tripId}</p>}
            </div>
            <div>
              <label htmlFor="e-date" className="block text-sm font-medium text-accent mb-1.5">
                Date
              </label>
              <input
                id="e-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={`${inputClass('date')} ${!formData.date ? 'text-muted' : ''}`}
              />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Liters + Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="e-liters" className="block text-sm font-medium text-accent mb-1.5">
                Liters
              </label>
              <div className="relative">
                <input
                  id="e-liters"
                  name="liters"
                  type="number"
                  min="0"
                  value={formData.liters}
                  onChange={handleChange}
                  placeholder="e.g. 120"
                  className={`${inputClass('liters')} pr-10`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">L</span>
              </div>
              {errors.liters && <p className="text-red-400 text-xs mt-1">{errors.liters}</p>}
            </div>
            <div>
              <label htmlFor="e-cost" className="block text-sm font-medium text-accent mb-1.5">
                Cost (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">₹</span>
                <input
                  id="e-cost"
                  name="cost"
                  type="number"
                  min="0"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="e.g. 14500"
                  className={`${inputClass('cost')} pl-8`}
                />
              </div>
              {errors.cost && <p className="text-red-400 text-xs mt-1">{errors.cost}</p>}
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
            Add Fuel Expense
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseModal;
