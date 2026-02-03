
import React, { useState, useEffect } from 'react';
import { SiteConfig, LegalContent, SubscriptionPlan } from '../../types';
import { storage } from '../../services/storage';

interface CreateAccountPageProps {
  onSignup: (plan: SubscriptionPlan, email: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToContact: () => void;
  config: SiteConfig;
}

export const CreateAccountPage: React.FC<CreateAccountPageProps> = ({ config, onSignup, onNavigateToLogin, onNavigateToContact }) => {
  const [subscription, setSubscription] = useState<SubscriptionPlan>('monthly');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const HouseIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms and Conditions to continue.");
      return;
    }

    // In a real app, this is where you would call Supabase/Backend auth:
    // const { user, error } = await supabase.auth.signUp({ email, password });
    
    // For this prototype, we proceed to payment and pass the email
    onSignup(subscription, email);
  };

  return (
    <div className="bg-white min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight uppercase">{config.signupHeadline}</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            {config.signupSubheadline}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Benefits */}
          <div className="space-y-8 bg-slate-50/50 p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="relative">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Member Benefits</h2>
              <div className="w-12 h-1 bg-red-600 rounded-full"></div>
            </div>
            
            <div className="space-y-8">
              {config.signupBenefits.map((benefit) => (
                <div key={benefit.id} className="flex gap-5 items-start group">
                  <div className="flex-shrink-0 w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-red-600 relative overflow-hidden transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:-rotate-3">
                    <HouseIcon />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1 leading-tight tracking-tight group-hover:text-red-600 transition-colors">{benefit.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <h4 className="font-black text-xl mb-2 relative z-10">Need Assistance?</h4>
                <p className="text-slate-400 text-sm font-medium relative z-10 leading-relaxed mb-6">
                  Our professional support team is available to help you navigate the platform and answer any questions.
                </p>
                <button 
                  onClick={onNavigateToContact}
                  className="relative z-10 inline-flex items-center gap-2 text-white font-black hover:text-red-400 underline decoration-red-600 decoration-2 underline-offset-4 transition-all text-xs uppercase tracking-[0.2em]"
                >
                  Contact support team
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="bg-white p-2 lg:p-6">
            <form onSubmit={handleContinue} className="space-y-8">
              <section className="space-y-6">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] italic">1</span>
                  Select Your Plan
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setSubscription('monthly')}
                    className={`relative p-6 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${subscription === 'monthly' ? 'bg-white border-red-600 ring-4 ring-red-500/5 shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-lg font-black text-slate-900">Monthly</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${subscription === 'monthly' ? 'border-red-600' : 'border-slate-300'}`}>
                        {subscription === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">$20</span>
                      <span className="text-slate-400 font-bold text-xs">/mo</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setSubscription('yearly')}
                    className={`relative p-6 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${subscription === 'yearly' ? 'bg-white border-red-600 ring-4 ring-red-500/5 shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="absolute -top-3 right-6 px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">Best Value</div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-lg font-black text-slate-900">Yearly</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${subscription === 'yearly' ? 'border-red-600' : 'border-slate-300'}`}>
                        {subscription === 'yearly' && <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">$100</span>
                      <span className="text-slate-400 font-bold text-xs">/yr</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] italic">2</span>
                  Account Details
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition font-bold"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Choose Password</label>
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Re-enter Password</label>
                      <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Must match"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition font-bold"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="space-y-6">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative mt-1">
                    <input 
                      type="checkbox" 
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="peer h-6 w-6 appearance-none rounded-lg border-2 border-slate-200 transition-all checked:bg-red-600 checked:border-red-600"
                    />
                    <svg className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-1 top-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                    I agree to the <button type="button" className="text-red-600 hover:underline">Terms & Conditions</button> and <button type="button" className="text-red-600 hover:underline">Privacy Policy</button>. I understand that all sales are final and non-refundable.
                  </span>
                </label>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-red-600/30 hover:bg-red-700 hover:-translate-y-1 active:scale-95 transition transform text-sm"
                >
                  Continue to Payment
                </button>

                <div className="text-center pt-4 border-t border-slate-100">
                  <p className="text-slate-500 text-sm font-bold">
                    Already a member? 
                    <button onClick={onNavigateToLogin} className="text-red-600 font-black ml-2 hover:underline decoration-2 underline-offset-4">Sign in here</button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
