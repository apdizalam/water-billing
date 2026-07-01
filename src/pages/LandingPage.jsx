import React, { useState } from 'react';

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [showDev, setShowDev] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation - Top Right */}
      <nav className="w-full flex items-center justify-between px-8 py-6">
        <div className="font-black text-2xl text-blue-900">SHaaba<span className="text-blue-500">.</span></div>
        <div className="flex gap-6 text-sm font-semibold text-slate-600">
          <button onClick={() => setShowDemo(true)} className="hover:text-blue-600">Demo</button>
          <button onClick={() => setShowDev(true)} className="hover:text-blue-600">Developer</button>
          <a href="/billing" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">
          Maareynta Biyaha <br/> <span className="text-blue-600">oo Casri ah</span>
        </h1>
        <p className="mt-6 text-slate-500 max-w-lg text-lg">
          Nidaam dhammaystiran oo shirkadaha biyaha u suurtagelinaya iney biilasha maareeyaan, macaamiishana ay lacagta ku bixiyaan mobile-kooda.
        </p>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <FeatureCard title="Biilasha" desc="Soo saarid iyo maareyn xogta macaamiisha." />
          <FeatureCard title="USSD Bixinta" desc="Lacag bixin toos ah oo mobile-ka ah." />
          <FeatureCard title="Warbixin" desc="Xisaab xir dhammaystiran oo maalinle ah." />
        </div>
      </main>

      {/* Modals */}
      {showDemo && <DemoModal close={() => setShowDemo(false)} />}
      {showDev && <DevModal close={() => setShowDev(false)} />}
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-slate-500 text-sm mt-2">{desc}</p>
    </div>
  );
}

function DemoModal({ close }) {
  const [step, setStep] = useState(1);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">USSD Demo Simulator</h2>
        {step === 1 ? (
          <div className="space-y-4">
            <input type="text" placeholder="Number (e.g. 063...)" className="w-full p-3 border rounded-xl" />
            <input type="number" placeholder="Lacagta" className="w-full p-3 border rounded-xl" />
            <button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">Dir Codsiga</button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <p className="font-bold">Lacagta waa la helay!</p>
          </div>
        )}
        <button onClick={close} className="mt-4 text-slate-400 w-full">Xir</button>
      </div>
    </div>
  );
}

function DevModal({ close }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center">
        <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4" />
        <h2 className="font-bold text-xl">Abdisalam M. Muhumed</h2>
        <p className="text-slate-500 text-sm mt-1">Software Architect</p>
        <div className="mt-6 flex gap-4 justify-center">
          <a href="mailto:apdizalam.mohameth@gmail.com" className="text-blue-600 font-bold underline">Email</a>
        </div>
        <button onClick={close} className="mt-6 text-slate-400">Xir</button>
      </div>
    </div>
  );
}