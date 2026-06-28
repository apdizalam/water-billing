import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Pencil, Trash2 } from 'lucide-react';

export default function RegisterManagerPage() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = { 
    fullName: '', 
    email: '', 
    phoneNumber: '', 
    username: '', 
    password: '' 
  };
  const [managerFormData, setManagerFormData] = useState(initialFormState);
  const [adding, setAdding] = useState(false);
  const [addStatus, setAddStatus] = useState({ type: '', message: '' });
  const [phoneError, setPhoneError] = useState('');
  const [deleteStatus, setDeleteStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    // ensure form starts empty to prevent browser autofill injection
    setManagerFormData(initialFormState);
  }, []);

  const fetchManagers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/managers`, { withCredentials: true });
      setManagers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load managers:', err.message);
      setError('Failed to load managers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!managerFormData.fullName || !managerFormData.email || !managerFormData.phoneNumber || !managerFormData.username) {
      setAddStatus({ type: 'error', message: 'All fields are required (password optional for update).' });
      return;
    }
    
    // Flexible Somali phone pattern: allow optional +252 or leading 0, prefixes like 61/62/63/65/67/68/69, then 7 digits
    const phoneRegex = /^(\+252|0)?(61|62|63|65|67|68|69)\d{7}$/;
    if (!managerFormData.phoneNumber.match(phoneRegex)) {
      setPhoneError('Fadlan geli lambar sax ah oo ku bilaabma +252');
      setAddStatus({ type: 'error', message: 'Fadlan geli lambar sax ah oo ku bilaabma +252' });
      return;
    }
    // clear any phone error when valid
    setPhoneError('');
    setAddStatus({ type: '', message: '' });

    // Normalize phone: if user entered without +252 (e.g., starts with 61 or 63) prepend +252; if starts with 0, replace with +252
    let normalizedPhone = managerFormData.phoneNumber.trim();
    if (/^0/.test(normalizedPhone)) {
      normalizedPhone = normalizedPhone.replace(/^0/, '+252');
    } else if (!/^\+252/.test(normalizedPhone) && /^(61|62|63|65|67|68|69)/.test(normalizedPhone)) {
      normalizedPhone = '+252' + normalizedPhone;
    }
    // use normalizedPhone in the payload
    const submitData = { ...managerFormData, phoneNumber: normalizedPhone };
    
    if (!isEditing && !managerFormData.password) {
      setAddStatus({ type: 'error', message: 'Password is required for new managers.' });
      return;
    }
    
    setAdding(true);
    setAddStatus({ type: '', message: '' });
    try {
      const payload = {
        fullName: submitData.fullName,
        email: submitData.email,
        phone: submitData.phoneNumber,
        username: submitData.username,
        password: submitData.password,
      };

      if (isEditing) {
        await axios.put(`${API_BASE}/managers/${editingId}`, payload, { withCredentials: true });
        setAddStatus({ type: 'success', message: 'Manager updated successfully!' });
      } else {
        await axios.post(`${API_BASE}/managers`, payload, { withCredentials: true });
        setAddStatus({ type: 'success', message: 'Manager registered successfully!' });
      }
      
      fetchManagers();
      // Instantly clear the form so the user sees it vanish
      setManagerFormData(initialFormState);
      
      // Delay closing so the success message is visible
      setTimeout(() => {
        setIsModalOpen(false);
        setAddStatus({ type: '', message: '' });
        setIsEditing(false);
        setEditingId(null);
      }, 1000);
    } catch (err) {
      setAddStatus({ type: 'error', message: err.response?.data?.message || 'Failed to save manager.' });
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (manager) => {
    setManagerFormData({
      fullName: manager.fullName,
      email: manager.email,
      phoneNumber: manager.phone || manager.phoneNumber || '',
      username: manager.username,
      password: '' // empty password for updates unless they want to change it
    });
    setEditingId(manager._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleteStatus({ type: '', message: '' });
    try {
      await axios.delete(`${API_BASE}/managers/${id}`, { withCredentials: true });
      setManagers(prev => prev.filter(m => m._id !== id));
      setDeleteStatus({ type: 'success', message: 'Manager deleted successfully.' });
      // clear message after a short delay
      setTimeout(() => setDeleteStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setDeleteStatus({ type: 'error', message: err.response?.data?.message || 'Failed to delete manager.' });
      setTimeout(() => setDeleteStatus({ type: '', message: '' }), 4000);
    }
  };

  const columns = ['FULL NAME', 'EMAIL', 'PHONE NUMBER', 'USERNAME', 'PASSWORD', 'ACTIONS'];

  const renderRow = (m) => (
    <tr key={m._id} className="hover:bg-slate-50 border-b border-slate-100 transition-colors text-slate-800 text-sm">
      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900" style={{ minWidth: 280 }}>{m.fullName || m.name || 'N/A'}</td>
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">{m.email || 'N/A'}</td>
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">{m.phone || m.phoneNumber || 'N/A'}</td>
      <td className="whitespace-nowrap px-6 py-4 font-semibold" style={{ minWidth: 150 }}>{m.username ? String(m.username).replace(/@/g, '') : 'N/A'}</td>
      <td style={{ padding: '12px', fontSize: '14px', fontFamily: 'monospace' }}>
        {m.password || '••••'}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex gap-3 items-center">
          <button onClick={() => handleEdit(m)} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
            <Pencil size={18} />
          </button>
          <button onClick={() => handleDelete(m._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Managers</h1>
        <Button onClick={() => {
          setManagerFormData(initialFormState);
          setIsEditing(false);
          setEditingId(null);
          setIsModalOpen(true);
        }}>+ Add Manager</Button>
      </div>

      {deleteStatus.message && (
        <div className={`max-w-7xl mx-auto mb-4 p-3 rounded-md ${deleteStatus.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {deleteStatus.message}
        </div>
      )}

      <Card className="p-2 sm:p-6 flex-1 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-medium">Loading managers...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 font-medium">{error}</div>
        ) : (
          <div className="w-full overflow-x-auto block border border-gray-100 rounded-xl bg-white">
            <table className="min-w-[1500px] w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {columns.map((col, index) => {
                    const isFullName = col.toLowerCase() === 'full name';
                    const isUserOrPass = col.toLowerCase().includes('username') || col.toLowerCase().includes('password');
                    return (
                      <th 
                        key={index} 
                        style={{ 
                          minWidth: isFullName ? 280 : isUserOrPass ? 150 : undefined 
                        }}
                        className="whitespace-nowrap px-6 py-4 font-bold text-xs text-slate-500 tracking-wider uppercase text-left"
                      >
                        {col}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {managers.length > 0 ? (
                  managers.map(renderRow)
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center p-8 text-slate-400">
                      No managers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Register/Update Manager Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Manager" : "Register Manager"}>
        {addStatus.message && (
          <div className={`p-4 rounded-xl mb-6 font-medium ${addStatus.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {addStatus.message}
          </div>
        )}
        <form onSubmit={handleAddSubmit} className="space-y-4" autoComplete="off">
          {/* Hidden inputs to bypass Chrome autofill heuristics */}
          <input type="text" name="chrome-bug-bypass" style={{ display: 'none' }} />
          <input type="password" name="chrome-password-bypass" style={{ display: 'none' }} />
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
            <input 
              type="text" 
              value={managerFormData.fullName}
              onChange={e => setManagerFormData({ ...managerFormData, fullName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" 
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input 
              type="email" 
              value={managerFormData.email}
              onChange={e => setManagerFormData({ ...managerFormData, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" 
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
            <input 
              type="text" 
              value={managerFormData.phoneNumber}
              onChange={e => setManagerFormData({ ...managerFormData, phoneNumber: e.target.value })}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 ${phoneError ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`} 
              placeholder="+252 XXXXXXX"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
              <input 
                type="text" 
                value={managerFormData.username}
                onChange={e => setManagerFormData({ ...managerFormData, username: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Username"
                autoComplete="new-username"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                value={managerFormData.password}
                onChange={e => setManagerFormData({ ...managerFormData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder={isEditing ? "Leave blank to keep same" : "••••••••"}
                autoComplete="new-password"
              />
            </div>
          </div>
          <Button type="submit" disabled={adding} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50">
            {adding ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
