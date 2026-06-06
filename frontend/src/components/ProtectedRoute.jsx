import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from './layout/PageWrapper';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If the user does not have the required role, you might redirect to a generic dashboard or unauthorized page
    return <Navigate to="/dashboard" replace />;
  }

  // Wrap protected routes in the PageWrapper layout
  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  );
};

export default ProtectedRoute;
