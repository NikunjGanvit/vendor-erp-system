import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import Profile from './pages/Profile';
import UserList from './pages/admin/user-management/List';
import CreateUser from './pages/admin/user-management/Create';
import EditUser from './pages/admin/user-management/Edit';
import ViewUser from './pages/admin/user-management/View';
import RoleList from './pages/admin/roles/List';
import CreateRole from './pages/admin/roles/Create';
import EditRole from './pages/admin/roles/Edit';
import ViewRole from './pages/admin/roles/View';
import POList from './pages/purchase-orders/List';
import POCreate from './pages/purchase-orders/Create';
import POView from './pages/purchase-orders/View';
import RFQList from './pages/rfqs/List';
import RFQCreate from './pages/rfqs/Create';
import RFQView from './pages/rfqs/View';

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center flex-col gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin">
          <Route index element={<AdminPage />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/create" element={<CreateUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="users/view/:id" element={<ViewUser />} />
          <Route path="roles" element={<RoleList />} />
          <Route path="roles/create" element={<CreateRole />} />
          <Route path="roles/edit/:id" element={<EditRole />} />
          <Route path="roles/view/:id" element={<ViewRole />} />
        </Route>
        <Route path="purchase-orders">
          <Route index element={<POList />} />
          <Route path="create" element={<POCreate />} />
          <Route path=":id" element={<POView />} />
        </Route>
        <Route path="rfqs">
          <Route index element={<RFQList />} />
          <Route path="create" element={<RFQCreate />} />
          <Route path=":id" element={<RFQView />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

