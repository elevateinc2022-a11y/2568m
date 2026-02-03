
import React from 'react';
import { AboutContent } from '../../types';

interface AboutPageProps {
  content: AboutContent;
}

export const AboutPage: React.FC<AboutPageProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-red-600/10 border border-red-600/20 backdrop-blur-sm">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
              <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em]">Our Mission</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight uppercase leading-none">
              About <span className="text-red-600">Us</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium leading-relaxed whitespace-pre-line">
              {content.introduction}
            </p>
          </div>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-20">
          
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">What We Do</h2>
            </div>
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <p className="text-slate-600 text-lg font-medium leading-relaxed whitespace-pre-line">
                {content.whatWeDo}
              </p>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Why We Exist</h2>
            </div>
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <p className="text-slate-600 text-lg font-medium leading-relaxed whitespace-pre-line">
                {content.whyWeExist}
              </p>
            </div>
          </section>

          <section className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Our Approach</h2>
            </div>
            <div className="bg-white p-10 md:p-16 rounded-[3rem] border-2 border-slate-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32"></div>
              <p className="text-slate-700 text-xl font-bold leading-relaxed whitespace-pre-line relative z-10">
                {content.ourApproach}
              </p>
            </div>
          </section>

          <section className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Our Vision</h2>
            </div>
            <div className="bg-slate-900 p-10 md:p-16 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl -mr-48 -mb-48"></div>
              <p className="text-slate-300 text-xl font-medium leading-relaxed whitespace-pre-line italic relative z-10">
                {content.vision}
              </p>
            </div>
          </section>

        </div>

        {/* Closing Notice */}
        <div className="mt-24 pt-16 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em] max-w-2xl mx-auto">
            Independence & Verification • Independent Information Resource
          </p>
        </div>
      </div>
    </div>
  );
};
