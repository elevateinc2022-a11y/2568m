
import React from 'react';

interface DisclaimerPageProps {
  content: string;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ content }) => {
  return (
    <div className="bg-white min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto border border-slate-200 p-8 shadow-sm">
        <header className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-lg font-bold text-black uppercase">Legal Disclaimer</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-tight">Notice of Non-Liability</p>
        </header>

        <div className="text-xs text-slate-800 leading-normal whitespace-pre-line font-sans border-l-2 border-slate-200 pl-4">
          {content || "Disclaimer content loading..."}
        </div>

        <footer className="mt-10 pt-4 border-t border-slate-100 text-[9px] text-slate-400">
          Information is provided "As-Is". Maple Leaf Tax Sales Canada accepts no liability for financial loss.
        </footer>
      </div>
    </div>
  );
};
