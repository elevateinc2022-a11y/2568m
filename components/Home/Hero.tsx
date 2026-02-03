
import React from 'react';
import { SiteConfig, Property } from '../../types';
import { NewsTicker } from './NewsTicker';

interface HeroProps {
  config: SiteConfig;
  properties: Property[];
  onViewDetails: (id: string) => void;
  onViewAll: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, properties, onViewDetails, onViewAll }) => {
  return (
    <div className="relative bg-slate-900 min-h-[750px] py-16 flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <img 
          src={config.heroImageUrl} 
          alt="Real Estate"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            {/* High-Impact Stats Badges */}
            <div className="mb-10 flex flex-wrap items-start gap-10">
              <div className="flex items-start gap-3">
                <div className="mt-1.5">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse block shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                </div>
                <div>
                  <span className="block text-white font-black text-sm uppercase tracking-widest">{config.statsBadge1Title}</span>
                  <span className="block text-slate-400 text-[10px] font-bold uppercase mt-1">{config.statsBadge1Subtitle}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full block shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                </div>
                <div>
                  <span className="block text-white font-black text-sm uppercase tracking-widest">{config.statsBadge2Title}</span>
                  <span className="block text-slate-400 text-[10px] font-bold uppercase mt-1">{config.statsBadge2Subtitle}</span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] mb-8 tracking-tight">
              {config.heroTitle}
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
              {config.heroSubtitle}
            </p>
            
            <button 
              onClick={onViewAll}
              className="group relative inline-flex items-center gap-4 bg-red-600 hover:bg-red-700 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-red-600/40 hover:-translate-y-1 active:scale-95"
            >
              Explore Listings
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Replacement: Interactive Recent Listings Deck */}
          <div className="hidden md:block w-full">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Market Feed</span>
              <div className="h-px flex-grow bg-white/10"></div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Live Updates</span>
            </div>
            
            <div className="space-y-4">
              {properties.slice(0, 3).map((prop) => (
                <div 
                  key={prop.id}
                  onClick={() => onViewDetails(prop.id)}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[2.5rem] hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer flex items-center gap-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
                  
                  <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl">
                    <img 
                      src={prop.images[0]} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={prop.address} 
                    />
                  </div>
                  
                  <div className="flex-grow min-w-0 pr-4">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{prop.municipality}</span>
                      <div className="bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-black text-emerald-400 border border-emerald-500/20">
                        ${prop.price.toLocaleString()}
                      </div>
                    </div>
                    <h4 className="text-white font-extrabold text-lg truncate group-hover:text-red-500 transition-colors mb-2 tracking-tight">{prop.address}</h4>
                    <div className="flex items-center gap-4">
                       <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
                        <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {prop.auctionDate}
                       </span>
                       <span className="text-[9px] font-bold text-slate-600 uppercase border-l border-white/10 pl-4">
                        {prop.saleType}
                       </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News Ticker Area - Specifically requested below main content but within Hero */}
        <div className="mt-4">
          <NewsTicker items={config.newsItems} />
        </div>
      </div>
    </div>
  );
};
