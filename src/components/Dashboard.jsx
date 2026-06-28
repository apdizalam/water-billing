import { useEffect, useState } from 'react';
import axios from 'axios';
import RecentTransactions from './RecentTransactions';
import Footer from './Footer';
import DashboardCards from './DashboardCards';
import QuickActions from './QuickActions';
import Header from './Header';
import Sidebar from './Sidebar';
import { API_BASE } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/dashboard/stats`, { withCredentials: true });
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchDashboardData();
  }, []);

  const role = localStorage.getItem('role') || 'admin';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar collapsed={!sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-h-screen ml-0 md:ml-72">
        <Header toggleSidebar={() => setSidebarOpen(s => !s)} />

        <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">Welcome back, user</h1>
            <p className="text-slate-500 font-medium">Here's a snapshot of your system performance today.</p>
          </div>

          <div className="hidden sm:block">
            <div className="bg-[#e6f6ee] text-[#00A859] font-bold text-xs px-4 py-1.5 rounded-full tracking-wider uppercase border border-[#b3e6cc]">
              {role === 'manager' ? 'MANAGER' : 'ADMIN'}
            </div>
          </div>
        </div>

        <section className="mb-8">
          <DashboardCards stats={stats} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Quick Actions <span className="text-slate-400">⚡</span></h3>
              <QuickActions />
            </div>
          </aside>

          <section className="lg:col-span-8">
            <RecentTransactions />
          </section>
        </div>

        <div className="mt-10">
          <Footer />
        </div>
      </main>
    </div>
  );
}
