import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

/**
 * Role-based route guard.
 * If `allowedRoles` is omitted or empty ⟶ accessible to everyone.
 * Otherwise the current user's role must be in the list.
 */
function RoleRoute({ allowedRoles, children }) {
  const { user } = useUser();

  /* Not logged in → send to login */
  if (!user) return <Navigate to="/login" replace />;

  /* No restriction or role matches → render page */
  if (!allowedRoles || allowedRoles.length === 0) return children;
  if (allowedRoles.includes(user.role)) return children;

  /* Unauthorized → redirect to dashboard */
  return <Navigate to="/dashboard" replace />;
}

export default RoleRoute;
