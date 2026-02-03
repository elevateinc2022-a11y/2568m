
import React from 'react';
import { Property, Jurisdiction } from '../../types';

interface ProvinceGridProps {
  properties: Property[];
  jurisdictions: Jurisdiction[];
  onSelectProvince: (provinceCode: string) => void;
}

export const ProvinceGrid: React.FC<ProvinceGridProps> = ({ properties, jurisdictions, onSelectProvince }) => {
  const getActiveCount = (code: string) => {
    return properties.filter(p => p.state === code && p.status === 'Active').length;
  };

  return (
    <section className="py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 rounded-full border border-red-100">
            Regional Hub
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
            Explore by <span className="text-red-600">Region</span>
          </h2>
          <p className="text-slate-500 leading-relaxed text-sm font-medium">
            Find tax sale properties across Canada with region-specific listings.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {jurisdictions.map((region) => {
            const count = getActiveCount(region.abbreviation);
            return (
              <button
                key={region.abbreviation}
                onClick={() => onSelectProvince(region.abbreviation)}
                className="group relative flex flex-col items-start p-3 bg-white border border-slate-200 rounded-2xl hover:shadow-lg hover:border-red-500/30 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-10 h-6 flex-shrink-0 shadow rounded overflow-hidden border border-slate-100 bg-slate-50">
                    <img 
                      src={region.flagUrl} 
                      alt={region.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${count > 0 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xs font-black text-slate-900 group-hover:text-red-600 transition-colors mb-0.5">
                    {region.name}
                  </h3>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {count} Active
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
