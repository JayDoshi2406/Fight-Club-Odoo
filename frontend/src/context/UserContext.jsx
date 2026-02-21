import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

/* ── Mock user (replace with real API data after login) ── */
// const MOCK_USER = {
//   name: 'Jay Doshi',
//   email: 'jay.doshi@fleetflow.in',
//   image: null,                      
//   role: 'Fleet Manager',            
//   createdAt: '2025-08-15T10:30:00Z',
// };
// const MOCK_USER = {
//   name: 'Yash Kambaria',
//   email: 'kambaria.yash@fleetflow.in',
//   image: null,                     
//   role: 'Dispatcher',           
//   createdAt: '2025-08-15T10:30:00Z',
// };
// const MOCK_USER = {
//   name: 'Jayveer Dahiya',
//   email: 'dahiya_jayveer@fleetflow.in',
//   image: null,                     
//   role: 'Safety Officer',            
//   createdAt: '2025-08-15T10:30:00Z',
// };
const MOCK_USER = {
  name: 'Aryan Hansoti',
  email: 'aryan.hansoti@fleetflow.in',
  image: null,                      
  role: 'Financial Analyst',            
  createdAt: '2025-08-15T10:30:00Z',
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export default UserContext;
