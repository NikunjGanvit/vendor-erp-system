import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function PageWrapper({ children }) {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-200">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full overflow-hidden relative">
        {/* Decorative Background Orbs for the app interior */}
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
