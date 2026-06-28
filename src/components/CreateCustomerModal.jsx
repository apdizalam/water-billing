import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function CreateCustomerModal({ isOpen, onClose, initial = null, onSaved = () => {} }) {
  const initialForm = initial || {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    group: '',
    username: '',
    password: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setFormData(initial || initialForm);
  }, [initial, isOpen]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.username || (!initial && !formData.password)) {
      setMessage({ type: 'error', text: 'Fadlan buuxi dhammaan meelaha loo baahan yahay.' });
      return;
    }
    if (!formData.group) {
      setMessage({ type: 'error', text: 'Fadlan dooro group-ka macaamilka ka hor intaanad kaydin.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const payload = { ...formData };
      if (initial && initial._id) {
        if (!payload.password) delete payload.password;
        await axios.put(`${API_BASE}/customers/${initial._id}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${API_BASE}/customers`, payload, { withCredentials: true });
      }

      // Explicitly clear out all fields so the form is blank for the next registration
      setFormData(prev => ({
        ...prev,
        fullName: '',
        phone: '',
        email: '',
        address: '',
        group: '',
        username: '',
        password: ''
      }));

      setMessage({ type: 'success', text: 'La badbaadiyey' });
      // ensure state updates flush and inputs clear visually before closing
      await new Promise(resolve => setTimeout(resolve, 50));
      onSaved();
      onClose && onClose();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? 'Edit Customer' : 'Add New Customer'}>
      {message && <div className={`p-4 rounded-xl mb-6 font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-[#e6f6ee] text-[#00A859]'}`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <input type="text" name="chrome-bug-bypass" style={{ display: 'none' }} />
        <input type="password" name="chrome-password-bypass" style={{ display: 'none' }} />
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
          <input type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859]" placeholder="Magaca buuxa" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
          <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859]" placeholder="+252 XXXXXXX" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859]" placeholder="email@example.com" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
          <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859] h-24" placeholder="Cinwaanka" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Group</label>
            <select
              value={formData.group}
              onChange={e => setFormData({ ...formData, group: e.target.value })}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859] ${formData.group ? 'text-slate-700' : 'text-slate-400'}`}>
              <option value="">Dooro Nooca Macaamilka...</option>
              <option value="Households">Guuri</option>
              <option value="Commercial">Ganacsi</option>
              <option value="Shops">Dawladd</option>
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <input type="text" value={formData.username} autoComplete="new-username" onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password {initial ? '(leave blank to keep)' : ''}</label>
            <input type="password" value={formData.password} autoComplete="new-password" onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A859]" />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" onClick={onClose} className="bg-gray-200">Cancel</Button>
          <Button type="submit" disabled={loading} className="bg-[#00A859] text-white">{loading ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  );
}
