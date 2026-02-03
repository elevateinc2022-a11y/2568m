
import React, { useState } from 'react';

export const CareersPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expertise: 'Tax sale research & analysis',
    experience: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const expertiseAreas = [
    "Tax sale research & analysis",
    "Real estate investing",
    "Municipal / legal research",
    "Data management & analytics",
    "GIS & mapping",
    "Content writing & market education",
    "Software development & platform support",
    "Other"
  ];

  const benefits = [
    {
      title: "Remote-First & Flexible",
      description: "Work from anywhere in Canada with flexible hours that focus on outcomes, not clock-watching."
    },
    {
      title: "Build Something From the Ground Up",
      description: "Be part of a growing platform and help shape products, workflows, and decisions from an early stage."
    },
    {
      title: "Meaningful, Impact-Driven Work",
      description: "Help improve transparency and access to Canadian tax sale data for investors and everyday Canadians."
    },
    {
      title: "Small, Focused Team",
      description: "Work closely with decision-makers in a low-bureaucracy environment where your contributions matter."
    },
    {
      title: "Learning & Growth",
      description: "Gain hands-on experience across fintech, real estate data, and SaaS operations."
    },
    {
      title: "Values-Driven Culture",
      description: "We prioritize accuracy, transparency, responsible data usage, and respect for our users."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Career application submitted:", { ...formData, files: selectedFiles });
    setSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
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
          <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Application Received</h2>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Thank you for your interest in joining the Maple Leaf Tax Sales Canada team. We will keep your information on file and reach out if a matching role becomes available.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-10 px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black transition shadow-lg"
          >
            Return to Careers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-4xl mb-20">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 rounded-full border border-red-100">
            Join Our Team
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight leading-none uppercase">
            Careers at <span className="text-red-600">Maple Leaf Tax Sales</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl italic border-l-4 border-slate-200 pl-8">
            Maple Leaf Tax Sales Canada is built by and for professionals who understand tax sales, real estate, data analysis, and market intelligence.
          </p>
        </div>

        {/* Why Work With Us */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Why Work With Maple Leaf Tax Sales Canada</h2>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-4 uppercase leading-tight">{benefit.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-5 gap-16 items-start">
          
          {/* Left Column: General Statement & Expertise */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-slate-900 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight relative z-10">General Applications</h2>
              <div className="space-y-6 text-slate-300 font-medium leading-relaxed relative z-10 text-sm">
                <p>We’re not actively hiring for specific roles at the moment, but we’re always interested in connecting with talented individuals.</p>
                <p>If you’d like to be considered for future opportunities, please upload your resume or CV along with a brief introduction. We’ll keep your information on file, and if a role opens up that matches your experience, we’ll reach out.</p>
                <p className="text-xs text-slate-500 italic">Due to the volume of applications, only candidates selected for further consideration will be contacted.</p>
              </div>
            </section>

            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-8">Desired Areas of Expertise</h3>
              <div className="space-y-4">
                {expertiseAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-red-600 transition-colors"></div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{area}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32"></div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tight relative z-10">Submit Your Resume</h3>
              
              <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition font-bold" 
                      placeholder="e.g. Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition font-bold" 
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Primary Expertise</label>
                  <div className="relative">
                    <select 
                      value={formData.expertise}
                      onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition font-bold appearance-none cursor-pointer"
                    >
                      {expertiseAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Brief Introduction</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium resize-none" 
                    placeholder="Tell us about your background and why you're interested in joining us..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Upload Resume / CV (PDF Preferred)</label>
                  <div className="relative group">
                    <input 
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="px-8 py-12 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 group-hover:bg-slate-50 group-hover:border-red-200 transition-all text-center">
                      <svg className="w-10 h-10 text-slate-300 mx-auto mb-4 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm font-black text-slate-400 group-hover:text-slate-600 uppercase tracking-widest">
                        {selectedFiles ? selectedFiles[0].name : "Click to select file or drag here"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">Accepted formats: PDF, DOC, DOCX • Max 10MB</p>
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-700 transition shadow-2xl shadow-red-600/20 text-lg active:scale-[0.98]"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
