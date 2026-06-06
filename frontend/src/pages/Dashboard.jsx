import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const stats = [
    {
      label: 'Pending Approvals',
      value: '12',
      trend: '+2 this week',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Active RFQs',
      value: '34',
      trend: '8 closing soon',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      ),
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10',
    },
    {
      label: 'Total Vendors',
      value: '189',
      trend: '12 pending review',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Monthly Spend',
      value: '$48,250',
      trend: '-4.3% vs last month',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M12 2A10 10 0 112 12A10 10 0 0112 2z"
        />
      ),
      color: 'text-sky-400',
      bg: 'bg-sky-400/10',
    },
  ];

  const activities = [
    { id: 1, action: 'RFQ Created', target: 'RFQ-2026-004', time: '10 minutes ago', status: 'Active' },
    { id: 2, action: 'Vendor Applied', target: 'Acme Steel Corp', time: '2 hours ago', status: 'Pending' },
    { id: 3, action: 'Bid Submitted', target: 'RFQ-2026-001 ($14,500)', time: '4 hours ago', status: 'Reviewing' },
    { id: 4, action: 'Role Assigned', target: 'Verifier User (Viewer)', time: '1 day ago', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation Header */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Vendor ERP
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">{user?.fullname || 'ERP User'}</p>
              <p className="text-xs text-indigo-400 font-medium tracking-wider uppercase">
                {user?.role || 'Guest'}
              </p>
            </div>

            <div className="h-8 w-px bg-slate-800"></div>

            <button
              onClick={logout}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Greetings */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.fullname?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Here is what is happening with your procurement network today.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl text-sm font-medium border border-slate-800 transition-colors shadow-sm cursor-pointer">
              Download Report
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-transform transform hover:-translate-y-0.5 cursor-pointer">
              Create RFQ
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{stat.label}</span>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {stat.icon}
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                <p className="text-xs text-slate-500 mt-1">{stat.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Operations & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-900 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase text-slate-500 border-b border-slate-900">
                  <tr>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Target</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-900/20">
                      <td className="py-4 font-medium text-white">{act.action}</td>
                      <td className="py-4">{act.target}</td>
                      <td className="py-4 text-slate-500">{act.time}</td>
                      <td className="py-4 text-right">
                        <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">User Profile & Context</h3>
              <p className="text-sm text-slate-400 mb-6">
                Assigned system context and dynamic permissions.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-slate-900 pb-3">
                  <span className="text-slate-500">Name</span>
                  <span className="font-medium text-white">{user?.fullname || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-900 pb-3">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-indigo-300">{user?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-900 pb-3">
                  <span className="text-slate-500">Access Role</span>
                  <span className="inline-flex items-center rounded-md bg-violet-400/10 px-2.5 py-0.5 text-xs font-semibold text-violet-400">
                    {user?.role || 'Guest'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-900 pb-3">
                  <span className="text-slate-500">Active Status</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    Active Session
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-indigo-600/5 rounded-2xl border border-indigo-500/10 p-4">
              <h4 className="text-sm font-bold text-indigo-300">Procurement System Tip</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Roles are relational now. Please contact the administrator if you need write permissions for RFQs or to configure vendors.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
