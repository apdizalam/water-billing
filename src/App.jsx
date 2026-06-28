import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import BillingPage from './pages/Billing';
import RegisterManagerPage from './pages/RegisterManagerPage';

import CustomersPage from './pages/CustomersPage';
import MetersPage from './pages/MetersPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { ProfileProvider } from './contexts/ProfileContext';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white w-full overflow-hidden text-left font-sans text-slate-800">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar container with mobile transition */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 flex`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="flex-1 overflow-y-auto w-full">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/managers/register" element={<RegisterManagerPage />} />
            
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/meters" element={<MetersPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}
