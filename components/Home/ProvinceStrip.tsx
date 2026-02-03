import React from 'react';
import { Property, Jurisdiction } from '../../types';

interface ProvinceStripProps {
  properties: Property[];
  jurisdictions: Jurisdiction[];
  onSelectProvince: (provinceCode: string) => void;
}

export const ProvinceStrip: React.FC<ProvinceStripProps> = ({ properties, jurisdictions, onSelectProvince }) => {
  const getActiveCount = (code: string) => {
    return properties.filter(p => p.state === code && p.status === 'Active').length;
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-max py-4 gap-4 md:gap-0">
          {jurisdictions.map((region) => {
            const count = getActiveCount(region.abbreviation);
            return (
              <button
                key={region.abbreviation}
                onClick={() => onSelectProvince(region.abbreviation)}
                className="flex flex-col items-center group px-4 transition-all duration-300 hover:-translate-y-1"
                title={`View ${region.name} Listings`}
              >
                <div className="relative mb-2">
                  <div className="w-12 h-8 rounded-md overflow-hidden shadow-sm border border-slate-200 group-hover:border-red-500 group-hover:shadow-md transition-all">
                    <img 
                      src={region.flagUrl} 
                      alt={region.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter group-hover:text-red-600 transition-colors">
                  {region.abbreviation}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};