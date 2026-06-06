import { useState, useEffect } from 'react';
import { poInvoiceService } from '../services/poInvoiceService';

export default function POs() {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    setLoading(true);
    const data = await poInvoiceService.getPOs();
    setPos(data);
    setLoading(false);
  };

  const handleGenerate = async () => {
    const newPO = await poInvoiceService.generatePO({ vendor: 'New Vendor', amount: '$0.00' });
    setPos([...pos, newPO]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Purchase Orders</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and generate official POs from approved quotations.</p>
        </div>
        <button onClick={handleGenerate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/30 transition-transform transform hover:-translate-y-0.5">
          Generate New PO
        </button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">PO Number</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading POs...</td>
                </tr>
              ) : pos.map((po) => (
                <tr key={po.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-400">{po.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{po.vendor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">{po.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{po.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      po.status === 'Fulfilled' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-3">
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">Download PDF</button>
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
