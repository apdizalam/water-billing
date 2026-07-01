import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';
import { Printer, FileText } from 'lucide-react';

const API = API_BASE;

const getClientName = (bill) =>
  bill.customer?.fullName ||
  bill.customerName ||
  (bill.customerId && typeof bill.customerId === 'object' ? bill.customerId.fullName : null) ||
  'Water Client';

const getBillAmount = (bill) => Number(bill.amountDue ?? bill.totalAmount ?? bill.amount ?? 0);

const getUnits = (bill) => bill.unitsConsumed ?? bill.unitsUsed ?? bill.units ?? 0;

const Reports = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = () => {
      axios
        .get(`${API}/billing`, { withCredentials: true })
        .then((res) => {
          setBills(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchBills();
    const refresh = () => fetchBills();
    window.addEventListener('bills:updated', refresh);
    return () => window.removeEventListener('bills:updated', refresh);
  }, []);

  const triggerTargetedPrint = (reportItem) => {
    const frame = window.open('', '_blank');
    frame.document.write(`
      <html>
        <head>
          <title>Invoice Statement - Shaba Water</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
            .bill-box { border: 1px solid #ccc; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto; }
            .title { text-align: center; color: #2e7d32; margin-bottom: 20px; text-transform: uppercase; }
            .row-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; border-bottom: 1px dashed #eee; padding-bottom: 4px; }
            .total-due { font-size: 18px; font-weight: bold; color: #2e7d32; margin-top: 15px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="bill-box">
            <h2 class="title">Shaba Water Supply</h2>
            <div class="row-item"><span><strong>Invoice ID:</strong></span> <span>${reportItem.invoiceNo || reportItem.billNo || reportItem.billNumber || '1'}</span></div>
            <div class="row-item"><span><strong>Customer Name:</strong></span> <span>${reportItem.customer?.fullName || reportItem.customerName || (reportItem.customerId && typeof reportItem.customerId === 'object' ? reportItem.customerId.fullName : 'Water Client')}</span></div>
            <div class="row-item"><span><strong>Consumption Units:</strong></span> <span>${reportItem.unitsUsed || reportItem.units || '0'} m³</span></div>
            <div class="row-item"><span><strong>Billing Period:</strong></span> <span>${reportItem.period || '—'}</span></div>
            <div class="row-item"><span><strong>Previous Date:</strong></span> <span>${reportItem.previousDate ? new Date(reportItem.previousDate).toLocaleDateString() : (reportItem.prevDate ? new Date(reportItem.prevDate).toLocaleDateString() : '—')}</span></div>
            <div class="row-item"><span><strong>Current Date:</strong></span> <span>${reportItem.currentDate ? new Date(reportItem.currentDate).toLocaleDateString() : (reportItem.currDate ? new Date(reportItem.currDate).toLocaleDateString() : '—')}</span></div>
            <div class="total-due"><span>Total Amount Due:</span> <span>$${(reportItem.amountDue ?? reportItem.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    frame.document.close();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Real Reports Ledger...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-6 print:bg-white print:py-0 print:px-0">
      <div
        id="shaba-report-document"
        className="max-w-5xl mx-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:border-none print:shadow-none print:max-w-none"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <h1 className="text-lg font-bold text-slate-800">System Reports</h1>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>
        </div>

        <div className="hidden print:block text-center pb-6 border-b-2 border-gray-300">
          <h1 className="text-2xl font-black text-slate-900">SHABA WATER SYSTEM REPORT</h1>
          <p className="text-xs text-gray-500 mt-1">
            Date Generated: {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>

        <div className="mt-6 overflow-x-auto print:mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200 print:bg-transparent">
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Invoice No</th>
                <th className="px-4 py-3">Units Used</th>
                <th className="px-4 py-3">Total Due</th>
                <th className="px-4 py-3 text-center print:hidden">Actions</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No data stored in database.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill._id} className="print:hover:bg-transparent">
                    <td className="px-4 py-3 font-semibold text-slate-800">{getClientName(bill)}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {bill.invoiceNo || bill.billNo || bill.billNumber || 'SHB-INV'}
                    </td>
                    <td className="px-4 py-3">{getUnits(bill)} m³</td>
                    <td className="px-4 py-3 font-bold">
                      ${getBillAmount(bill).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center print:hidden">
                      <button 
                        onClick={() => triggerTargetedPrint(bill)} 
                        style={{ padding: '4px 8px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Print Invoice
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          bill.status === 'Paid' || bill.status === 'Completed'
                            ? 'text-emerald-700 bg-emerald-50 print:bg-transparent'
                            : 'text-amber-700 bg-amber-50 print:bg-transparent'
                        }`}
                      >
                        {bill.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
