
import React from 'react';
import { User } from '../../../types';

interface AccountDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const AccountDashboard: React.FC<AccountDashboardProps> = ({ user, onNavigate }) => {
  const { subscription } = user;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">Account Dashboard</h1>
        <p className="text-slate-500 font-medium italic">Welcome back, {user.email}. Manage your access and view your investment tools.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Status Card */}
        <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Subscription Summary</h2>
            
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="px-6 py-4 bg-slate-900 rounded-3xl text-white">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                <span className="text-xl font-black uppercase flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {subscription.status}
                </span>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Plan</span>
                <span className="text-xl font-black text-slate-900 uppercase">{subscription.plan}ly</span>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Next Billing Date</span>
                <span className="font-black text-slate-900">{new Date(subscription.nextBillingDate).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Auto-Renewal</span>
                <span className={`font-black uppercase tracking-widest ${subscription.autoRenew ? 'text-emerald-600' : 'text-red-600'}`}>
                  {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="mt-10">
              <button 
                onClick={() => onNavigate('account-billing')}
                className="px-8 py-3 bg-red-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-600/20"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/20 rounded-full blur-3xl -mr-12 -mt-12"></div>
            <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-slate-400">Investor Toolbox</h3>
            <div className="space-y-3">
              <button onClick={() => onNavigate('listings')} className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition group">
                <span className="block text-sm font-black uppercase tracking-wider group-hover:text-red-500 transition-colors">Tax Sale Listings</span>
              </button>
              <button onClick={() => onNavigate('calendar')} className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition group">
                <span className="block text-sm font-black uppercase tracking-wider group-hover:text-red-500 transition-colors">Upcoming Auctions</span>
              </button>
              <button onClick={() => onNavigate('map')} className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition group">
                <span className="block text-sm font-black uppercase tracking-wider group-hover:text-red-500 transition-colors">Interactive Map</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
             <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4">Account Support</h3>
             <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">Need help with your subscription or have property questions?</p>
             <button 
              onClick={() => onNavigate('contact')}
              className="w-full py-4 border-2 border-slate-100 text-slate-900 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-slate-50 transition"
             >
               Contact Support
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
