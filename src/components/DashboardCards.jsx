import { Users, CheckCircle, AlertTriangle, Banknote } from 'lucide-react';

export default function DashboardCards({ stats }) {
  const cards = [
    {
      id: 1,
      title: 'CUSTOMERS',
      value: stats?.customers || '0',
      badge: '+4%',
      badgeColor: 'bg-green-100 text-green-700',
      icon: Users,
    },
    {
      id: 2,
      title: 'BILLS PAID',
      value: stats?.billsPaid || '0',
      badge: 'Active',
      badgeColor: 'bg-green-100 text-green-700',
      icon: CheckCircle,
    },
    {
      id: 3,
      title: 'OVERDUE',
      value: stats?.overdue || '0',
      badge: 'Urgent',
      badgeColor: 'bg-red-100 text-red-700', // Keep red for overdue status badge only
      icon: AlertTriangle,
    },
    {
      id: 4,
      title: 'REVENUE',
      value: `$${stats?.revenue?.toLocaleString() || '0'}`,
      badge: 'Daily',
      badgeColor: 'bg-green-100 text-green-700',
      icon: Banknote,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.id} 
            className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 rounded-[2rem] p-6 text-slate-800 relative overflow-hidden transition-transform hover:-translate-y-1"
          >
            {/* Background Icon (Translucent Green) */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-green-500/10">
              <Icon size={120} strokeWidth={1.5} />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <h3 className="text-xs font-bold tracking-wider text-green-600 mb-2 uppercase">{card.title}</h3>
              <div className="flex items-end gap-3 mt-1">
                <span className="text-5xl font-extrabold text-slate-800">{card.value}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${card.badgeColor} mb-2`}>
                  {card.badge}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
