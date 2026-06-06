import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar (Empty skeleton) */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white tracking-tight">Nexus ERP</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-700/50 rounded-lg animate-pulse" />
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
          <div className="w-48 h-6 bg-slate-700/50 rounded animate-pulse md:hidden" />
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-white">Dashboard Overview</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse" />
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-32 flex flex-col justify-between">
                 <div className="w-24 h-4 bg-slate-700 rounded animate-pulse" />
                 <div className="w-16 h-8 bg-slate-600 rounded animate-pulse" />
              </div>
            ))}
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 h-96 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-300">No data available</h3>
              <p className="mt-1 text-sm text-slate-500">Your dashboard is currently empty.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
