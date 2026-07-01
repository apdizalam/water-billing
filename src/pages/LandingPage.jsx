import React, { useState } from 'react';

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [showDev, setShowDev] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {}
      <nav className="w-full bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="text-2xl font-black text-blue-900 tracking-tight">
          SHaaba<span className="text-blue-600">.</span>
        </div>
        <div className="flex gap-8 items-center text-sm font-medium text-slate-600">
          <button onClick={() => setShowDemo(true)} className="hover:text-blue-600 transition">Demo</button>
          <button onClick={() => setShowDev(true)} className="hover:text-blue-600 transition">Developer</button>
          <a href="/billing" className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition font-semibold">Login</a>
        </div>
      </nav>

      {}
      <main className="max-w-6xl mx-auto px-8 py-20">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight">
            Maareynta Biyaha <br/> <span className="text-blue-600">oo Casri ah</span>
          </h1>
          <p className="mt-8 text-slate-500 text-xl leading-relaxed max-w-xl">
            Nidaam dhammaystiran oo shirkadaha biyaha u suurtagelinaya iney biilasha maareeyaan, macaamiishana ay lacagta ku bixiyaan mobile-kooda si degdeg ah.
          </p>
          <div className="mt-10 flex gap-4">
            <button onClick={() => setShowDemo(true)} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">Tijaabi Demo</button>
            <a href="/billing" className="border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition">Admin Portal</a>
          </div>
        </div>
        
        {}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <FeatureCard title="Biilasha" desc="Maareyn dhammaystiran oo xogta macaamiisha." />
          <FeatureCard title="USSD Bixinta" desc="Lacag bixin toos ah oo mobile-ka ah." />
          <FeatureCard title="Warbixin" desc="Xisaab xir dhammaystiran oo maalinle ah." />
        </div>
      </main>

      {}
      {showDemo && <DemoModal close={() => setShowDemo(false)} />}
      {showDev && <DevModal close={() => setShowDev(false)} />}
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="p-8 border border-slate-100 rounded-3xl bg-slate-50 hover:border-blue-200 transition">
      <h3 className="font-bold text-lg text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm mt-2">{desc}</p>
    </div>
  );
}

function DemoModal({ close }) {
  const [step, setStep] = useState(1);
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">USSD Simulator</h2>
        {step === 1 ? (
          <div className="space-y-4">
            <input type="text" placeholder="Number (063...)" className="w-full p-4 border border-slate-200 rounded-xl" />
            <input type="number" placeholder="Lacagta ($)" className="w-full p-4 border border-slate-200 rounded-xl" />
            <button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">Dir Codsiga</button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <p className="font-bold text-lg">Lacagta waa la helay!</p>
          </div>
        )}
        <button onClick={close} className="mt-6 text-slate-400 w-full hover:text-slate-900">Xir</button>
      </div>
    </div>
  );
}

function DevModal({ close }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl">
        <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4" />
        <h2 className="font-bold text-xl">Abdisalam M. Muhumed</h2>
        <p className="text-slate-500 text-sm">Software Architect</p>
        <div className="mt-6 flex gap-4 justify-center">
          <a href="mailto:apdizalam.mohameth@gmail.com" className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold">Email-ka</a>
        </div>
        <button onClick={close} className="mt-6 text-slate-400 text-sm hover:text-slate-900">Xir</button>
      </div>
    </div>
  );
}