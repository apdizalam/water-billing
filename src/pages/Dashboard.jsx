import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../services/api';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  UserPlus,
  Gauge,
  Receipt,
  FileText,
} from 'lucide-react';

const API = API_BASE;

const getClientName = (bill) =>
  bill.customer?.fullName ||
  bill.customerName ||
  (bill.customerId && typeof bill.customerId === 'object' ? bill.customerId.fullName : null) ||
  'Water Client';

const getBillAmount = (bill) => Number(bill.amountDue ?? bill.amount ?? bill.totalAmount ?? 0);

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ customers: 0, billsPaid: 0, overdue: 0, revenue: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardPayload = async () => {
    try {
      const [custRes, billRes] = await Promise.all([
        axios.get(`${API}/customers`, { withCredentials: true }),
        axios.get(`${API}/billing`, { withCredentials: true }),
      ]);

      const customers = Array.isArray(custRes.data) ? custRes.data : [];
      const bills = Array.isArray(billRes.data) ? billRes.data : [];

      const totalCustomers = customers.length;
      const paidBills = bills.filter(
        (b) => b.status === 'Paid' || b.status === 'Completed'
      ).length;
      const overdueBills = bills.filter(
        (b) => b.status === 'Overdue' || b.status === 'Pending'
      ).length;
      const totalRevenue = bills
        .filter((b) => b.status === 'Paid' || b.status === 'Completed')
        .reduce((sum, b) => sum + getBillAmount(b), 0);

      setStats({
        customers: totalCustomers,
        billsPaid: paidBills,
        overdue: overdueBills,
        revenue: totalRevenue,
      });

      setTransactions(bills.slice(0, 5));
    } catch (err) {
      console.error('Database connection failed on dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardPayload();
    const refresh = () => fetchDashboardPayload();
    window.addEventListener('bills:updated', refresh);
    return () => window.removeEventListener('bills:updated', refresh);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-medium">
        Loading Shaba Dashboard...
      </div>
    );
  }

  return (
    <div className="bg-gray-50/60 min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Customers</span>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.customers}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Bills Paid</span>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.billsPaid}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Overdue</span>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.overdue}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Revenue</span>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                ${stats.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-md font-bold text-slate-800">Quick Actions ⚡</h2>

            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-sm"
            >
              Manage Customers
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate('/customers')}
                className="p-4 border border-gray-100 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
              >
                <UserPlus className="h-5 w-5 text-emerald-600" />
                <span className="text-xs font-bold text-gray-600">ADD CUSTOMER</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/meters')}
                className="p-4 border border-gray-100 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
              >
                <Gauge className="h-5 w-5 text-emerald-600" />
                <span className="text-xs font-bold text-gray-600">CREATE METER</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/billing')}
                className="p-4 border border-gray-100 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
              >
                <Receipt className="h-5 w-5 text-emerald-600" />
                <span className="text-xs font-bold text-gray-600">ALL BILLS</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/billing')}
                className="p-4 border border-gray-100 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
              >
                <Receipt className="h-5 w-5 text-emerald-600" />
                <span className="text-xs font-bold text-gray-600">NEW BILL</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="w-full p-3 border border-dashed border-gray-200 hover:border-emerald-500 rounded-xl flex items-center justify-center gap-2 transition-all text-xs font-bold text-gray-500 hover:text-emerald-600"
            >
              <FileText className="h-4 w-4" />
              OPEN REAL REPORTS PANEL
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex flex-col gap-4 pb-4 border-b border-gray-50 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-md font-bold text-slate-800">Recent Transactions</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="relative w-full sm:w-55">
                  <input
                    type="text"
                    placeholder="Search client name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                </div>

                <button
                  onClick={async () => {
                    try {
                      await fetchDashboardPayload();
                      setSearchQuery(""); // Clear search filter on refresh
                    } catch (err) {
                      console.error("Manual refresh data reload failed:", err);
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
                  title="Cusboonaysii Xogta"
                >
                  <span className="text-lg">🔄</span>
                </button>

                <Link
                  className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                  to="/billing"
                >
                  View All
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto grow mt-3">
              <table className="min-w-full w-full text-left">
                <thead>
                  <tr className="text-[11px] font-bold uppercase text-gray-400 border-b border-gray-100">
                    <th className="pb-2">Client / Reference</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {(() => {
                    const activeBillsList = transactions || [];
                    const filteredBillsRows = activeBillsList.filter(bill => {
                      const clientName = (bill.clientName || bill.customer?.fullName || bill.customer?.name || bill.username || "").toLowerCase();
                      const referenceNo = (bill.billNo || bill.billNumber || bill.supplyNo || "").toLowerCase();
                      const searchString = searchQuery.toLowerCase();

                      return clientName.includes(searchString) || referenceNo.includes(searchString);
                    });

                    if (filteredBillsRows.length === 0) {
                      return (
                        <tr>
                          <td colSpan={3} className="text-center py-8 text-gray-400 text-xs">
                            Xog ku saabsan "{searchQuery}" lama helin!
                          </td>
                        </tr>
                      );
                    }

                    return filteredBillsRows.map((tx) => (
                      <tr key={tx._id} className="hover:bg-gray-50/50">
                        <td className="py-3 font-semibold text-slate-700">
                          <div>{getClientName(tx)}</div>
                          <span className="text-[10px] text-gray-400 block font-normal">
                            {tx.billNo || tx.billNumber || tx.supplyNo || 'SHB-Invoice'}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-slate-900">
                          ${getBillAmount(tx).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              tx.status === 'Paid' || tx.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {tx.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;