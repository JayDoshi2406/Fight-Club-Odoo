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

          {/* Vehicle Registry — Dispatcher, Fleet Manager */}
          <Route path="vehicles" element={<RoleRoute allowedRoles={['Fleet Manager', 'Dispatcher']}><Vehicles /></RoleRoute>} />

          {/* Trip Dispatcher — Dispatcher */}
          <Route path="trips" element={<RoleRoute allowedRoles={['Fleet Manager', 'Dispatcher']}><Trips /></RoleRoute>} />

          {/* Maintenance — Safety Officer */}
          <Route path="maintenance" element={<RoleRoute allowedRoles={['Fleet Manager', 'Safety Officer']}><Maintenance /></RoleRoute>} />

          {/* Trip & Expense — Fleet Manager, Dispatcher */}
          <Route path="expenses" element={<RoleRoute allowedRoles={['Fleet Manager', 'Dispatcher']}><Expenses /></RoleRoute>} />

          {/* Performance — Financial Analyst */}
          <Route path="performance" element={<RoleRoute allowedRoles={['Fleet Manager', 'Financial Analyst']}><Performance /></RoleRoute>} />

          {/* Analytics — Financial Analyst */}
          <Route path="analytics" element={<RoleRoute allowedRoles={['Fleet Manager', 'Financial Analyst']}><Analytics /></RoleRoute>} />

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
