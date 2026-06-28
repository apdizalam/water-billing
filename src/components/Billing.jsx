import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';
import Button from './Button';
import Modal from './Modal';

export default function Billing({ isOpen, onClose, initial = null, onSaved = () => {} }) {
  const [customers, setCustomers] = useState([]);
  const initialForm = {
    supplyNo: '',
    idNo: '',
    customerId: '',
    prevReading: '',
    currReading: '',
    prevDate: '',
    currDate: '',
    units: 0,
    billDate: '',
    period: '',
    amount: '',
    dueDate: '',
    status: 'Pending'
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/customers`, { withCredentials: true })
      .then((res) => setCustomers(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const prev = parseFloat(form.prevReading);
    const curr = parseFloat(form.currReading);
    if (!isNaN(prev) && !isNaN(curr)) {
      const units = Math.max(0, curr - prev);
      setForm(f => ({ ...f, units: units, amount: (units * 1.5).toFixed(2) }));
    } else {
      setForm(f => ({ ...f, units: 0 }));
    }
  }, [form.prevReading, form.currReading]);

  useEffect(() => {
    if (initial) {
      setForm({
        supplyNo: initial.supplyNo || initial.supply || '',
        idNo: initial.idNo || '',
        customerId: initial.customerId?._id || initial.customerId || '',
        prevReading: initial.prevReading ?? '',
        currReading: initial.currReading ?? '',
        prevDate: initial.prevDate || '',
        currDate: initial.currDate || '',
        units: initial.unitsUsed ?? initial.units ?? 0,
        billDate: initial.billDate || '',
        period: initial.period || '',
        amount: initial.amountDue ?? initial.amount ?? '',
        dueDate: initial.dueDate || '',
        status: initial.status || 'Pending'
      });
    } else if (isOpen) {
      setForm({
        supplyNo: '',
        idNo: 'Loading...',
        customerId: '',
        prevReading: '',
        currReading: '',
        prevDate: '',
        currDate: '',
        units: 0,
        billDate: new Date().toISOString().split('T')[0],
        period: '',
        amount: '',
        dueDate: '',
        status: 'Pending'
      });
      axios.get(`${API_BASE}/bills/next-id`, { withCredentials: true })
        .then(res => {
          if (res.data && res.data.nextId) {
            setForm(f => ({ ...f, idNo: res.data.nextId }));
          }
        })
        .catch(err => {
          console.error("Failed to fetch next sequential ID:", err);
          // Fallback to timestamp just in case
          setForm(f => ({ ...f, idNo: Math.floor(1000 + Math.random() * 9000).toString() }));
        });
    }
  }, [initial, isOpen]);

  // auto-fill latest meter reading when supplyNo or customer changes
  useEffect(() => {
    const supply = form.supplyNo;
    const cust = form.customerId;
    if (!supply && !cust) return;
    let q = {};
    if (supply) q.supplyNo = supply;
    else if (cust) q.customerId = cust;
    axios
      .get(
        `${API_BASE}/meters/latest${
          q.supplyNo
            ? `?supplyNo=${encodeURIComponent(q.supplyNo)}`
            : q.customerId
              ? `?customerId=${encodeURIComponent(q.customerId)}`
              : ''
        }`,
        { withCredentials: true }
      )
      .then((res) => res.data)
      .then((latest) => {
        if (latest) {
          setForm(f => ({
            ...f,
            prevReading: latest.prevReading ?? f.prevReading,
            currReading: latest.currReading ?? f.currReading,
            units: latest.unitsUsed ?? f.units,
            amount: latest.unitsUsed ? (latest.unitsUsed * 1.5).toFixed(2) : f.amount
          }));
        }
      }).catch(() => { /* ignore if none */ });
  }, [form.supplyNo, form.customerId]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!form.customerId || form.customerId === "") {
      console.error("Macaamil sax ah lama dooran sxb!");
      return setMessage({ type: 'error', text: 'Macaamil sax ah lama dooran sxb!' });
    }
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        supplyNo: form.supplyNo || undefined,
        idNo: form.idNo === '' ? undefined : Number(form.idNo),
        customerId: form.customerId,
        prevReading: form.prevReading === '' ? undefined : Number(form.prevReading),
        currReading: form.currReading === '' ? undefined : Number(form.currReading),
        prevDate: form.prevDate || undefined,
        currDate: form.currDate || undefined,
        previousDate: form.prevDate || undefined,
        currentDate: form.currDate || undefined,
        billDate: form.billDate || undefined,
        period: form.period || undefined,
        amountDue: form.amount === '' ? undefined : Number(form.amount),
        dueDate: form.dueDate || undefined,
        status: form.status || 'Pending'
      };

      if (initial && initial._id) {
        await axios.put(`${API_BASE}/billing/${initial._id}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${API_BASE}/billing`, payload, { withCredentials: true });
      }

      setMessage({ type: 'success', text: 'Saved' });
      // notify parent and other components to refresh bills list
      try { window.dispatchEvent(new CustomEvent('bills:updated')); } catch (e) { /* ignore */ }
      onSaved();
      onClose && onClose();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? 'Edit Bill' : 'Generate Bill'}>
      {message && <div className={`p-3 rounded ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Supply No</label>
            <input value={form.supplyNo} onChange={e => setForm({ ...form, supplyNo: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Bill ID / ID No (Auto-Generated)</label>
            <input readOnly value={form.idNo} className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed font-semibold text-slate-700" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Customer</label>
          <select value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} className="w-full p-2 border rounded">
            <option value="">Select...</option>
            {customers.map(c => <option key={c._id} value={c._id}>{c.fullName}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Previous Reading</label>
            <input type="number" value={form.prevReading} onChange={e => setForm({ ...form, prevReading: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Current Reading</label>
            <input type="number" value={form.currReading} onChange={e => setForm({ ...form, currReading: e.target.value })} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Previous Date</label>
            <input type="date" value={form.prevDate || ''} onChange={e => setForm({ ...form, prevDate: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Current Date</label>
            <input type="date" value={form.currDate || ''} onChange={e => setForm({ ...form, currDate: e.target.value })} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Units</label>
            <input readOnly value={form.units} className="w-full p-2 border rounded bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Bill Date</label>
            <input type="date" value={form.billDate} onChange={e => setForm({ ...form, billDate: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Period</label>
            <input value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. April 2026" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Amount Due ($)</label>
          <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Due Date</label>
          <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full p-2 border rounded">
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" onClick={onClose} className="bg-gray-200">Cancel</Button>
          <Button type="submit" disabled={loading} onClick={handleSubmit} className="bg-[#00A859] text-white">{loading ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  );
}
