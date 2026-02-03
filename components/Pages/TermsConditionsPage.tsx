
import React from 'react';

interface TermsConditionsPageProps {
  content: string;
}

export const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({ content }) => {
  return (
    <div className="bg-white min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto border border-slate-200 p-8 shadow-sm">
        <header className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-lg font-bold text-black uppercase">Terms & Conditions</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-tight">Legal Usage Agreement - v1.0.4</p>
        </header>

        <div className="text-xs text-slate-800 leading-normal whitespace-pre-line font-sans">
          {content || "Terms and conditions loading..."}
        </div>

        <footer className="mt-10 pt-4 border-t border-slate-100 text-[9px] text-slate-400">
          Continuing use of the site implies acceptance of these terms in their entirety.
        </footer>
      </div>
    </div>
  );
};
