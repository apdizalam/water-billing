import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import CreateCustomerModal from '../components/CreateCustomerModal';
import { Pencil, Trash2 } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initialFormState = { fullName: '', phone: '', email: '', address: '', group: 'Households', username: '', password: '' };
  const [formData, setFormData] = useState(initialFormState);
  const [adding, setAdding] = useState(false);
  const [addStatus, setAddStatus] = useState({ type: '', message: '' });
  const [deleteStatus, setDeleteStatus] = useState({ type: '', message: '' });

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/customers`, { withCredentials: true });
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load customers:', err.message);
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.username || (!isEditing && !formData.password)) {
      setAddStatus({ type: 'error', message: 'Please fill required fields: name, phone, address, username, password (for new).' });
      return;
    }
    
    setAdding(true);
    setAddStatus({ type: '', message: '' });
    try {
      if (isEditing) {
        // Do not send empty password when editing
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await axios.put(`${API_BASE}/customers/${editingId}`, payload, { withCredentials: true });
        setAddStatus({ type: 'success', message: 'Customer updated successfully!' });
      } else {
        const payload = { ...formData };
        await axios.post(`${API_BASE}/customers`, payload, { withCredentials: true });
        setAddStatus({ type: 'success', message: 'Customer added successfully!' });
      }
      
      // reset form immediately so inputs clear for next entry
      setFormData(initialFormState);
      fetchCustomers();
      
      setTimeout(() => {
        setIsModalOpen(false);
        setAddStatus({ type: '', message: '' });
        setIsEditing(false);
        setEditingId(null);
      }, 1000);
    } catch (err) {
      setAddStatus({ type: 'error', message: err.response?.data?.message || 'Failed to preserve customer.' });
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      fullName: customer.fullName,
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      group: customer.group || 'Households',
      username: customer.username || '',
      password: ''
    });
    setEditingId(customer._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleteStatus({ type: '', message: '' });
    try {
      await axios.delete(`${API_BASE}/customers/${id}`, { withCredentials: true });
      setCustomers(prev => prev.filter(c => c._id !== id));
      setDeleteStatus({ type: 'success', message: 'Customer deleted successfully.' });
      setTimeout(() => setDeleteStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setDeleteStatus({ type: 'error', message: err.response?.data?.message || 'Failed to delete customer.' });
      setTimeout(() => setDeleteStatus({ type: '', message: '' }), 4000);
    }
  };

  const columns = ['Full Name', 'Phone', 'Email', 'Address', 'Group', 'Joined Date', 'Username', 'Password', 'Actions'];

  const renderRow = (c) => (
    <tr key={c._id} className="hover:bg-slate-50 border-b border-slate-100 transition-colors text-slate-800 text-sm">
      {/* Full Name — wide for 3-part names */}
      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900" style={{ minWidth: 280 }}>{c.fullName}</td>
      {/* Phone */}
      <td className="whitespace-nowrap px-6 py-4 text-gray-700">{c.phone || c.mobile || '—'}</td>
      {/* Email */}
      <td className="whitespace-nowrap px-6 py-4 text-gray-700">{c.email || '—'}</td>
      {/* Address */}
      <td className="whitespace-nowrap px-6 py-4 text-gray-700">{c.address || '—'}</td>
      {/* Group */}
      <td className="whitespace-nowrap px-6 py-4 text-gray-700">{c.group || '—'}</td>
      {/* Joined Date */}
      <td className="whitespace-nowrap px-6 py-4 text-gray-700">
        {c.registrationDate ? new Date(c.registrationDate).toLocaleDateString() : (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—')}
      </td>
      {/* Username — explicit min-w */}
      <td className="whitespace-nowrap px-6 py-4 text-gray-700" style={{ minWidth: 140 }}>{c.username || '—'}</td>
      {/* Password — explicit min-w */}
      <td className="whitespace-nowrap px-6 py-4 text-gray-700" style={{ minWidth: 140 }}>{c.visiblePassword || '—'}</td>
      {/* Actions */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex gap-3 items-center">
          <button onClick={(e) => { e.stopPropagation(); handleEdit(c); }} className="text-[#00A859] hover:bg-[#e6f6ee] p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
            <Pencil size={18} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Customers</h1>
        <Button className="bg-[#00A859] text-white" onClick={() => {
          setFormData(initialFormState);
          setIsEditing(false);
          setEditingId(null);
          setIsModalOpen(true);
        }}>+ Add Customer</Button>
      </div>

      {deleteStatus.message && (
        <div className={`max-w-7xl mx-auto mb-4 p-3 rounded-md ${deleteStatus.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {deleteStatus.message}
        </div>
      )}

      <Card className="p-2 sm:p-6 flex-1 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-medium">Loading customers...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 font-medium">{error}</div>
        ) : (
          <div className="w-full overflow-x-auto block border border-gray-100 rounded-xl bg-white">
            <table className="min-w-[1500px] w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {columns.map((col, index) => {
                    const isName = col === 'Full Name';
                    const isCredential = col === 'Username' || col === 'Password';
                    return (
                      <th 
                        key={index} 
                        style={{ minWidth: isName ? 280 : isCredential ? 140 : undefined }}
                        className="whitespace-nowrap px-6 py-4 font-bold text-xs text-slate-500 tracking-wider uppercase text-left"
                      >
                        {col}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.length > 0 ? (
                  customers.map(renderRow)
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center p-8 text-slate-400">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      <CreateCustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initial={isEditing ? formData : null} onSaved={() => { fetchCustomers(); setIsModalOpen(false); setIsEditing(false); setEditingId(null); }} />
    </div>
  );
}
