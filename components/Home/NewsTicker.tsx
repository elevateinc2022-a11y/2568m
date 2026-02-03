
import React, { useState, useEffect, useRef } from 'react';
import { NewsItem } from '../../types';

interface NewsTickerProps {
  items: NewsItem[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (!isPaused && items.length > 0) {
      timeoutRef.current = window.setTimeout(nextSlide, 5000);
    }
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused, items]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const getTypeStyle = (type: NewsItem['type']) => {
    switch (type) {
      case 'alert': return 'bg-red-600 text-white';
      case 'news': return 'bg-blue-600 text-white';
      case 'update': return 'bg-emerald-600 text-white';
      default: return 'bg-slate-700 text-white';
    }
  };

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center p-1.5 h-16">
        {/* Navigation - Left */}
        <button 
          onClick={prevSlide}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Content Area */}
        <div className="flex-grow flex items-center gap-4 px-4 overflow-hidden">
          <div className={`flex-shrink-0 px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest ${getTypeStyle(currentItem.type)}`}>
            {currentItem.type}
          </div>
          
          <div className="flex-grow min-w-0">
            {currentItem.link ? (
              <a 
                href={currentItem.link} 
                className="text-white font-bold text-sm truncate block hover:text-red-500 transition-colors"
                title={currentItem.text}
              >
                {currentItem.text}
              </a>
            ) : (
              <span className="text-white font-bold text-sm truncate block" title={currentItem.text}>
                {currentItem.text}
              </span>
            )}
          </div>
        </div>

        {/* Status / Controls */}
        <div className="flex items-center gap-4 flex-shrink-0 px-4">
           <div className="flex gap-1.5">
             {items.map((_, idx) => (
               <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-red-600' : 'w-1 bg-white/20'}`}
               />
             ))}
           </div>
           
           <button 
            onClick={() => setIsPaused(!isPaused)}
            className="text-white/40 hover:text-white transition-colors"
           >
            {isPaused ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            )}
           </button>
        </div>

        {/* Navigation - Right */}
        <button 
          onClick={nextSlide}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
