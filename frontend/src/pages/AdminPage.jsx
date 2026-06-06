import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Admin Control Center</h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure security, user permissions, and master settings.
        </p>
      </div>

      {/* Admin Quick Message */}
      <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-indigo-300">Welcome to Administrative Portal</h3>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          As a registered user with access, you can manage user role assignments, audit system transactions, and supervise procurement operations.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">User Management</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Assign roles, create accounts, update user access lists, and manage employee profiles.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer self-start"
          >
            Manage Users
            <span>&rarr;</span>
          </button>
        </div>

        {/* Roles Management */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-405 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Roles Management</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Configure system roles, update authorization rankings, and define permission groups.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/roles')}
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-350 flex items-center gap-1.5 transition-colors cursor-pointer self-start"
          >
            Manage Roles
            <span>&rarr;</span>
          </button>
        </div>

        {/* Audit Logs */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Audit Logs</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Track database updates, api execution, user logins, and administrative system revisions.
            </p>
          </div>
          <button
            onClick={() => {}}
            className="text-sm font-semibold text-violet-400 hover:text-violet-350 flex items-center gap-1.5 transition-colors cursor-pointer self-start opacity-60"
            disabled
          >
            View Logs (Coming Soon)
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
