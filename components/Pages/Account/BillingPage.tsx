
import React, { useState } from 'react';
import { User } from '../../../types';

interface BillingPageProps {
  user: User;
  onUpdateSubscription: (updates: Partial<User['subscription']>) => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({ user, onUpdateSubscription }) => {
  const { subscription } = user;
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = () => {
    onUpdateSubscription({ 
      autoRenew: false, 
      cancelAtPeriodEnd: true,
      status: 'canceled' 
    });
    setShowCancelConfirm(false);
  };

  const planAmount = subscription.plan === 'monthly' ? '$20.00' : '$100.00';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Billing & Subscription</h1>
        <div className="w-16 h-1.5 bg-red-600 rounded-full"></div>
      </div>

      <div className="space-y-8">
        {/* Active Plan Detail */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Your Current Plan</span>
              <h2 className="text-3xl font-black uppercase tracking-tight">{subscription.plan}ly Subscription</h2>
            </div>
            <div className="text-center md:text-right">
              <span className="block text-3xl font-black text-emerald-400">{planAmount}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">per {subscription.plan === 'monthly' ? 'month' : 'year'}</span>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Frequency</h4>
                <p className="font-bold text-slate-900">Billed every {subscription.plan === 'monthly' ? '30 days' : '12 months'}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Next Billing Amount</h4>
                <p className="font-bold text-slate-900">{subscription.cancelAtPeriodEnd ? '$0.00' : planAmount} CAD</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Billing Method</h4>
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                  Visa ending in 4242
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Auto-Renewal</h4>
                <p className={`font-black uppercase text-xs ${subscription.autoRenew ? 'text-emerald-600' : 'text-red-600'}`}>
                  {subscription.autoRenew ? 'Active' : 'Disabled'}
                </p>
              </div>
            </div>

            {subscription.status === 'canceled' ? (
              <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl">
                <p className="text-amber-800 text-sm font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Your subscription will end on {new Date(subscription.nextBillingDate).toLocaleDateString()}.
                </p>
                <button 
                  onClick={() => onUpdateSubscription({ autoRenew: true, cancelAtPeriodEnd: false, status: 'active' })}
                  className="mt-4 text-xs font-black text-amber-900 uppercase underline decoration-2 underline-offset-4"
                >
                  Resume Auto-Renewal
                </button>
              </div>
            ) : (
              <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="max-w-md">
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    By keeping your subscription active, you maintain full access to bidding packages, property maps, and historical sale data.
                    <span className="block mt-1 italic font-bold">Payments are non-refundable after processing.</span>
                  </p>
                </div>
                <button 
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-8 py-3 bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-50 hover:text-red-600 transition"
                >
                  Cancel Subscription
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Informational Card */}
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
           <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4">Subscription Policy</h3>
           <ul className="space-y-3">
             {[
               "Auto-renewal occurs on your next billing date.",
               "Cancellations must be made prior to renewal to avoid charges.",
               "As per our Terms & Conditions, all sales are final and non-refundable.",
               "Access remains active until the end of your current paid period."
             ].map((text, i) => (
               <li key={i} className="flex gap-3 items-start text-xs text-slate-600 font-medium">
                 <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1 flex-shrink-0"></div>
                 {text}
               </li>
             ))}
           </ul>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowCancelConfirm(false)}></div>
          <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Cancel Subscription?</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Are you sure you want to stop auto-renewal? You will lose access to premium features on <span className="text-slate-900 font-black">{new Date(subscription.nextBillingDate).toLocaleDateString()}</span>.
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleCancel}
                className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-red-700 transition"
              >
                Confirm Cancellation
              </button>
              <button 
                onClick={() => setShowCancelConfirm(false)}
                className="w-full py-4 bg-slate-100 text-slate-600 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-slate-200 transition"
              >
                Keep Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
