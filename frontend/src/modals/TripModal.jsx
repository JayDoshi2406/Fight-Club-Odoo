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

const initialForm = {
  region: '',
  distance: '',
  cargoWeight: '',
};

function TripModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [citySearch, setCitySearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, region: city }));
    setCitySearch('');
    setDropdownOpen(false);
    if (errors.region) setErrors((prev) => ({ ...prev, region: '' }));
  };

  const filteredCities = INDIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.distance || Number(formData.distance) <= 0)
      newErrors.distance = 'Valid distance is required';
    if (!formData.cargoWeight || Number(formData.cargoWeight) <= 0)
      newErrors.cargoWeight = 'Valid cargo weight is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // TODO: API call to create trip
    console.log('New Trip:', formData);
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
          {/* Region (searchable dropdown) */}
          <div className="relative">
            <label htmlFor="t-region" className="block text-sm font-medium text-accent mb-1.5">
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

          {/* Distance */}
          <div>
            <label htmlFor="t-distance" className="block text-sm font-medium text-accent mb-1.5">
              Distance to Travel (kms)
            </label>
            <div className="relative">
              <input
                id="t-distance"
                name="distance"
                type="number"
                min="0"
                value={formData.distance}
                onChange={handleChange}
                placeholder="e.g. 450"
                className={`${inputClass('distance')} pr-14`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">
                kms
              </span>
            </div>
            {errors.distance && <p className="text-red-400 text-xs mt-1">{errors.distance}</p>}
          </div>

          {/* Cargo Weight */}
          <div>
            <label htmlFor="t-weight" className="block text-sm font-medium text-accent mb-1.5">
              Cargo Weight (kgs)
            </label>
            <div className="relative">
              <input
                id="t-weight"
                name="cargoWeight"
                type="number"
                min="0"
                value={formData.cargoWeight}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className={`${inputClass('cargoWeight')} pr-14`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">
                kgs
              </span>
            </div>
            {errors.cargoWeight && <p className="text-red-400 text-xs mt-1">{errors.cargoWeight}</p>}
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
