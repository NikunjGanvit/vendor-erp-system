import { useState, useEffect } from 'react';
import { approvalService } from '../services/approvalService';

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    setLoading(true);
    const data = await approvalService.getApprovals();
    setApprovals(data);
    setLoading(false);
  };

  const handleAction = async (id, status) => {
    await approvalService.updateApproval(id, status, '');
    fetchApprovals(); // Refresh list after action
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Approval Workflow</h1>
          <p className="text-slate-400 text-sm mt-1">Review and approve procurement requests.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Approval ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Requestor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading workflows...</td>
                </tr>
              ) : approvals.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-amber-400">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{app.type} ({app.targetId})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{app.requestor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      app.status === 'Approved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : app.status === 'Rejected'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-3">
                    {app.status === 'Pending Review' && (
                      <>
                        <button onClick={() => handleAction(app.id, 'Approved')} className="text-emerald-400 hover:text-emerald-300 font-medium">Approve</button>
                        <button onClick={() => handleAction(app.id, 'Rejected')} className="text-red-400 hover:text-red-300 font-medium">Reject</button>
                      </>
                    )}
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
