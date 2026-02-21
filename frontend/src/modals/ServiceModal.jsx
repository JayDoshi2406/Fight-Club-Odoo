import { useState } from 'react';

const initialForm = {
  vehicleId: '',
  serviceType: '',
  date: '',
  cost: '',
  notes: '',
};

function ServiceModal({ isOpen, onClose }) {
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
    if (!formData.serviceType.trim()) newErrors.serviceType = 'Service type is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.cost || Number(formData.cost) <= 0) newErrors.cost = 'Valid cost is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // TODO: API call to create service record
    console.log('New Service:', formData);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-accent">Create New Service</h3>
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
            <label htmlFor="s-vehicle" className="block text-sm font-medium text-accent mb-1.5">
              Vehicle
            </label>
            <input
              id="s-vehicle"
              name="vehicleId"
              type="text"
              value={formData.vehicleId}
              onChange={handleChange}
              placeholder="e.g. Volvo FH16"
              className={inputClass('vehicleId')}
            />
            {errors.vehicleId && <p className="text-red-400 text-xs mt-1">{errors.vehicleId}</p>}
          </div>

          {/* Service Type */}
          <div>
            <label htmlFor="s-serviceType" className="block text-sm font-medium text-accent mb-1.5">
              Service Type
            </label>
            <input
              id="s-serviceType"
              name="serviceType"
              type="text"
              value={formData.serviceType}
              onChange={handleChange}
              placeholder="e.g. Oil Change"
              className={inputClass('serviceType')}
            />
            {errors.serviceType && <p className="text-red-400 text-xs mt-1">{errors.serviceType}</p>}
          </div>

          {/* Date + Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="s-date" className="block text-sm font-medium text-accent mb-1.5">
                Date
              </label>
              <input
                id="s-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={`${inputClass('date')} ${!formData.date ? 'text-muted' : ''}`}
              />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="s-cost" className="block text-sm font-medium text-accent mb-1.5">
                Cost (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">₹</span>
                <input
                  id="s-cost"
                  name="cost"
                  type="number"
                  min="0"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className={`${inputClass('cost')} pl-8`}
                />
              </div>
              {errors.cost && <p className="text-red-400 text-xs mt-1">{errors.cost}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="s-notes" className="block text-sm font-medium text-accent mb-1.5">
              Notes <span className="text-muted text-xs">(optional)</span>
            </label>
            <textarea
              id="s-notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional remarks…"
              className={`${inputClass('notes')} resize-none`}
            />
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
            Create Service
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceModal;
