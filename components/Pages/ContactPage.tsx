import React, { useState, useEffect } from 'react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    captchaInput: ''
  });
  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setCaptcha({
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      return;
    }

    // Captcha Check
    if (parseInt(formData.captchaInput) !== captcha.a + captcha.b) {
      setError("Incorrect CAPTCHA answer. Please try again.");
      generateCaptcha();
      setFormData({ ...formData, captchaInput: '' });
      return;
    }

    // Simulate API Call
    console.log("Sending message...", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-slate-50 min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Message Sent Successfully!</h2>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            We will get back to you shortly. Make sure to check your spam/junk folders just in case you miss our email.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-10 px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black transition shadow-lg"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 rounded-full border border-red-100">
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Contact Our Experts</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Have questions about a specific listing, tax sales, etc. We're here to help.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full -mr-32 -mt-32"></div>
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium" 
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium" 
                placeholder="(555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Message *</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium resize-none" 
                placeholder="How can we help you today?"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Security Check (CAPTCHA) *</label>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="bg-slate-100 px-8 py-4 rounded-2xl font-black text-2xl text-slate-700 select-none tracking-widest italic">
                  {captcha.a} + {captcha.b} = ?
                </div>
                <input 
                  type="number" 
                  required
                  value={formData.captchaInput}
                  onChange={(e) => setFormData({...formData, captchaInput: e.target.value})}
                  className="w-full sm:w-48 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition font-black text-center text-xl" 
                  placeholder="Answer"
                />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Prove you are human</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-700 transition shadow-2xl shadow-red-600/20 text-lg"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8">
            <h4 className="font-black text-slate-900 mb-2 uppercase tracking-widest text-sm">Office Hours</h4>
            <p className="text-slate-500 font-medium">Mon - Fri: 9am - 5pm EST</p>
          </div>
          <div className="p-8">
            <h4 className="font-black text-slate-900 mb-2 uppercase tracking-widest text-sm">Response Time</h4>
            <p className="text-slate-500 font-medium">Within 24-48 Business Hours</p>
          </div>
          <div className="p-8">
            <h4 className="font-black text-slate-900 mb-2 uppercase tracking-widest text-sm">Direct Email</h4>
            <p className="text-slate-500 font-medium">support@mapleleaftax.ca</p>
          </div>
        </div>
      </div>
    </div>
  );
};