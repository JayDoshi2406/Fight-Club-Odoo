import { useState } from 'react';

const initialForm = {
  vehicleId: '',
  driverId: '',
  cargoWeight: '',
  startOdometer: '',
};

function TripModal({ isOpen, onClose, onSubmit }) {
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
    if (!formData.driverId.trim()) newErrors.driverId = 'Driver is required';
    if (!formData.cargoWeight || Number(formData.cargoWeight) <= 0)
      newErrors.cargoWeight = 'Valid cargo weight is required';
    if (formData.startOdometer !== '' && Number(formData.startOdometer) < 0)
      newErrors.startOdometer = 'Start odometer cannot be negative';
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
    if (e.target === e.currentTarget) {
      onClose();
    }
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
      <div className="w-full max-w-lg bg-primary border border-secondary rounded-2xl shadow-2xl flex flex-col overflow-visible">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-accent">New Trip</h3>
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
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 overflow-visible">
          {/* Vehicle (vehicleId) */}
          <div>
            <label htmlFor="t-vehicleId" className="block text-sm font-medium text-accent mb-1.5">
              Vehicle
            </label>
            <input
              id="t-vehicleId"
              name="vehicleId"
              type="text"
              value={formData.vehicleId}
              onChange={handleChange}
              placeholder="e.g. Volvo FH16"
              className={inputClass('vehicleId')}
            />
            {errors.vehicleId && <p className="text-red-400 text-xs mt-1">{errors.vehicleId}</p>}
          </div>

          {/* Driver (driverId) */}
          <div>
            <label htmlFor="t-driverId" className="block text-sm font-medium text-accent mb-1.5">
              Driver
            </label>
            <input
              id="t-driverId"
              name="driverId"
              type="text"
              value={formData.driverId}
              onChange={handleChange}
              placeholder="e.g. Arjun Mehta"
              className={inputClass('driverId')}
            />
            {errors.driverId && <p className="text-red-400 text-xs mt-1">{errors.driverId}</p>}
          </div>

          {/* Cargo Weight + Start Odometer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-cargoWeight" className="block text-sm font-medium text-accent mb-1.5">
                Cargo Weight (Kg)
              </label>
              <div className="relative">
                <input
                  id="t-cargoWeight"
                  name="cargoWeight"
                  type="number"
                  min="0"
                  value={formData.cargoWeight}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className={`${inputClass('cargoWeight')} pr-14`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">
                  Kg
                </span>
              </div>
              {errors.cargoWeight && <p className="text-red-400 text-xs mt-1">{errors.cargoWeight}</p>}
            </div>
            <div>
              <label htmlFor="t-startOdometer" className="block text-sm font-medium text-accent mb-1.5">
                Start Odometer (Km)
              </label>
              <div className="relative">
                <input
                  id="t-startOdometer"
                  name="startOdometer"
                  type="number"
                  min="0"
                  value={formData.startOdometer}
                  onChange={handleChange}
                  placeholder="e.g. 45200"
                  className={`${inputClass('startOdometer')} pr-14`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">
                  Km
                </span>
              </div>
              {errors.startOdometer && <p className="text-red-400 text-xs mt-1">{errors.startOdometer}</p>}
            </div>
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-muted hover:text-accent border border-secondary rounded-lg transition focus:outline-none cursor-pointer"
          >
            Discard
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-accent text-primary text-sm font-semibold rounded-lg hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
          >
            Create Trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripModal;
