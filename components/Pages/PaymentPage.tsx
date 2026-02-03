
import React, { useState, useEffect } from 'react';
import { BillingAddress } from '../../types';

interface PaymentPageProps {
  propertyId: string;
  onDownloadStart: () => void;
  onNavigateHome: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ 
  propertyId, 
  onDownloadStart,
  onNavigateHome
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    addressLine1: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processor logic
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onDownloadStart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="bg-slate-50 min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Payment Successful</h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-2">
            Thank you for your purchase.
          </p>
          <p className="text-slate-500 font-medium mb-8">
            Your bidding package download will begin automatically.
          </p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">A receipt has been sent to:</p>
            <p className="text-lg font-black text-slate-900">{formData.email}</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onDownloadStart}
              className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-600/20"
            >
              Download Bidding Package
            </button>
            <button 
              onClick={onNavigateHome}
              className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition text-sm uppercase tracking-widest"
            >
              Return to Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const COMMON_COUNTRIES = [
    "Canada", "United States", "United Kingdom", "Australia", "Germany", "France", "China", "India", "Japan"
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Page Header */}
          <div className="bg-slate-900 px-8 md:px-12 py-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">Purchase Bidding Package</h1>
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
                Property ID: {propertyId}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="lg:col-span-3 p-8 md:p-12 space-y-10">
              {/* Package Description */}
              <div className="space-y-4">
                <p className="text-slate-900 font-bold text-lg leading-relaxed">
                  You are purchasing the official municipal bidding package for the property listed above.
                </p>
                <p className="text-slate-500 font-medium leading-relaxed">
                  This package contains all documents required to submit a bid to the municipality.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Customer Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        placeholder="Legal name for receipt"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none transition font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="name@example.com"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none transition font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Billing Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Country</label>
                      <div className="relative">
                        <select
                          required
                          value={billingAddress.country}
                          onChange={e => setBillingAddress({...billingAddress, country: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition font-bold appearance-none"
                        >
                          <option value="">Select Country</option>
                          {COMMON_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                          <option disabled>──────────</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Street Address</label>
                      <input 
                        type="text" 
                        required
                        value={billingAddress.addressLine1}
                        onChange={e => setBillingAddress({...billingAddress, addressLine1: e.target.value})}
                        placeholder="123 Street Ave."
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none transition font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">City</label>
                        <input 
                          type="text" 
                          required
                          value={billingAddress.city}
                          onChange={e => setBillingAddress({...billingAddress, city: e.target.value})}
                          placeholder="Toronto"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none transition font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Province / State</label>
                        <input 
                          type="text" 
                          required
                          value={billingAddress.province}
                          onChange={e => setBillingAddress({...billingAddress, province: e.target.value})}
                          placeholder="e.g. Ontario"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none transition font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Postal / ZIP Code</label>
                      <input 
                        type="text" 
                        required
                        value={billingAddress.postalCode}
                        onChange={e => setBillingAddress({...billingAddress, postalCode: e.target.value})}
                        placeholder="M5H 2N2"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none transition font-bold uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Payment Details</h3>
                  <div className="p-6 bg-slate-900 rounded-3xl space-y-4 shadow-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Credit Card</span>
                      <div className="flex gap-1.5">
                        <div className="w-8 h-5 bg-white/10 rounded"></div>
                        <div className="w-8 h-5 bg-white/10 rounded"></div>
                        <div className="w-8 h-5 bg-white/10 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-14 bg-white/5 border border-white/10 rounded-xl flex items-center px-4">
                        <span className="text-white/20 font-mono tracking-[0.3em]">•••• •••• •••• ••••</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-14 bg-white/5 border border-white/10 rounded-xl flex items-center px-4">
                          <span className="text-white/20 font-mono">MM / YY</span>
                        </div>
                        <div className="h-14 bg-white/5 border border-white/10 rounded-xl flex items-center px-4">
                          <span className="text-white/20 font-mono">CVC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-700 transition shadow-2xl shadow-red-600/20 text-lg flex items-center justify-center gap-3 disabled:bg-slate-400"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Pay $15 CAD & Download Package'
                  )}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-slate-50/50 p-8 md:p-12 space-y-8">
              <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Order Summary</span>
                <div className="flex justify-between items-end pb-4 border-b border-slate-100 mb-4">
                  <span className="text-slate-900 font-bold">Bidding Package</span>
                  <span className="text-slate-400 text-xs font-bold">$15.00</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-slate-900 font-black uppercase tracking-widest text-sm">Total</span>
                  <span className="text-3xl font-black text-red-600">$15 CAD</span>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  Important Information
                </h3>
                <ul className="space-y-4">
                  {[
                    "All purchases are non-refundable.",
                    `This package is tied to the Property ID shown above.`,
                    "Your receipt will be emailed immediately after payment.",
                    "Download access is provided instantly after purchase."
                  ].map((note, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                      <span className="text-red-600 font-black">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <div className="flex items-center gap-3 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">SSL Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
