import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { Pencil, Trash2 } from 'lucide-react';
import BillingModal from '../components/Billing';

export default function AllBillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = { supplyNo: '', idNo: '', customerId: '', prevReading: '', currReading: '', prevDate: '', currDate: '', units: 0, period: '', billDate: '', amount: '', dueDate: '', status: 'Pending' };
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [deleteStatus, setDeleteStatus] = useState({ type: '', message: '' });

  const fetchBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/billing`, { withCredentials: true });
      const list = Array.isArray(response.data) ? response.data : [];
      const normalized = list.map((b) => ({
        ...b,
        supplyNo: b.supplyNo || b.supply || '',
        amountDue: b.amountDue !== undefined ? b.amountDue : b.amount !== undefined ? b.amount : 0,
        unitsUsed: b.unitsUsed !== undefined ? b.unitsUsed : b.units !== undefined ? b.units : 0,
        customerName:
          b.customerName ||
          (b.customerId && b.customerId.fullName) ||
          (b.customer && b.customer.fullName) ||
          '',
      }));
      setBills(normalized);
    } catch (err) {
      console.error('Failed to load bills:', err.message);
      setError('Failed to load bills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setEditingId(bill._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleteStatus({ type: '', message: '' });
    try {
      await axios.delete(`${API_BASE}/billing/${id}`, { withCredentials: true });
      setBills(prev => prev.filter(b => b._id !== id));
      setDeleteStatus({ type: 'success', message: 'Bill deleted successfully.' });
      setTimeout(() => setDeleteStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setDeleteStatus({ type: 'error', message: err.response?.data?.message || 'Failed to delete bill.' });
      setTimeout(() => setDeleteStatus({ type: '', message: '' }), 4000);
    }
  };

  /* ── EXACT column order matching the user's specification ── */
  const columns = [
    'SUPPLY NO',
    'CUSTOMER',
    'PREV READ',
    'CURR READ',
    'PREVIOUS DATE',
    'CURRENT DATE',
    'UNITS',
    'AMOUNT',
    'PERIOD',
    'BILL DATE',
    'DUE DATE',
    'STATUS',
    'ACTIONS'
  ];

  /* ── Row renderer — cells in IDENTICAL order to the columns array above ── */
  const renderRow = (bill) => (
    <tr key={bill._id} className="hover:bg-slate-50 border-b border-slate-100 transition-colors text-slate-800 text-sm">
      {/* 1. SUPPLY NO */}
      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">{bill.supplyNo || '—'}</td>
      {/* 2. CUSTOMER */}
      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900" style={{ minWidth: 280 }}>
        {bill.customerId?.fullName || bill.customerName || 'Unknown'}
      </td>
      {/* 3. PREV READ */}
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">{bill.prevReading ?? '—'}</td>
      {/* 4. CURR READ */}
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">{bill.currReading ?? '—'}</td>
      {/* 5. PREVIOUS DATE */}
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
        {bill.previousDate ? new Date(bill.previousDate).toLocaleDateString() : (bill.prevDate ? new Date(bill.prevDate).toLocaleDateString() : '—')}
      </td>
      {/* 6. CURRENT DATE */}
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
        {bill.currentDate ? new Date(bill.currentDate).toLocaleDateString() : (bill.currDate ? new Date(bill.currDate).toLocaleDateString() : '—')}
      </td>
      {/* 7. UNITS */}
      <td className="whitespace-nowrap px-6 py-4 text-slate-500 font-medium">{bill.unitsUsed ?? bill.units ?? 0}</td>
      {/* 8. AMOUNT */}
      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">${(bill.amountDue ?? bill.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
      {/* 9. PERIOD */}
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">{bill.period || '—'}</td>
      {/* 10. BILL DATE */}
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
        {bill.billDate ? new Date(bill.billDate).toLocaleDateString() : (bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : '—')}
      </td>
      {/* 11. DUE DATE */}
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
        {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '—'}
      </td>
      {/* 12. STATUS */}
      <td className="whitespace-nowrap px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          String(bill.status).toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' :
          String(bill.status).toLowerCase() === 'overdue' ? 'bg-red-100 text-red-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {bill.status || 'Pending'}
        </span>
      </td>
      {/* 13. ACTIONS */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex gap-3 items-center">
          <button onClick={(e) => { e.stopPropagation(); handleEdit(bill); }} className="text-[#00A859] hover:bg-[#e6f6ee] p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
            <Pencil size={18} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(bill._id); }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">All Bills</h1>
        <Button className="bg-[#00A859] text-white" onClick={() => {
          setFormData(initialFormState);
          setIsEditing(false);
          setEditingId(null);
          setIsModalOpen(true);
        }}>Generate Bill</Button>
      </div>

      {deleteStatus.message && (
        <div className={`max-w-7xl mx-auto mb-4 p-3 rounded-md ${deleteStatus.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {deleteStatus.message}
        </div>
      )}

      <Card className="p-2 sm:p-6 flex-1 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-medium">Loading bills...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 font-medium">{error}</div>
        ) : (
          <div className="w-full overflow-x-auto block border border-gray-100 rounded-xl bg-white">
            <table className="min-w-[1600px] w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {columns.map((col, index) => {
                    const isName = col === 'CUSTOMER';
                    return (
                      <th 
                        key={index} 
                        style={{ minWidth: isName ? 280 : undefined }}
                        className="whitespace-nowrap px-6 py-4 font-bold text-xs text-slate-500 tracking-wider uppercase text-left"
                      >
                        {col}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bills.length > 0 ? (
                  bills.map(renderRow)
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center p-8 text-slate-400">
                      No bills found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      <BillingModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingBill(null); setIsEditing(false); setEditingId(null); }} initial={isEditing ? editingBill : null} onSaved={() => { fetchBills(); setEditingBill(null); setIsEditing(false); setEditingId(null); }} />
    </div>
  );
}
