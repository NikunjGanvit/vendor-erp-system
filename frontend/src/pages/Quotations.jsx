import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { quotationService } from '../services/quotationService';

export default function Quotations() {
  const { user } = useAuth();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newQuote, setNewQuote] = useState({ rfqId: '', amount: '', deliveryTime: '' });

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    setLoading(true);
    const data = await quotationService.getQuotations();
    setQuotations(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await quotationService.submitQuotation({
      ...newQuote, vendor: user.name, rating: 0
    });
    setQuotations([...quotations, created]);
    setShowSubmitModal(false);
    setNewQuote({ rfqId: '', amount: '', deliveryTime: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Quotations</h1>
          <p className="text-slate-400 text-sm mt-1">
            {user?.role === 'Vendor' ? 'Submit and track your bids.' : 'Compare and evaluate vendor quotations.'}
          </p>
        </div>
        {user?.role === 'Vendor' && (
          <button 
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-pink-500/30 transition-transform transform hover:-translate-y-0.5"
          >
            Submit Quotation
          </button>
        )}
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quote ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">RFQ ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Delivery Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading quotations...</td>
                </tr>
              ) : quotations.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-pink-400">{quote.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-400">{quote.rfqId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{quote.vendor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">{quote.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{quote.deliveryTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {user?.role !== 'Vendor' && quote.status === 'Pending' ? (
                      <button className="text-emerald-400 hover:text-emerald-300 font-medium">Accept</button>
                    ) : (
                      <span className="text-slate-500">{quote.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Submit Quotation</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">RFQ ID</label>
                <input required type="text" value={newQuote.rfqId} onChange={e => setNewQuote({...newQuote, rfqId: e.target.value})} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-pink-500" placeholder="e.g. RFQ-2023-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Quoted Amount</label>
                <input required type="text" value={newQuote.amount} onChange={e => setNewQuote({...newQuote, amount: e.target.value})} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-pink-500" placeholder="e.g. $4,200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Delivery Time</label>
                <input required type="text" value={newQuote.deliveryTime} onChange={e => setNewQuote({...newQuote, deliveryTime: e.target.value})} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-pink-500" placeholder="e.g. 14 Days" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowSubmitModal(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium">Submit Quote</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
