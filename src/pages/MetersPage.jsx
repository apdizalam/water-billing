import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Pencil, Trash2 } from 'lucide-react';

export default function MetersPage() {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initialFormState = { supplyNo: '', customerId: '', prevReading: '', currReading: '' };
  
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [adding, setAdding] = useState(false);
  const [addStatus, setAddStatus] = useState({ type: '', message: '' });
  const [deleteStatus, setDeleteStatus] = useState({ type: '', message: '' });

  const fetchMeters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/meters`, { withCredentials: true });
      setMeters(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load meter readings:', err.message);
      setError('Failed to load meter readings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeters();
    axios
      .get(`${API_BASE}/customers`, { withCredentials: true })
      .then((res) => setCustomers(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplyNo || !formData.customerId || formData.prevReading === '' || formData.currReading === '') {
      setAddStatus({ type: 'error', message: 'Supply No, customer and readings are required.' });
      return;
    }
    
    setAdding(true);
    setAddStatus({ type: '', message: '' });
    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/meters/${editingId}`, formData, { withCredentials: true });
        setAddStatus({ type: 'success', message: 'Meter reading updated successfully!' });
      } else {
        await axios.post(`${API_BASE}/meters`, formData, { withCredentials: true });
        setAddStatus({ type: 'success', message: 'Meter reading logged successfully!' });
      }
      
      fetchMeters();
      try { window.dispatchEvent(new CustomEvent('meterLog:updated')); } catch(e) {}
      setFormData(initialFormState);
      
      setTimeout(() => {
        setIsModalOpen(false);
        setAddStatus({ type: '', message: '' });
        setIsEditing(false);
        setEditingId(null);
      }, 1000);
    } catch (err) {
      setAddStatus({ type: 'error', message: err.response?.data?.message || 'Failed to save meter.' });
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (meter) => {
    setFormData({
      supplyNo: meter.supplyNo || meter.meterNumber,
      customerId: meter.customerId?._id || meter.customerId,
      prevReading: meter.prevReading,
      currReading: meter.currReading
    });
    setEditingId(meter._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleteStatus({ type: '', message: '' });
    try {
      await axios.delete(`${API_BASE}/meters/${id}`, { withCredentials: true });
      setMeters(prev => prev.filter(m => m._id !== id));
      setDeleteStatus({ type: 'success', message: 'Meter deleted successfully.' });
      setTimeout(() => setDeleteStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setDeleteStatus({ type: 'error', message: err.response?.data?.message || 'Failed to delete meter.' });
      setTimeout(() => setDeleteStatus({ type: '', message: '' }), 4000);
    }
  };

  const columns = ['SUPPLY NO.', 'OWNER', 'PREV', 'CURR', 'UNITS', 'DATE', 'ACTIONS'];

  const renderRow = (m) => (
    <tr key={m._id} className="hover:bg-slate-50 border-b border-slate-100 transition-colors text-slate-800 text-sm">
      <td className="whitespace-nowrap px-6 py-4 font-semibold">{m.supplyNo || m.meterNumber || '—'}</td>
      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900" style={{ minWidth: 280 }}>{m.customerName || m.customerId?.fullName || 'Unknown'}</td>
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">{m.prevReading ?? '—'}</td>
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">{m.currReading ?? '—'}</td>
      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">{m.unitsUsed ?? 0}</td>
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
        {m.readingDate ? new Date(m.readingDate).toLocaleString() : (m.createdAt ? new Date(m.createdAt).toLocaleString() : '—')}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex gap-3 items-center">
          <button onClick={(e) => { e.stopPropagation(); handleEdit(m); }} className="text-[#00A859] hover:bg-[#e6f6ee] p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
            <Pencil size={18} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(m._id); }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Meters</h1>
        <Button className="bg-[#00A859] text-white" onClick={() => {
          setFormData(initialFormState);
          setIsEditing(false);
          setEditingId(null);
          setIsModalOpen(true);
        }}>+ New Reading</Button>
      </div>

      {deleteStatus.message && (
        <div className={`max-w-7xl mx-auto mb-4 p-3 rounded-md ${deleteStatus.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {deleteStatus.message}
        </div>
      )}

      <Card className="p-2 sm:p-6 flex-1 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-medium">Loading meters...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 font-medium">{error}</div>
        ) : (
          <div className="w-full overflow-x-auto block border border-gray-100 rounded-xl bg-white">
            <table className="min-w-[1500px] w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {columns.map((col, index) => {
                    const isName = col.toLowerCase().includes('owner');
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
                {meters.length > 0 ? (
                  meters.map(renderRow)
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center p-8 text-slate-400">
                      No meters found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Meter Reading" : "New Meter Reading Log"}>
        {addStatus.message && (
          <div className={`p-4 rounded-xl mb-6 font-medium ${addStatus.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-[#e6f6ee] text-[#00A859]'}`}>
            {addStatus.message}
          </div>
        )}
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Supply No</label>
            <input 
              type="text" 
              value={formData.supplyNo}
              onChange={e => setFormData({ ...formData, supplyNo: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859]" 
              placeholder="e.g. SUP-4912"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Assign to Customer</label>
            <select 
              value={formData.customerId}
              onChange={e => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859]"
            >
              <option value="">Select a customer...</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.fullName} ({c.phone || c.phoneNumber || '—'})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Previous Reading</label>
              <input 
                type="number" 
                value={formData.prevReading}
                onChange={e => setFormData({ ...formData, prevReading: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859]" 
                placeholder="e.g. 1200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current Reading</label>
              <input 
                type="number" 
                value={formData.currReading}
                onChange={e => setFormData({ ...formData, currReading: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859]" 
                placeholder="e.g. 1250"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Units</label>
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700">{(formData.currReading - formData.prevReading) || 0}</div>
          </div>
          <Button type="submit" disabled={adding} className="w-full mt-4 bg-[#00A859] hover:bg-[#008f4c] text-white rounded-xl py-3 font-semibold transition-colors">
            {adding ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
