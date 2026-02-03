
import React from 'react';

interface BiddingPackageModalProps {
  propertyId: string;
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onGuestPurchase: () => void;
}

export const BiddingPackageModal: React.FC<BiddingPackageModalProps> = ({
  propertyId,
  isOpen,
  onClose,
  onLogin,
  onGuestPurchase
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-slate-50 px-8 pt-10 pb-6 border-b border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Download Bidding Package</h2>
            <button 
              onClick={onClose}
              className="p-2 -mt-2 -mr-2 text-slate-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
            Property ID: {propertyId}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 md:p-10 space-y-8">
          <div className="space-y-2">
            <p className="text-slate-900 font-bold text-lg leading-snug">
              Municipal Bidding Package for this property.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Includes official documents required to submit a bid to the municipality.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pricing highlight</span>
              <span className="text-2xl font-black text-slate-900">Price: $15 CAD</span>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-200">
                Free for active subscribers
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-grow bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Action</span>
                <div className="h-px flex-grow bg-slate-100"></div>
              </div>
              <div className="text-center space-y-4">
                <p className="text-sm font-bold text-slate-600">
                  Have a subscription? <br />
                  <span className="text-slate-900">Log in to download this package for free.</span>
                </p>
                <button 
                  onClick={onLogin}
                  className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  Log In & Download
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-grow bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secondary Action</span>
                <div className="h-px flex-grow bg-slate-100"></div>
              </div>
              <div className="text-center space-y-4">
                <p className="text-sm font-bold text-slate-600">
                  No account? <span className="text-slate-900">Continue as a guest and purchase this package.</span>
                </p>
                <button 
                  onClick={onGuestPurchase}
                  className="w-full py-4 bg-white border-2 border-slate-900 text-slate-900 font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  Continue as Guest – $15 CAD
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-6 text-center">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              All purchases are non-refundable. • One package per property.
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Receipt will be emailed after purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
