import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

/* ── Mock user (replace with real API data after login) ── */
const MOCK_USER = {
  name: 'Arjun Mehta',
  email: 'arjun.mehta@fleetflow.in',
  image: null,                      // null → shows initials fallback
  role: 'Fleet Manager',            // matches backend enum
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
