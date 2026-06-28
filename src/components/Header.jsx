import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const { profileImage } = useProfile();

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminAvatar, setAdminAvatar] = useState("https://via.placeholder.com/150");

  const sessionUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch { return {}; }
  })();
  const role = sessionUser.role || localStorage.getItem('role') || localStorage.getItem('userRole') || 'admin';

  useEffect(() => {
    const syncNavbarProfile = () => {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const isManager = stored.role === 'manager' || (stored.username && stored.username !== 'admin') || role === 'manager';
      
      setAdminName(stored.name || (isManager ? "Shaba Manager" : "abdisalam mohamed"));
      setAdminEmail(stored.email || (isManager ? "manager@shaaba.com" : "abdisalam@gmail.com"));
      if (stored.avatar) {
        setAdminAvatar(stored.avatar);
      } else {
        setAdminAvatar("https://via.placeholder.com/150");
      }
    };

    syncNavbarProfile();
    window.addEventListener("storage_profile_updated", syncNavbarProfile);
    return () => window.removeEventListener("storage_profile_updated", syncNavbarProfile);
  }, [role]);

  return (
    <header data-app-header className="print:hidden flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3 w-full">
        <button onClick={toggleSidebar} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-[#e6f6ee] hover:text-[#00A859] transition-colors">
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
          <span className="text-lg sm:text-2xl font-extrabold text-slate-800 leading-tight">
            {role === 'manager' ? 'Manager Dashboard' : 'Admin Dashboard'}
          </span>
          <p className="text-gray-500 text-xs sm:text-sm">Ku soo dhowoow shirkadaa biyaaha ee shaaba</p>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-0 sm:ml-auto w-full sm:w-auto">
        <div onClick={() => navigate('/profile')} className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors">
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-bold text-slate-800 text-sm">{adminName}</span>
            <span className="text-xs text-[#00A859] font-semibold">{adminEmail}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-[#00A859]">
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
        </div>
      </div>
    </header>
  );
}

