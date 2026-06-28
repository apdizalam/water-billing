import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, UserPlus, PlusSquare, List, FileInvoice } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { id: 1, label: 'ADD CUSTOMER', icon: UserPlus, route: '/customers' },
    { id: 2, label: 'CREATE METER', icon: PlusSquare, route: '/meters' },
    { id: 3, label: 'ALL BILLS', icon: List, route: '/billing' },
    { id: 4, label: 'NEW BILL', icon: FileInvoice, route: '/billing' },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-sm xl:max-w-none mx-auto xl:mx-0">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
        <Zap size={20} className="text-slate-400 fill-slate-400" />
      </div>

      <div className="space-y-4">
        {/* Primary Action Button */}
        <button 
          onClick={() => navigate('/customers')}
          className="w-full bg-[#00A859] hover:bg-[#008f4c] text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 font-semibold shadow-md transition-colors"
        >
          <ArrowRight size={20} />
          Manage Customers
        </button>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button 
                key={action.id} 
                onClick={() => navigate(action.route)}
                className="bg-white border text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors rounded-3xl py-6 px-4 flex flex-col items-center justify-center gap-3 shadow-sm h-32"
              >
                <div className="w-12 h-12 rounded-full bg-[#f1faf4] flex items-center justify-center shadow-inner">
                  <Icon size={22} className="text-[#00A859]" />
                </div>
                      <span className="text-xs font-bold text-center tracking-wide leading-tight">
                        {action.label.split(' ').map((line, i) => (
                          <span key={i} className="block">{line}</span>
                        ))}
                      </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
