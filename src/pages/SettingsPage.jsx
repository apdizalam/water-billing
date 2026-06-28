import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Settings</h1>
        <Button onClick={() => navigate('/')} variant="ghost">← Back to Dashboard</Button>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">General Settings</h3>
            <p className="text-slate-500 text-sm mb-4">Manage your dashboard preferences.</p>
            
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-800">Email Notifications</div>
                <div className="text-sm text-slate-500">Receive alerts on new customer registrations.</div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-200 checked:right-0 checked:border-green-500 checked:bg-green-500 transition-all duration-300" defaultChecked />
                <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer"></label>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-800">Dark Mode</div>
                <div className="text-sm text-slate-500">Currently unavailable.</div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in opacity-50">
                <input type="checkbox" name="toggle" id="toggle2" disabled className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-not-allowed border-slate-200 transition-all duration-300" />
                <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 cursor-not-allowed"></label>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Required style just for these toggles to work visually with Tailwind */}
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked { right: 0; border-color: #10B981; }
        .toggle-checkbox:checked + .toggle-label { background-color: #10B981; }
      `}} />
    </div>
  );
}
