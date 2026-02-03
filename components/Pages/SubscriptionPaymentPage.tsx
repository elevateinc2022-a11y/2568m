
import React, { useState, useEffect } from 'react';
import { User, SubscriptionPlan, SiteConfig, LegalContent, BillingAddress } from '../../types';
import { storage } from '../../services/storage';

interface SubscriptionPaymentPageProps {
  user: User | null;
  config: SiteConfig;
  onPaymentSuccess: (plan: SubscriptionPlan) => void;
  onNavigate: (view: string) => void;
  initialPlan?: SubscriptionPlan;
  initialEmail?: string;
}

const LegalModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; content: string }> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-8 overflow-y-auto text-sm text-slate-600 leading-relaxed whitespace-pre-line font-sans">
          {content}
        </div>
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <button onClick={onClose} className="px-8 py-2 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-black">Close Window</button>
        </div>
      </div>
    </div>
  );
};

export const SubscriptionPaymentPage: React.FC<SubscriptionPaymentPageProps> = ({ 
  user, 
  config, 
  onPaymentSuccess, 
  onNavigate,
  initialPlan = 'monthly',
  initialEmail = ''
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(initialPlan);
  const [agreedToRenew, setAgreedToRenew] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);
  const [legalContent, setLegalContent] = useState<LegalContent | null>(null);

  const [formData, setFormData] = useState({
    fullName: user?.role === 'admin' ? 'Active User' : '',
    email: initialEmail || user?.email || '',
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    addressLine1: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada'
  });

  useEffect(() => {
    setLegalContent(storage.getLegalContent());
  }, []);

  useEffect(() => {
    setSelectedPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    if (initialEmail && !formData.email) {
      setFormData(prev => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  const isFormFilled = 
    formData.fullName.trim() !== '' &&
    formData.email.trim() !== '' &&
    billingAddress.addressLine1.trim() !== '' &&
    billingAddress.city.trim() !== '' &&
    billingAddress.province.trim() !== '' &&
    billingAddress.postalCode.trim() !== '' &&
    billingAddress.country.trim() !== '';

  const isButtonEnabled = agreedToRenew && agreedToPolicy && !isProcessing && isFormFilled;

  const nextBillingDate = new Date();
  if (selectedPlan === 'monthly') {
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  } else {
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  }
  
  const billingDateStr = nextBillingDate.toLocaleDateString('en-CA', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const planPrice = selectedPlan === 'monthly' ? 20.00 : 100.00;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isButtonEnabled) return;

    setIsProcessing(true);
    setPaymentError(null);

    // Simulate payment processor latency
    setTimeout(() => {
      // Simulation: 10% chance of failure for demonstration
      const isDemoFailure = false; 

      if (isDemoFailure) {
        setIsProcessing(false);
        setPaymentError("Payment did not go through. Please check your payment details and try again.");
      } else {
        setIsProcessing(false);
        setShowSuccessModal(true);
      }
    }, 2500);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onPaymentSuccess(selectedPlan);
  };

  const COMMON_COUNTRIES = [
    "Canada", "United States", "United Kingdom", "Australia", "Germany", "France", "China", "India", "Japan"
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">Complete Your Subscription</h1>
          <p className="text-lg text-slate-500 font-medium">Unlock full access to Canada's premier tax sale database today.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Plan Selection */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                Select Your Plan
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setSelectedPlan('monthly')}
                  className={`relative p-6 rounded-3xl border-2 text-left transition-all ${
                    selectedPlan === 'monthly' ? 'border-red-600 bg-red-50/30' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-lg font-black text-slate-900">Monthly</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'monthly' ? 'border-red-600' : 'border-slate-300'}`}>
                      {selectedPlan === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">$20</span>
                    <span className="text-slate-500 font-bold text-sm">/mo</span>
                  </div>
                  <span className="inline-block mt-3 px-2 py-1 bg-white text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">Instant Access</span>
                </button>

                <button 
                  onClick={() => setSelectedPlan('yearly')}
                  className={`relative p-6 rounded-3xl border-2 text-left transition-all ${
                    selectedPlan === 'yearly' ? 'border-red-600 bg-red-50/30' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="absolute -top-3 right-6 px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">Best Value</div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-lg font-black text-slate-900">Yearly</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'yearly' ? 'border-red-600' : 'border-slate-300'}`}>
                      {selectedPlan === 'yearly' && <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">$100</span>
                    <span className="text-slate-500 font-bold text-sm">/year</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2 py-1 bg-white text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">Instant Access</span>
                    <span className="text-[10px] text-red-600 font-black uppercase">Save 58%</span>
                  </div>
                </button>
              </div>
            </section>

            {/* 2. User Info */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                Account Information
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    readOnly={!!user || !!initialEmail}
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="name@example.com"
                    className={`w-full px-5 py-4 border rounded-2xl outline-none transition font-bold ${
                      (user || initialEmail) ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-red-600'
                    }`}
                  />
                  {(user || initialEmail) && <p className="text-[9px] text-slate-400 mt-2 italic">Logged in as {formData.email}</p>}
                </div>
              </div>
            </section>

            {/* 3. Billing Address */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                Billing Address
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Country</label>
                  <div className="relative">
                    <select
                      required
                      value={billingAddress.country}
                      onChange={e => setBillingAddress({...billingAddress, country: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition font-bold appearance-none"
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
                    placeholder="123 Maple St."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition font-bold"
                  />
                </div>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">City</label>
                    <input 
                      type="text" 
                      required
                      value={billingAddress.city}
                      onChange={e => setBillingAddress({...billingAddress, city: e.target.value})}
                      placeholder="Toronto"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Province / State / Region</label>
                    <input 
                      type="text" 
                      required
                      value={billingAddress.province}
                      onChange={e => setBillingAddress({...billingAddress, province: e.target.value})}
                      placeholder="e.g. Ontario or New York"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Postal / ZIP Code</label>
                    <input 
                      type="text" 
                      required
                      value={billingAddress.postalCode}
                      onChange={e => setBillingAddress({...billingAddress, postalCode: e.target.value})}
                      placeholder="M5H 2N2"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 transition font-bold uppercase"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Payment */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">4</span>
                  Payment Details
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase border border-slate-100">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                  Secure Checkout
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                 <div className="h-14 bg-white/5 border border-white/10 rounded-xl flex items-center px-4">
                    <span className="text-white/20 font-mono tracking-[0.3em] flex-grow">•••• •••• •••• ••••</span>
                    <div className="flex gap-1.5 opacity-20">
                      <div className="w-8 h-5 bg-white rounded-sm"></div>
                      <div className="w-8 h-5 bg-white rounded-sm"></div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-14 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 text-white/20 font-mono">MM / YY</div>
                    <div className="h-14 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 text-white/20 font-mono">CVC</div>
                 </div>
              </div>
              <p className="mt-4 text-[10px] text-slate-400 text-center font-medium italic">
                Your payment information is processed through secure industry-standard encryption.
              </p>
            </section>
          </div>

          {/* Right Column: Billing Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden sticky top-24">
              <div className="p-8 bg-slate-900 text-white">
                <h3 className="text-xl font-black uppercase tracking-tight mb-1">Billing Summary</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Maple Leaf Tax Sales</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Selected Plan</span>
                    <span className="text-slate-900 font-black uppercase">{selectedPlan}ly</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Initial Period</span>
                    <span className="text-slate-900 font-black">{selectedPlan === 'monthly' ? '1 Month' : '1 Year'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Next Billing</span>
                    <span className="text-slate-900 font-black">{billingDateStr}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Due Today</span>
                    <span className="text-2xl font-black text-emerald-600">${planPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                  {/* Renewal Agreement Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="mt-1">
                       <input 
                        type="checkbox" 
                        checked={agreedToRenew}
                        onChange={e => setAgreedToRenew(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500" 
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold leading-relaxed group-hover:text-slate-700 transition-colors">
                      I understand that my subscription will <span className="text-red-600">automatically renew</span> on {billingDateStr} unless canceled before that date. I understand that <span className="text-red-600">no refunds</span> are provided after billing.
                    </span>
                  </label>

                  {/* Legal Terms Agreement Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="mt-1">
                       <input 
                        type="checkbox" 
                        checked={agreedToPolicy}
                        onChange={e => setAgreedToPolicy(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500" 
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold leading-relaxed group-hover:text-slate-600 transition-colors">
                      By continuing you agree to our 
                      <button type="button" onClick={(e) => { e.stopPropagation(); setActiveModal('terms'); }} className="text-red-600 hover:underline mx-1">Terms & Conditions</button> 
                      & 
                      <button type="button" onClick={(e) => { e.stopPropagation(); setActiveModal('privacy'); }} className="text-red-600 hover:underline mx-1">Privacy Policy</button>
                    </span>
                  </label>
                </div>

                {paymentError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                    {paymentError}
                  </div>
                )}

                <button 
                  onClick={handleSubmit}
                  disabled={!isButtonEnabled}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${
                    isButtonEnabled
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20 active:scale-95' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-3">
                       <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                       Processing...
                    </div>
                  ) : 'Subscribe Now'}
                </button>
              </div>
            </div>

            <div className="mt-6 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4 items-start">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Secure Access</h4>
                  <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                    Get immediate access to all bidding packages and premium investor tools.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"></div>
          <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-10 md:p-12 text-center animate-in zoom-in duration-300">
            <button 
              onClick={handleCloseSuccessModal}
              className="absolute top-8 right-8 text-slate-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>

            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">Thank you for creating your account!</h2>
            
            <div className="space-y-6 text-slate-600 font-medium leading-relaxed mb-10">
              <p>
                You will receive an email shortly with your <span className="text-slate-900 font-black">username and password</span>. 
                Please make sure to keep this information safe and <span className="text-red-600 font-black">do not share it with anyone</span>.
              </p>
              <p>
                You will also receive your <span className="text-slate-900 font-black">receipt</span> in your email.
              </p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest pt-4 border-t border-slate-100">
                Please close this window to continue to your account dashboard.
              </p>
            </div>

            <button 
              onClick={handleCloseSuccessModal}
              className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Go to My Dashboard
            </button>
          </div>
        </div>
      )}

      <LegalModal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)} 
        title="Terms & Conditions" 
        content={legalContent?.termsConditions || ''} 
      />
      <LegalModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)} 
        title="Privacy Policy" 
        content={legalContent?.privacyPolicy || ''} 
      />
    </div>
  );
};
