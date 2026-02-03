
import React, { useState, useMemo } from 'react';
import { EducationArticle } from '../../types';

interface EducationPageProps {
  articles: EducationArticle[];
}

export const EducationPage: React.FC<EducationPageProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  const handleReadGuide = (article: EducationArticle) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedArticle) {
    return (
      <div className="bg-[#fdfbf7] min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={handleBackToList}
            className="mb-6 flex items-center gap-2 text-slate-900 font-bold hover:text-red-600 transition group text-sm"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          <div className="bg-white border-2 border-slate-900 p-6 md:p-10 shadow-[8px_8px_0px_rgba(15,23,42,1)]">
            <div className="mb-6">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] block mb-2">
                {selectedArticle.category} • {selectedArticle.date}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight border-b-4 border-slate-900 pb-4 mb-6">
                {selectedArticle.isQA ? `Q: ${selectedArticle.title}` : selectedArticle.title}
              </h1>
            </div>

            {selectedArticle.videoUrl && (
              <div className="aspect-video w-full mb-8 border-2 border-slate-900 bg-black overflow-hidden shadow-lg">
                <iframe 
                  className="w-full h-full"
                  src={selectedArticle.videoUrl.replace('watch?v=', 'embed/')} 
                  title="Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {!selectedArticle.videoUrl && selectedArticle.image && (
              <div className="aspect-video w-full mb-8 border-2 border-slate-900 overflow-hidden">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-slate max-w-none">
              <div className="text-lg text-slate-800 font-serif leading-relaxed italic border-l-4 border-red-600 pl-4 mb-6">
                {selectedArticle.excerpt}
              </div>
              <div className="text-base text-slate-900 font-serif leading-relaxed whitespace-pre-line">
                {selectedArticle.isQA && <span className="block font-black text-xl mb-2 text-slate-900">A:</span>}
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7] min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-serif font-black text-slate-900 mb-3 tracking-tight">Education Hub</h1>
          <div className="w-16 h-1.5 bg-red-600 mx-auto mb-4"></div>
          <p className="text-slate-800 text-sm font-serif leading-relaxed italic">
            Key resources to help you master the Canadian tax sale market.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-10 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <input 
              type="text" 
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-900 text-sm font-serif outline-none focus:ring-4 focus:ring-red-600/20 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex bg-white border-2 border-slate-900 p-1 shadow-[2px_2px_0px_rgba(15,23,42,1)] flex-shrink-0">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2 transition ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-900 hover:bg-slate-50'}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2 transition border-l-2 border-slate-900 ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-900 hover:bg-slate-50'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-400 font-serif italic text-sm">No guides found.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <article key={article.id} className="group bg-white border border-slate-900 overflow-hidden transition-all duration-300 shadow-[4px_4px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_rgba(220,38,38,1)] flex flex-col">
                <div className="h-32 border-b border-slate-900 overflow-hidden relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                  {(article.videoUrl || article.pdfUrl) && (
                    <div className="absolute top-2 right-2 flex gap-1">
                       {article.videoUrl && <span className="bg-red-600 text-white px-1.5 py-0.5 text-[7px] font-black uppercase rounded shadow">Video</span>}
                       {article.pdfUrl && <span className="bg-blue-600 text-white px-1.5 py-0.5 text-[7px] font-black uppercase rounded shadow">PDF</span>}
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-lg font-serif font-black text-slate-900 mb-2 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                    {article.isQA ? `Q: ${article.title}` : article.title}
                  </h2>
                  <p className="text-slate-700 font-serif text-xs mb-4 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                  <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{article.category}</span>
                    <button onClick={() => handleReadGuide(article)} className="flex items-center gap-1 text-slate-900 font-black text-[10px] uppercase tracking-wider hover:text-red-600 transition group-hover:underline decoration-1 underline-offset-2">
                      View
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredArticles.map(article => (
              <article key={article.id} className="group bg-white border border-slate-900 flex flex-col md:flex-row overflow-hidden transition-all duration-300 shadow-[4px_4px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_rgba(220,38,38,1)] h-auto md:h-40">
                <div className="w-full md:w-40 h-24 md:h-full border-b md:border-b-0 md:border-r border-slate-900 flex-shrink-0 relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4 flex flex-col flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg md:text-xl font-serif font-black text-slate-900 group-hover:text-red-600 transition-colors leading-tight truncate mr-4">
                      {article.isQA ? `Q: ${article.title}` : article.title}
                    </h2>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 flex-shrink-0">{article.category}</span>
                  </div>
                  <p className="text-slate-700 font-serif text-sm mb-2 leading-relaxed italic line-clamp-1">{article.excerpt}</p>
                  <div className="mt-auto flex justify-end">
                    <button onClick={() => handleReadGuide(article)} className="flex items-center gap-1.5 text-slate-900 font-black text-[10px] uppercase tracking-wider hover:text-red-600 transition group-hover:underline decoration-1 underline-offset-2">
                      Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
