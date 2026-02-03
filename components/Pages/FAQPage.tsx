
import React, { useState } from 'react';
import { FAQItem } from '../../types';

const FAQAccordion: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({ item, isOpen, onToggle }) => (
  <div className="border-b border-slate-100 last:border-0">
    <button 
      onClick={onToggle}
      className="w-full py-6 flex items-center justify-between text-left hover:text-red-600 transition group"
    >
      <span className="text-lg font-bold text-slate-900 group-hover:text-red-600">{item.question}</span>
      <span className={`ml-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        <svg className="w-6 h-6 text-slate-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
      <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
        {item.answer}
      </p>
    </div>
  </div>
);

interface FAQPageProps {
  faqs: FAQItem[];
  onNavigateContact?: () => void;
  onNavigateEducation?: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ faqs, onNavigateContact, onNavigateEducation }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['General', 'Process', 'Legal', 'Investing'] as const;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl -ml-48 -mb-48"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about Canadian tax sale properties, bidding processes, and investment strategies.
          </p>
          
          <div className="mt-10 max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Search questions (e.g., 'redemption', 'Ontario')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
            <svg className="absolute right-5 top-4 w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        {categories.map(category => {
          const categoryFaqs = filteredFaqs.filter(f => f.category === category);
          if (categoryFaqs.length === 0) return null;

          return (
            <div key={category} className="mb-16">
              <h2 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                {category}
                <div className="flex-grow h-px bg-slate-200"></div>
              </h2>
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 px-8 divide-y divide-slate-100">
                {categoryFaqs.map(faq => (
                  <FAQAccordion 
                    key={faq.id}
                    item={faq}
                    isOpen={openId === faq.id}
                    onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No questions found matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-red-600 font-bold mt-2 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        <div className="mt-20 bg-white rounded-[2.5rem] p-10 md:p-16 shadow-xl border border-slate-100 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16"></div>
           <h3 className="text-3xl font-black text-slate-900 mb-6">Still Have Questions?</h3>
           <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto font-medium">
             Our team of real estate investment specialists is ready to help you navigate the complexities of Canadian tax sales.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
                onClick={onNavigateContact}
                className="px-10 py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-600/20"
             >
               Contact Support
             </button>
             <button 
                onClick={onNavigateEducation}
                className="px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black transition"
             >
               Education Hub
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
