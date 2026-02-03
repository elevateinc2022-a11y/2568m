
import React from 'react';
import { Property } from '../../types';

interface FeaturedListingsProps {
  properties: Property[];
  onViewDetails: (id: string) => void;
  onViewAll: () => void;
}

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({ properties, onViewDetails, onViewAll }) => {
  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Recent Tax Sales</h2>
            <p className="text-xs text-slate-600">Investment opportunities closing soon.</p>
          </div>
          <button 
            onClick={onViewAll}
            className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1"
          >
            View All →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {properties.map((prop) => {
            const isActive = prop.status === 'Active';
            const fullAddress = `${prop.address}, ${prop.city}, ${prop.state}`;
            return (
              <div 
                key={prop.id} 
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 cursor-pointer"
                onClick={() => onViewDetails(prop.id)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={prop.images[0]} 
                    alt={prop.address}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-white/90 text-blue-600'} backdrop-blur-sm text-[9px] font-black rounded-full uppercase tracking-wider shadow`}>
                      {isActive && (
                        <span className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse"></span>
                      )}
                      {prop.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded shadow-lg">
                      ${prop.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-1 truncate">{fullAddress}</h3>
                  <p className="text-[10px] text-slate-500 mb-3">{prop.municipality}</p>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="text-[9px] text-slate-400">
                      Sale Date
                      <div className="text-slate-900 font-bold">{prop.auctionDate}</div>
                    </div>
                    <div className="text-[9px] text-right text-slate-400">
                      Min Bid
                      <div className="text-red-600 font-bold">${prop.price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
