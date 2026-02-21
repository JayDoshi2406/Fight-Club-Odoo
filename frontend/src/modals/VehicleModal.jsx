import { useState } from 'react';

const INDIAN_CITIES = [
  'Agartala', 'Agra', 'Ahmedabad', 'Aizawl', 'Ajmer', 'Aligarh', 'Allahabad', 'Amravati', 'Amritsar', 'Anantapur',
  'Aurangabad', 'Ayodhya', 'Bangalore', 'Bareilly', 'Bathinda', 'Belgaum', 'Bellary', 'Bhopal', 'Bhubaneswar', 'Bikaner',
  'Bilaspur', 'Bokaro', 'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack', 'Darbhanga', 'Davangere', 'Dehradun', 'Delhi',
  'Dhanbad', 'Dharwad', 'Dindigul', 'Durg', 'Durgapur', 'Erode', 'Faridabad', 'Firozabad', 'Gandhinagar', 'Gangtok',
  'Gaya', 'Ghaziabad', 'Gorakhpur', 'Gulbarga', 'Guntur', 'Gurgaon', 'Guwahati', 'Gwalior', 'Haridwar', 'Hubli',
  'Hyderabad', 'Imphal', 'Indore', 'Itanagar', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jalgaon', 'Jammu', 'Jamshedpur',
  'Jhansi', 'Jodhpur', 'Junagadh', 'Kakinada', 'Kalyan', 'Kanpur', 'Karimnagar', 'Karnal', 'Kochi', 'Kolhapur',
  'Kolkata', 'Kollam', 'Kota', 'Kottayam', 'Kozhikode', 'Kurnool', 'Latur', 'Lucknow', 'Ludhiana', 'Madurai',
  'Malegaon', 'Mangalore', 'Mathura', 'Meerut', 'Moradabad', 'Mumbai', 'Muzaffarnagar', 'Muzaffarpur', 'Mysore', 'Nagpur',
  'Nanded', 'Nashik', 'Navi Mumbai', 'Nellore', 'New Delhi', 'Nizamabad', 'Noida', 'Panaji', 'Panipat', 'Patiala',
  'Patna', 'Pondicherry', 'Pune', 'Raipur', 'Rajahmundry', 'Rajkot', 'Ranchi', 'Ratlam', 'Rohtak', 'Rourkela',
  'Saharanpur', 'Salem', 'Sangli', 'Satara', 'Shillong', 'Shimla', 'Siliguri', 'Solapur', 'Sonipat', 'Srinagar',
  'Surat', 'Thanjavur', 'Thane', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli', 'Tirunelveli', 'Tirupati', 'Tiruppur', 'Tumkur',
  'Udaipur', 'Ujjain', 'Vadodara', 'Varanasi', 'Vasai-Virar', 'Vellore', 'Vijayawada', 'Visakhapatnam', 'Warangal', 'Yavatmal',
];

const VEHICLE_TYPES = ['Truck', 'Van', 'Bike'];

const initialForm = {
  name: '',
  model: '',
  licensePlate: '',
  vehicleType: '',
  region: '',
  maxLoadCapacity: '',
  odometer: '',
  acquisitionCost: '',
};

function VehicleModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [citySearch, setCitySearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, region: city }));
    setCitySearch('');
    setDropdownOpen(false);
    if (errors.region) setErrors((prev) => ({ ...prev, region: '' }));
  };

  const filteredCities = INDIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vehicle name is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.maxLoadCapacity || Number(formData.maxLoadCapacity) <= 0)
      newErrors.maxLoadCapacity = 'Valid load capacity is required';
    if (formData.odometer === '' || Number(formData.odometer) < 0)
      newErrors.odometer = 'Valid odometer reading is required';
    if (!formData.acquisitionCost || Number(formData.acquisitionCost) <= 0)
      newErrors.acquisitionCost = 'Valid acquisition cost is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // TODO: API call to create vehicle
    console.log('New Vehicle:', formData);
    setFormData(initialForm);
    setCitySearch('');
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setDropdownOpen(false);
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
      <div className="w-full max-w-2xl bg-primary border border-secondary rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-visible">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary">
          <h3 className="text-lg font-bold text-accent">New Vehicle</h3>
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
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5 flex-1 overflow-visible">
          {/* Row 1: Name + Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="v-name" className="block text-sm font-medium text-accent mb-1.5">
                Vehicle Name
              </label>
              <input
                id="v-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Volvo FH16"
                className={inputClass('name')}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="v-model" className="block text-sm font-medium text-accent mb-1.5">
                Model
              </label>
              <input
                id="v-model"
                name="model"
                type="text"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. FH16 2025"
                className={inputClass('model')}
              />
              {errors.model && <p className="text-red-400 text-xs mt-1">{errors.model}</p>}
            </div>
          </div>

          {/* Row 2: License Plate + Vehicle Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="v-license" className="block text-sm font-medium text-accent mb-1.5">
                License Plate
              </label>
              <input
                id="v-license"
                name="licensePlate"
                type="text"
                value={formData.licensePlate}
                onChange={handleChange}
                placeholder="e.g. KA-01-AB-1234"
                className={inputClass('licensePlate')}
              />
              {errors.licensePlate && (
                <p className="text-red-400 text-xs mt-1">{errors.licensePlate}</p>
              )}
            </div>
            <div>
              <label htmlFor="v-type" className="block text-sm font-medium text-accent mb-1.5">
                Vehicle Type
              </label>
              <select
                id="v-type"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className={`${inputClass('vehicleType')} appearance-none cursor-pointer ${
                  !formData.vehicleType ? 'text-muted' : ''
                }`}
              >
                <option value="" disabled>
                  Select type
                </option>
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-primary text-accent">
                    {t}
                  </option>
                ))}
              </select>
              {errors.vehicleType && (
                <p className="text-red-400 text-xs mt-1">{errors.vehicleType}</p>
              )}
            </div>
          </div>

          {/* Row 3: Region + Max Load Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="v-region" className="block text-sm font-medium text-accent mb-1.5">
                Region (City)
              </label>
              <div
                className={`flex items-center ${inputClass('region')} cursor-pointer`}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {formData.region ? (
                  <span className="flex-1 text-accent">{formData.region}</span>
                ) : (
                  <span className="flex-1 text-muted">Select a city</span>
                )}
                <svg
                  className={`w-4 h-4 text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {dropdownOpen && (
                <div className="absolute z-60 mt-1 w-full bg-primary border border-secondary rounded-lg shadow-xl max-h-60 flex flex-col overflow-hidden">
                  {/* Search inside dropdown */}
                  <div className="p-2 border-b border-secondary/50">
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      placeholder="Search cities…"
                      className="w-full px-3 py-2 bg-secondary/30 border border-secondary/50 rounded-md text-accent placeholder-muted text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {/* City list */}
                  <ul className="overflow-y-auto flex-1">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <li key={city}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCitySelect(city);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-secondary/30 ${
                              formData.region === city
                                ? 'text-accent bg-secondary/20 font-medium'
                                : 'text-muted'
                            }`}
                          >
                            {city}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-muted text-sm text-center">No cities found</li>
                    )}
                  </ul>
                </div>
              )}
              {errors.region && <p className="text-red-400 text-xs mt-1">{errors.region}</p>}
            </div>
            <div>
              <label htmlFor="v-capacity" className="block text-sm font-medium text-accent mb-1.5">
                Max Load Capacity (kg)
              </label>
              <input
                id="v-capacity"
                name="maxLoadCapacity"
                type="number"
                min="0"
                value={formData.maxLoadCapacity}
                onChange={handleChange}
                placeholder="e.g. 10000"
                className={inputClass('maxLoadCapacity')}
              />
              {errors.maxLoadCapacity && (
                <p className="text-red-400 text-xs mt-1">{errors.maxLoadCapacity}</p>
              )}
            </div>
          </div>

          {/* Row 4: Odometer + Acquisition Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="v-odometer" className="block text-sm font-medium text-accent mb-1.5">
                Odometer (kms)
              </label>
              <div className="relative">
                <input
                  id="v-odometer"
                  name="odometer"
                  type="number"
                  min="0"
                  value={formData.odometer}
                  onChange={handleChange}
                  placeholder="e.g. 25000"
                  className={`${inputClass('odometer')} pr-14`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">
                  kms
                </span>
              </div>
              {errors.odometer && <p className="text-red-400 text-xs mt-1">{errors.odometer}</p>}
            </div>
            <div>
              <label htmlFor="v-cost" className="block text-sm font-medium text-accent mb-1.5">
                Acquisition Cost (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">
                  ₹
                </span>
                <input
                  id="v-cost"
                  name="acquisitionCost"
                  type="number"
                  min="0"
                  value={formData.acquisitionCost}
                  onChange={handleChange}
                  placeholder="e.g. 3500000"
                  className={`${inputClass('acquisitionCost')} pl-8`}
                />
              </div>
              {errors.acquisitionCost && (
                <p className="text-red-400 text-xs mt-1">{errors.acquisitionCost}</p>
              )}
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
            Add Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleModal;
