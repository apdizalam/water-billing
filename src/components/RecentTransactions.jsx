import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/transactions`, { withCredentials: true });
      const list = Array.isArray(response.data) ? response.data : [];
      setTransactions(list.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard logs:', err.message);
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const handler = () => fetchTransactions();
    window.addEventListener('bills:updated', handler);
    return () => window.removeEventListener('bills:updated', handler);
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#00A859]">Recent Transactions</h2>
        <Link to="/billing" className="text-sm font-semibold text-[#00A859] hover:text-[#008f4c] hover:underline">
          View All
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 flex-1 overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-medium">Loading transactions...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 font-medium">{error}</div>
        ) : (
          <div className="min-w-[700px]">
            <div className="grid grid-cols-5 gap-4 px-4 py-3 mb-2 border-b border-slate-100 font-semibold text-xs text-slate-500 tracking-wider">
              <div>REFERENCE</div>
              <div>TYPE</div>
              <div>STATUS</div>
              <div>AMOUNT</div>
              <div>DATE</div>
            </div>

            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="grid grid-cols-5 gap-4 items-center px-4 py-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                >
                  <div className="font-semibold text-slate-800 text-sm whitespace-nowrap">{tx.reference || '—'}</div>
                  <div className="font-semibold text-slate-800 text-sm">{tx.type || '—'}</div>
                  <div className="text-sm text-slate-500 font-medium">{tx.status || '—'}</div>
                  <div className="font-semibold text-slate-800 text-sm">
                    ${Number(tx.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">{tx.date || '—'}</div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center p-4 text-slate-500">No recent transactions.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
