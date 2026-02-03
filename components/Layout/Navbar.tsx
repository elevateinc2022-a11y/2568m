
import React, { useState } from 'react';
import { User, SiteConfig } from '../../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  user: User | null;
  config: SiteConfig;
  onLogout: () => void;
  isSubscribed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, user, config, onLogout, isSubscribed }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home', isLocked: false },
    { label: 'Tax Sale Properties', view: 'listings', isLocked: !isSubscribed },
    { label: 'Sold Tax Sale Properties', view: 'sold-listings', isLocked: false }, // Explicitly unlocked
    { label: 'Properties Map', view: 'map', isLocked: false }, 
    { label: 'Upcoming Sales Calendar', view: 'calendar', isLocked: !isSubscribed },
    { label: 'Education Hub', view: 'education', isLocked: false },
  ];

  const handleNavItemClick = (view: string, isLocked: boolean) => {
    if (isLocked && !isSubscribed) {
      if (!user) {
        onNavigate('login');
      } else {
        onNavigate('subscription-payment');
      }
      return;
    }
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - Dark Red */}
      <div className="bg-[#8b0000] text-white py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition-colors" title="Facebook">
              <i className="fab fa-facebook-f text-sm"></i>
            </a>
            <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition-colors" title="Instagram">
              <i className="fab fa-instagram text-sm"></i>
            </a>
            <a href={config.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition-colors" title="TikTok">
              <i className="fab fa-tiktok text-sm"></i>
            </a>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('contact')}
              className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => onNavigate('home')}
            >
              <img src={config.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:inline">
                {config.brandName} <span className="text-red-600">{config.brandAccent}</span>
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavItemClick(item.view, item.isLocked)}
                  className={`text-[13px] font-bold transition flex items-center gap-1.5 ${
                    currentView === item.view ? 'text-red-600' : 'text-slate-600 hover:text-red-600'
                  }`}
                >
                  {item.label}
                  {item.isLocked && !isSubscribed && (
                    <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 7a2 2 0 110 4 2 2 0 010-4z"/></svg>
                  )}
                </button>
              ))}
              {user?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`text-[13px] font-bold transition ${
                    currentView === 'admin' ? 'text-red-600' : 'text-slate-600 hover:text-red-600'
                  }`}
                >
                  Admin
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 relative">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">
                        {user.email.substring(0, 1).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline">Account</span>
                      <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                          <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <button 
                            onClick={() => { onNavigate('account-dashboard'); setShowUserMenu(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-xl transition-colors"
                          >
                            Dashboard
                          </button>
                          <button 
                            onClick={() => { onNavigate('account-billing'); setShowUserMenu(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-xl transition-colors"
                          >
                            Billing
                          </button>
                          <div className="h-px bg-slate-50 my-1"></div>
                          <button 
                            onClick={() => { onLogout(); setShowUserMenu(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => onNavigate('login')}
                    className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-red-600 transition"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => onNavigate('signup')}
                    className="px-4 py-2 text-sm font-black text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-600/10 uppercase tracking-wider"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
