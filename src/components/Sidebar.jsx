import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Gauge, CreditCard, BarChart2, UserPlus, LogOut, X } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

export default function Sidebar({ collapsed, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { profileImage } = useProfile();

  const [adminName, setAdminName] = useState("");
  const [adminAvatar, setAdminAvatar] = useState("https://via.placeholder.com/150");

  const sessionUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch { return {}; }
  })();
  const role = sessionUser.role || localStorage.getItem('role') || localStorage.getItem('userRole') || 'admin';

  useEffect(() => {
    const syncSidebarProfile = () => {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const isManager = stored.role === 'manager' || (stored.username && stored.username !== 'admin') || role === 'manager';
      
      setAdminName(stored.name || (isManager ? "Shaba Manager" : "abdisalam mohamed"));
      if (stored.avatar) {
        setAdminAvatar(stored.avatar);
      } else {
        setAdminAvatar("https://via.placeholder.com/150");
      }
    };

    syncSidebarProfile();
    window.addEventListener("storage_profile_updated", syncSidebarProfile);
    return () => window.removeEventListener("storage_profile_updated", syncSidebarProfile);
  }, [role]);

  const allNav = [
    { key: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { key: 'customers', label: 'Customers', path: '/customers', icon: Users },
    { key: 'meters', label: 'Meters', path: '/meters', icon: Gauge },
    { key: 'billing', label: 'Billing', path: '/billing', icon: CreditCard },
    { key: 'reports', label: 'Reports', path: '/reports', icon: BarChart2 },
    { key: 'managers', label: 'Manager Registration', path: '/managers/register', icon: UserPlus },
  ];

  const navItems = role === 'manager'
    ? allNav.filter(item => item.key !== 'reports' && item.key !== 'managers')
    : allNav;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <aside data-app-sidebar className={`print:hidden fixed left-0 top-0 bottom-0 w-full max-w-[85vw] bg-white z-40 transition-transform ${collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'} md:static md:flex flex-col md:w-64 border-r border-slate-100 min-h-screen shadow-2xl md:shadow-sm`}>
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-[#00A859] tracking-wider">
          {role === 'manager' ? 'MANAGER' : 'ADMIN'}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Link
              key={item.key}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? 'bg-[#00A859] text-white shadow-md' 
                  : 'text-slate-600 hover:bg-[#e6f6ee] hover:text-[#00A859] group'
              }`}
            >
              <Icon 
                size={20} 
                className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#00A859] transition-colors'} 
              />
              <span className="text-sm truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <img 
              src={adminAvatar} 
              alt="User" 
              className="w-full h-full object-cover" 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = 'https://ui-avatars.com/api/?name=Admin&background=00A859&color=fff'; 
              }} 
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs text-slate-500 font-medium">Welcome back</span>
            <span className="text-sm font-bold text-slate-800 truncate">{adminName}</span>
          </div>
        </div>

        <button 
          onClick={handleSignOut} 
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-100"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
