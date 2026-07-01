import React, { useState } from 'react';

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [showDev, setShowDev] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100">
        <div className="font-black text-2xl text-green-900">SHaaba<span className="text-green-600">.</span></div>
        <div className="flex gap-6 text-sm font-semibold text-slate-600">
          <button onClick={() => setShowDemo(true)} className="hover:text-green-600">Demo</button>
          <button onClick={() => setShowDev(true)} className="hover:text-green-600">Developer</button>
          <a href="/billing" className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800 transition">Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">
          Maareynta Biyaha <br/> <span className="text-green-600">oo Casri ah</span>
        </h1>
        <p className="mt-6 text-slate-500 max-w-lg text-lg">
          Nidaam dhammaystiran oo shirkadaha biyaha u suurtagelinaya iney biilasha maareeyaan, macaamiishana ay lacagta ku bixiyaan mobile-kooda.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <FeatureCard title="Biilasha" desc="Soo saarid iyo maareyn xogta macaamiisha." />
          <FeatureCard title="USSD Bixinta" desc="Lacag bixin toos ah oo mobile-ka ah." />
          <FeatureCard title="Warbixin" desc="Xisaab xir dhammaystiran oo maalinle ah." />
        </div>
      </main>

      {showDemo && <DemoModal close={() => setShowDemo(false)} />}
      {showDev && <DevModal close={() => setShowDev(false)} />}
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition">
      <h3 className="font-bold text-lg text-green-900">{title}</h3>
      <p className="text-slate-500 text-sm mt-2">{desc}</p>
    </div>
  );
}

function DemoModal({ close }) {
  const [step, setStep] = useState(1);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-green-900">Pay Bill Now</h2>
        
        {step === 1 ? (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
              <p><strong>Customer:</strong> Abdisalam Mohamed</p>
              <div className="flex justify-between mt-2">
                <p><strong>Prev:</strong> 120</p>
                <p><strong>Current:</strong> 145</p>
              </div>
              <p className="mt-2 text-green-700 font-bold">Consumed Units: 25</p>
            </div>
            
            <input type="text" placeholder="Number (e.g. 063...)" className="w-full p-3 border rounded-xl" />
            <input type="number" placeholder="Lacagta ($)" className="w-full p-3 border rounded-xl" />
            
            <button onClick={() => setStep(2)} className="w-full bg-green-700 text-white p-3 rounded-xl font-bold hover:bg-green-800">Pay Now</button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="font-bold text-xl text-green-900">Lacagta waa la helay!</h3>
            <p className="text-slate-500 mt-2 text-sm">Waad ku mahadsantahay bixinta biilkaaga.</p>
          </div>
        )}
        <button onClick={close} className="mt-6 text-slate-400 w-full hover:text-slate-600">Xir</button>
      </div>
    </div>
  );
}

function DevModal({ close }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4" />
        <h2 className="font-bold text-xl">Abdisalam M. Muhumed</h2>
        <p className="text-slate-500 text-sm mt-1">Software Architect</p>
        <div className="mt-6 flex gap-4 justify-center">
          <a href="mailto:apdizalam.mohameth@gmail.com" className="text-green-700 font-bold underline">Email</a>
        </div>
        <button onClick={close} className="mt-6 text-slate-400">Xir</button>
      </div>
    </div>
  );
}