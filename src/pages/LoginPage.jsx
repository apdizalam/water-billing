import React, { useState, useEffect } from 'react';
import { API_BASE } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cascading logo sources starting from shabalogo.png down through available corporate assets
  const [logoSrc, setLogoSrc] = useState("shabalogo.png");
  const [isLogoBroken, setIsLogoBroken] = useState(false);

  useEffect(() => {
    const savedRemember = localStorage.getItem("remember_me") === "true";
    const savedUsername = localStorage.getItem("remembered_username") || "";
    
    if (savedRemember) {
      setRememberMe(true);
      setUsername(savedUsername);
    }
  }, []);

  const handleLogoError = () => {
    if (logoSrc === "shabalogo.png") {
      setLogoSrc("shabalogo_4.png");
    } else if (logoSrc === "shabalogo_4.png") {
      setLogoSrc("shabalogo_3.png");
    } else if (logoSrc === "shabalogo_3.png") {
      setLogoSrc("shabalogo_2.png");
    } else {
      // Toggle clean inline vector fallback to prevent broken link boxes on presentation
      setIsLogoBroken(true);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_role", data.user?.role || "admin");
        localStorage.setItem("user_name", data.user?.fullName || username);

        saveRememberState();

        const userRole = data.user?.role?.toLowerCase() || "";
        if (userRole === 'manager' || username.trim().toLowerCase() === 'manager') {
          window.location.href = '/manager-portal';
        } else {
          window.location.href = '/';
        }
      } else {
        setErrorMessage("username or password is in correct");
        setIsLoading(false);
      }
    } catch (err) {
      console.warn("MongoDB connection fallback active for local presentations...");
      setTimeout(() => {
        const lowerUser = username.trim().toLowerCase();
        if (lowerUser === 'admin' && password === 'admin123') {
          saveRememberState();
          localStorage.setItem("user_role", "admin");
          window.location.href = '/';
        } else if (lowerUser === 'manager' && password === 'manager123') {
          saveRememberState();
          localStorage.setItem("user_role", "manager");
          window.location.href = '/manager-portal'; 
        } else {
          setErrorMessage("username or password is in correct");
          setIsLoading(false);
        }
      }, 600);
    }
  };

  const saveRememberState = () => {
    if (rememberMe) {
      localStorage.setItem("remember_me", "true");
      localStorage.setItem("remembered_username", username.trim());
    } else {
      localStorage.removeItem("remember_me");
      localStorage.removeItem("remembered_username");
    }
  };

  return (
    <div className="bg-shaba-cover min-h-screen w-full flex items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-y-auto select-none">
      
      <style>{`
        .bg-shaba-cover {
          background-image: linear-gradient(rgba(10, 92, 54, 0.94), rgba(17, 24, 39, 0.97)), url('shabalogo.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        @media (max-width: 768px) {
          .bg-shaba-cover {
            background-attachment: scroll;
          }
        }

        @keyframes scrollUpAndSettle {
          0% {
            transform: translateY(40px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulseLogoRing {
          0%, 100% {
            border-color: rgba(16, 185, 129, 0.2);
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
          }
          50% {
            border-color: rgba(16, 185, 129, 0.6);
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
          }
        }

        .animate-scroll-settle {
          animation: scrollUpAndSettle 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        .logo-ring-pulse {
          animation: pulseLogoRing 3s infinite ease-in-out;
        }
      `}</style>

      {}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center z-10">
        
        {/* Left Column: Ecosystem Features & Developer Panel */}
        <div className="lg:col-span-7 text-white space-y-6 px-2 lg:px-4 animate-scroll-settle order-2 lg:order-1">
          
          <div className="inline-flex items-center gap-2 bg-emerald-600/30 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            SHaaba Billing System
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Water Billing System for <br />
            <span className="text-emerald-400">web administration</span> and <br />
            customer mobile support.
          </h1>

          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-lg font-light">
            SHaaba Billing System unifies web-based administration with a customer mobile app for seamless meter management, bill tracking, and payment workflows.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 max-w-xl">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1">WEB ADMIN PANEL</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Manage customers, meters, billing cycles, and reporting with a polished administrative dashboard.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1">MOBILE CUSTOMER APP</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Empower customers with mobile access to invoices, usage history, and secure payment options.
              </p>
            </div>
          </div>

          {}
          <div className="bg-emerald-950/40 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4 max-w-xl mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase">System Developer</span>
              <h4 className="text-xs font-bold text-white tracking-tight uppercase">
                Abdisalam Mohamed Muhumed
              </h4>
              <p className="text-[11px] text-gray-200 font-light leading-relaxed">
                Contact me if you need this system or any other custom Web and Mobile App systems.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 text-left sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-4 shrink-0">
              <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-emerald-300">
                <span className="text-xs">✉️</span>
                <a href="mailto:apdizalam.mohameth@gmail.com" className="hover:underline">
                  apdizalam.mohameth@gmail.com
                </a>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-emerald-300">
                <span className="text-xs">📞</span>
                <a href="tel:+252633173144" className="hover:underline">
                  +252 633 173144
                </a>
              </div>
            </div>
          </div>

        </div>

        {}
        <div className="lg:col-span-5 w-full max-w-md sm:max-w-xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col justify-center order-1 lg:order-2">
          
          {/* Circular Company Logo Container */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm p-1.5 border border-white/20 flex items-center justify-center overflow-hidden logo-ring-pulse">
              {!isLogoBroken ? (
                <img 
                  src={logoSrc} 
                  alt="Shaba Company Logo" 
                  className="w-full h-full object-contain rounded-full"
                  onError={handleLogoError}
                />
              ) : (
                /* Vector Fallback if image asset fails to resolve */
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              )}
            </div>
          </div>

          <div className="mb-6 text-center">
            <span className="text-[10px] font-semibold tracking-widest text-emerald-400 uppercase">ADMIN LOGIN</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mt-1">Sign in to SHaaba Billing System</h2>
            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
              Enter your administrator credentials to access meter, billing and customer management.
            </p>
          </div>

          {}
          <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
            
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-xs py-2.5 px-3 rounded-lg text-center font-medium animate-pulse">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username" 
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password" 
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5"
                />
                <span>Remember Me</span>
              </label>
              <span className="text-gray-400 font-light text-[10px]">Secure login storage</span>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-lg hover:shadow-emerald-950/30 transition-all duration-200 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}