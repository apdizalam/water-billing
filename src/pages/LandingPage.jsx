import React, { useState } from 'react';
import { Phone, User, X } from 'lucide-react';

const LandingPage = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [showDev, setShowDev] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation - Top Right */}
      <nav className="flex justify-end p-6 gap-4 font-semibold">
        <button onClick={() => setShowDemo(true)} className="hover:text-green-600">Demo</button>
        <button onClick={() => setShowDev(true)} className="hover:text-green-600">Developer</button>
      </nav>

      {/* Hero Section - Green & White Theme */}
      <header className="p-10 bg-green-700 text-white rounded-b-3xl">
        <h1 className="text-4xl font-bold">SHAABA Water Billing System</h1>
        <p className="mt-4">Maareynta casriga ah ee biyaha iyo biilka.</p>
      </header>

      {/* Pay Bill Form - Design inspired by mobile app */}
      <main className="max-w-md mx-auto mt-8 p-6 border rounded-xl shadow-lg border-green-100">
        <h2 className="text-xl font-bold text-green-800 mb-4">Pay Bill Now</h2>
        
        {/* Previous/Current Readings Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
          <p>Customer: Abdisalam Mohamed</p>
          <div className="flex justify-between mt-2">
            <span>Previous Reading: 120</span>
            <span>Current Reading: 145</span>
          </div>
          <p className="font-bold mt-2 text-green-700">Consumed Units: 25</p>
        </div>

        <input type="text" placeholder="Supply No" className="w-full p-3 mb-3 border rounded" />
        <input type="number" placeholder="Amount (USD)" className="w-full p-3 mb-3 border rounded" />
        <button className="w-full bg-green-800 text-white p-3 rounded font-bold">Pay Now</button>
      </main>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">USSD Simulator</h3>
              <X onClick={() => setShowDemo(false)} className="cursor-pointer" />
            </div>
            <p className="text-sm text-gray-600">Tijaabi habka bixinta lacagta halkan...</p>
          </div>
        </div>
      )}

      {/* Developer Modal */}
      {showDev && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Developer Info</h3>
              <X onClick={() => setShowDev(false)} className="cursor-pointer" />
            </div>
            <div className="flex items-center gap-4">
              <User size={40} className="text-green-700" />
              <div>
                <p className="font-bold">Abdisalam Mohamed Muhumed</p>
                <p className="text-xs">Software Developer & Architect</p>
                <p className="text-xs">+252 633 173144</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;