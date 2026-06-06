import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/users/${id}`);
        if (response.data?.success && response.data?.data) {
          setUser(response.data.data.user);
        }
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with back actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold mb-2 transition-colors cursor-pointer"
          >
            <span>&larr;</span> Back to Users List
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">User Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Detailed overview of account credentials and roles.</p>
        </div>
        {!loading && !error && (
          <button
            onClick={() => navigate(`/admin/users/edit/${id}`)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/10 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-sm font-medium text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-slate-400 block mt-3">Loading profile...</span>
        </div>
      ) : user ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar and Basic Summary Card */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl">
            <div className="h-24 w-24 rounded-full bg-slate-800 border-2 border-indigo-500/30 flex items-center justify-center font-bold text-3xl text-indigo-400">
              {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-xl font-bold mt-4 text-white truncate max-w-full">{user.fullname}</h2>
            <p className="text-sm text-slate-400 mt-1 truncate max-w-full">{user.email}</p>
            <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 mt-3">
              {user.role || 'Guest'}
            </span>

            <div className="w-full border-t border-slate-900/60 mt-6 pt-6 space-y-3 text-left">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Account Status</span>
                {user.is_active ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-slate-500 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                    Inactive
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Employee Category</span>
                <span className="text-slate-200 font-medium">
                  {user.is_employee ? 'Employee' : 'External'}
                </span>
              </div>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="md:col-span-2 bg-slate-900/40 border border-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-lg font-bold border-b border-slate-800 pb-3">User Profile Metadata</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Full Name</span>
                <p className="text-sm text-slate-250 font-medium mt-1">{user.fullname}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Email Address</span>
                <p className="text-sm text-indigo-300 font-medium mt-1">{user.email}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Phone Number</span>
                <p className="text-sm text-slate-250 font-medium mt-1">
                  {user.phone_number || <span className="text-slate-600">N/A</span>}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Role Name</span>
                <p className="text-sm text-indigo-400 font-semibold mt-1">{user.role || 'Guest'}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Joined At</span>
                <p className="text-sm text-slate-250 font-medium mt-1">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Metadata Block</span>
                <pre className="text-xs text-slate-400 bg-slate-950 p-2 rounded-lg mt-1 overflow-x-auto border border-slate-900">
                  {JSON.stringify(user.meta_data || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
