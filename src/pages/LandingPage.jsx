import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, Sparkles, ShieldCheck, Globe, Code2 } from 'lucide-react';

const services = [
  {
    title: 'Soosaarista Biilka',
    description: 'Dhise xisaab sax ah oo biilal ah oo macluumaad buuxa ku salaysan isticmaalka biyaha iyo macaamiisha.',
    icon: Sparkles,
  },
  {
    title: 'Ku bixi Mobilka',
    description: 'Taageero gaar ah oo USSD/mobile payments ah si aad u bixiso bilahaaga si fudud oo xawaare leh.',
    icon: Phone,
  },
  {
    title: 'Iskudubarid Toos ah',
    description: 'La soco xogta bixinta, macaamiisha iyo warbixinnada wakhti-dhab ah oo dhan hal meel.',
    icon: Globe,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const servicesRef = useRef(null);
  const developerRef = useRef(null);
  const [showDemo, setShowDemo] = useState(false);
  const [showDeveloper, setShowDeveloper] = useState(false);
  const [ussdPhone, setUssdPhone] = useState('');
  const [ussdAmount, setUssdAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [imgError, setImgError] = useState(false);

  const handleScrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openDeveloper = () => {
    setShowDeveloper(true);
    setTimeout(() => developerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleBillingRoute = () => {
    navigate('/billing');
  };

  const handleDemoSubmit = (event) => {
    event.preventDefault();
    if (!ussdPhone || !ussdAmount) {
      setPaymentStatus('Fadlan geli lambarka iyo lacagta si aad u sii wado.');
      return;
    }

    setPaymentStatus(`USSD code generated: *152*9*${ussdAmount}#  - Waxaad u diri kartaa si aad u bixiso.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-sky-600 to-cyan-500 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_25%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-900/20 backdrop-blur-md">
                <Sparkles className="h-4 w-4" /> SHaaba Water Billing System
              </p>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Xalka casriga ah ee maareynta biyaha iyo biilka
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-emerald-100/95">
                Meesha ugu sareysa ee xisaabinta biilka, soo saarista warbixinnada, iyo bixinta mobile-ka. Kordhi xawaaraha maamulkaaga biyaha oo u beddel macaamiishaada adeeg heer sare ah.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleBillingRoute}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg shadow-emerald-900/10 transition duration-300 hover:-translate-y-1 hover:bg-emerald-50"
                >
                  Bilow Hadda
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowDemo(true)}
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white/15"
                >
                  Demo
                </button>
                <button
                  type="button"
                  onClick={openDeveloper}
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white/15"
                >
                  Developer
                </button>
              </div>
            </div>
            <div className="relative flex-1 rounded-[2rem] border border-white/20 bg-white/10 p-8 shadow-2xl shadow-black/15 backdrop-blur-xl">
              <div className="absolute -right-16 top-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="relative rounded-[1.75rem] border border-white/20 bg-white/10 p-6 shadow-xl shadow-black/10 backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl bg-white/10 p-5 text-sm text-emerald-50">
                  <div>
                    <p className="font-semibold">Xawaare & Hufnaan</p>
                    <p className="text-slate-200/90">Soo saar biilal, macluumaad iyo warbixino degdeg ah.</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-emerald-100">Live</div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-4xl font-semibold">+20%</p>
                    <p className="text-sm text-slate-200/80">Hagaajinta nidaamka waxtarka.</p>
                  </div>
                  <div className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-4xl font-semibold">+25K</p>
                    <p className="text-sm text-slate-200/80">Wixii macluumaad ah ee la falanqeeyey bishan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100/30 bg-emerald-50/10 px-4 py-2 text-sm text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Adeegga ugu wanaagsan maamulka biyaha.
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Kala soco biilladaada, xoojiso lacag uruurinta, isla markaana si sahlan u maamul macaamiisha.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              SHaaba Water Billing 
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleScrollToServices}
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition duration-300 hover:-translate-y-1 hover:bg-emerald-700"
              >
                Adeegyada
              </button>
              <button
                type="button"
                onClick={handleBillingRoute}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50"
              >
                Admin Portal
              </button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/40">
            <div className="mb-6 rounded-[1.75rem] bg-gradient-to-br from-emerald-50 to-slate-100 p-8">
              <div className="mb-4 flex items-center gap-3 text-slate-700">
                <div className="rounded-2xl bg-white/80 p-3 text-emerald-600 shadow-sm shadow-emerald-100">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">La xiriir</p>
                  <p className="text-xs text-slate-500">Taageero 24/7</p>
                </div>
              </div>
              <div className="space-y-3 text-slate-700">
                <p className="text-sm font-semibold">Abdisalam Mohamed Muhumed</p>
                <p className="text-sm">Software Developer & Architect</p>
                <p className="text-sm">WhatsApp / Call: <span className="font-semibold text-emerald-700">+252 633 173144</span></p>
                <p className="text-sm">Email: <span className="font-semibold text-emerald-700">apdizalam.mohameth@gmail.com</span></p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Mobile Payment', 'Admin Reporting', 'Real-Time Sync', 'Secure Management'].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200/75 bg-white px-4 py-5 text-sm text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={servicesRef} className="mt-20 space-y-8" id="services">
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">Adeegyada</p>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Xalka adeegyada biyaha ee casriga ah</h3>
            <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
              Ka hel dhamaan adeegyada maamulka biilka, bixinta mobile-ka iyo warbixinada tooska ah. Ku raaxayso dareen dashboard nadiif ah oo ku habboon ganacsigaaga.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 ease-out hover:-translate-y-3 hover:border-emerald-300 hover:shadow-emerald-500/10"
                >
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 transition duration-300 group-hover:bg-emerald-100">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h4 className="mb-3 text-xl font-semibold text-slate-900">{service.title}</h4>
                  <p className="text-slate-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[0.95fr_0.9fr] lg:items-center">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
            <div className="mb-8 space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <ShieldCheck className="h-4 w-4" /> USSD Mobile Payment Simulator
              </p>
              <h3 className="text-3xl font-bold text-slate-900">Iska jar dulqaadka, bixi si toos ah mobilka</h3>
              <p className="text-base leading-7 text-slate-600">
                Tijaabi habka bixinta bilahaaga ee SHaaba iyadoo aan la tagin xafiiska. Buuxi macluumaadka hoose, ka dibna arag koodhka USSD ee bixinta.
              </p>
            </div>
            <form onSubmit={handleDemoSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Lambarka Mobaylka</label>
                <input
                  type="tel"
                  value={ussdPhone}
                  onChange={(e) => setUssdPhone(e.target.value)}
                  placeholder="+252 63x xxx xxx"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Lacagta</label>
                <input
                  type="number"
                  value={ussdAmount}
                  onChange={(e) => setUssdAmount(e.target.value)}
                  placeholder="Tusaale: 1500"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition duration-300 hover:-translate-y-1 hover:bg-emerald-700"
              >
                Abuur USSD
              </button>
              {paymentStatus && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                  {paymentStatus}
                </div>
              )}
            </form>
          </div>

          <div className="relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
            <div className="absolute -right-10 top-8 h-28 w-28 rounded-full bg-emerald-100/80 blur-2xl" />
            <div className="relative space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-[2.25rem] border-4 border-white bg-emerald-50 shadow-xl shadow-emerald-200/40">
                  {!imgError ? (
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop"
                      alt="Abdisalam Mohamed"
                      className="h-full w-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-emerald-100 text-3xl font-black uppercase text-emerald-700">
                      AM
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">Abdisalam Mohamed Muhumed</p>
                  <p className="text-sm text-emerald-700">Software Developer & Architect</p>
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span className="font-medium">WhatsApp / Call</span>
                  <span className="font-semibold text-slate-900">+252 633 173144</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span className="font-medium">Email</span>
                  <span className="font-semibold text-slate-900">apdizalam.mohameth@gmail.com</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleBillingRoute}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-slate-800"
                >
                  Admin Portal
                </button>
                <button
                  type="button"
                  onClick={() => setShowDemo(true)}
                  className="rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50"
                >
                  Bixi Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8">
          <div className="relative w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-900/20">
            <button
              type="button"
              onClick={() => setShowDemo(false)}
              className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50"
            >
              Close
            </button>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900">
                <Code2 className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold">USSD Mobile Payment Simulator</h2>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Tijaabi habka bixin ee SHaaba adigoo isticmaalaya koodh USSD. Gali lambarkaaga mobile-ka iyo lacagta, kadibna arag natiijada tooska ah.
              </p>
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Lambarka Mobilka</label>
                  <input
                    type="tel"
                    value={ussdPhone}
                    onChange={(e) => setUssdPhone(e.target.value)}
                    placeholder="+252 63x xxx xxx"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Lacagta</label>
                  <input
                    type="number"
                    value={ussdAmount}
                    onChange={(e) => setUssdAmount(e.target.value)}
                    placeholder="1500"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-emerald-700"
                >
                  Abuur Koodhka
                </button>
              </form>
              {paymentStatus && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {paymentStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeveloper && (
        <div className="fixed inset-0 z-40 bg-slate-950/30" onClick={() => setShowDeveloper(false)} />
      )}
    </div>
  );
};

export default LandingPage;
