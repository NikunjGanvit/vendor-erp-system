import { useState, useEffect } from 'react';

export default function Analytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Vendor performance insights and procurement trends.</p>
        </div>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium border border-slate-700 transition-colors shadow-sm flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Spend (YTD)', value: '$1.2M', trend: '+14% YoY', positive: true },
          { title: 'Active Vendors', value: '45', trend: 'Stable', positive: true },
          { title: 'Avg. Approval Time', value: '1.2 Days', trend: '-15% YoY', positive: true },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <p className="text-sm font-medium text-slate-400">{stat.title}</p>
            <div className="flex items-baseline mt-2">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className={`ml-2 text-sm font-medium ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder Chart 1 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 h-80 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Monthly Spending Trends</h2>
          <div className="flex-1 flex items-end gap-2 pb-4 pt-8">
             {loading ? (
               <div className="w-full h-full flex items-center justify-center text-slate-500">Loading chart...</div>
             ) : (
               [40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                 <div key={i} className="w-full bg-indigo-500/20 hover:bg-indigo-500/40 transition-colors rounded-t-md relative group cursor-pointer" style={{ height: `${h}%` }}>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                     ${h}k
                   </div>
                 </div>
               ))
             )}
          </div>
          <div className="flex justify-between text-xs text-slate-500 border-t border-slate-800 pt-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </div>

        {/* Placeholder Chart 2 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 h-80 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Vendor Category Distribution</h2>
          <div className="flex-1 flex items-center justify-center">
             {loading ? (
               <div className="text-slate-500">Loading chart...</div>
             ) : (
               <div className="w-48 h-48 rounded-full border-[16px] border-slate-800 relative">
                 {/* Fake donut chart using borders */}
                 <div className="absolute inset-0 rounded-full border-[16px] border-emerald-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)' }}></div>
                 <div className="absolute inset-0 rounded-full border-[16px] border-blue-500" style={{ clipPath: 'polygon(50% 50%, 0 100%, 0 0, 50% 0)' }}></div>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                   <span className="text-2xl font-bold text-white">45</span>
                   <span className="text-xs text-slate-400">Total</span>
                 </div>
               </div>
             )}
          </div>
          <div className="flex justify-center gap-4 text-xs mt-4">
             <div className="flex items-center gap-1.5 text-slate-400"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Hardware</div>
             <div className="flex items-center gap-1.5 text-slate-400"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Services</div>
             <div className="flex items-center gap-1.5 text-slate-400"><div className="w-3 h-3 rounded-full bg-slate-800"></div> Other</div>
          </div>
        </div>
      </div>
    </div>
  );
}
