import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', roles: ['Admin', 'Procurement Officer', 'Vendor', 'Manager'] },
    { name: 'Vendors', path: '/vendors', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', roles: ['Admin', 'Procurement Officer', 'Manager'] },
    { name: 'RFQs', path: '/rfqs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', roles: ['Admin', 'Procurement Officer', 'Vendor', 'Manager'] },
    { name: 'Quotations', path: '/quotations', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', roles: ['Admin', 'Procurement Officer', 'Vendor', 'Manager'] },
    { name: 'Approvals', path: '/approvals', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', roles: ['Admin', 'Manager'] },
    { name: 'Purchase Orders', path: '/pos', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', roles: ['Admin', 'Procurement Officer', 'Vendor', 'Manager'] },
    { name: 'Invoices', path: '/invoices', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z', roles: ['Admin', 'Procurement Officer', 'Vendor', 'Manager'] },
    { name: 'Analytics', path: '/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', roles: ['Admin', 'Manager'] },
  ];

  // Filter links based on user role
  const visibleLinks = links.filter((link) => user && link.roles.includes(user.role));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col h-full shadow-2xl relative z-20">
      <div className="p-6 border-b border-slate-800 bg-slate-900 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">Nexus ERP</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 shadow-sm border border-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`
            }
          >
            <svg
              className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 group-hover:text-indigo-400`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
            </svg>
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center mb-4">
           <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
           </div>
           <div className="ml-3 overflow-hidden">
             <p className="text-sm font-medium text-white truncate">{user?.name}</p>
             <p className="text-xs text-slate-400 truncate">{user?.role}</p>
           </div>
        </div>
      </div>
    </aside>
  );
}
