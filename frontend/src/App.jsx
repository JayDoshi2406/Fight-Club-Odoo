import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import Layout from './components/Layout';
import Dashboard from './Dashboard';
import Vehicles from './pages/Vehicles';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Performance from './pages/Performance';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import RoleRoute from './components/RoleRoute';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        {/* Auth routes (no navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* App routes (with navbar + sidebar) */}
        <Route path="/" element={<Layout />}>
          {/* Dashboard — all roles */}
          <Route index element={<RoleRoute><Dashboard /></RoleRoute>} />
          <Route path="dashboard" element={<RoleRoute><Dashboard /></RoleRoute>} />

          {/* Vehicle Registry — Fleet Manager (vehicle health, asset lifecycle) */}
          <Route path="vehicles" element={<RoleRoute allowedRoles={['Fleet Manager']}><Vehicles /></RoleRoute>} />

          {/* Trip Dispatcher — Dispatcher (create trips, assign drivers, validate cargo) */}
          <Route path="trips" element={<RoleRoute allowedRoles={['Dispatcher']}><Trips /></RoleRoute>} />

          {/* Maintenance — Fleet Manager (vehicle health, scheduling) */}
          <Route path="maintenance" element={<RoleRoute allowedRoles={['Fleet Manager']}><Maintenance /></RoleRoute>} />

          {/* Expenses — Financial Analyst (fuel spend, operational costs) */}
          <Route path="expenses" element={<RoleRoute allowedRoles={['Financial Analyst']}><Expenses /></RoleRoute>} />

          {/* Performance — Safety Officer (driver compliance, license expirations, safety scores) */}
          <Route path="performance" element={<RoleRoute allowedRoles={['Safety Officer']}><Performance /></RoleRoute>} />

          {/* Analytics — Financial Analyst (maintenance ROI, operational costs) */}
          <Route path="analytics" element={<RoleRoute allowedRoles={['Financial Analyst']}><Analytics /></RoleRoute>} />

          {/* Profile — all roles */}
          <Route path="profile" element={<RoleRoute><Profile /></RoleRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App
