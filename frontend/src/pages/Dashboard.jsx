import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-slate-400 text-sm mt-1">Here is what is happening with your procurement today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium border border-slate-700 transition-colors shadow-sm">
            Download Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/30 transition-transform transform hover:-translate-y-0.5">
            Create RFQ
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pending Approvals', value: '12', trend: '+2 this week', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Active RFQs', value: '34', trend: '8 closing soon', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { label: 'Purchase Orders', value: '128', trend: '+14% from last month', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Total Spend', value: '$45.2k', trend: 'Within budget', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors">
             <div className="flex items-center justify-between mb-4">
               <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                 </svg>
               </div>
               <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">Today</span>
             </div>
             <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
             <p className="text-sm font-medium text-slate-400">{stat.label}</p>
             <p className="text-xs text-slate-500 mt-2">{stat.trend}</p>
             
             {/* Decorative background glow on hover */}
             <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${stat.bg} rounded-full mix-blend-screen filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Recent Activity */}
         <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-semibold text-white">Recent Procurements</h2>
             <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View all</button>
           </div>
           
           <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Office Supplies - Q3</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Staples Inc. • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                      Approved
                    </span>
                    <p className="text-sm font-semibold text-white mt-1">$1,240.00</p>
                  </div>
                </div>
              ))}
           </div>
         </div>

         {/* Quick Actions */}
         <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
               {[
                 { name: 'Approve Quotations', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-amber-400' },
                 { name: 'Register New Vendor', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', color: 'text-emerald-400' },
                 { name: 'Generate PO', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-blue-400' }
               ].map((action, i) => (
                 <button key={i} className="w-full flex items-center p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-all group">
                   <div className={`p-2 rounded-lg bg-slate-900 mr-4 group-hover:scale-110 transition-transform ${action.color}`}>
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
                     </svg>
                   </div>
                   <span className="text-sm font-medium text-slate-200 group-hover:text-white">{action.name}</span>
                   <svg className="w-4 h-4 ml-auto text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                   </svg>
                 </button>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
