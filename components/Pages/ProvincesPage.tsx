
import React, { useMemo } from 'react';
import { Property, Jurisdiction } from '../../types';

interface ProvincesPageProps {
  jurisdictions: Jurisdiction[];
  properties: Property[];
  onNavigateLocation: (province?: string, municipality?: string) => void;
}

export const ProvincesPage: React.FC<ProvincesPageProps> = ({ jurisdictions, properties, onNavigateLocation }) => {
  const provinceDirectory = useMemo(() => {
    const sortedJuris = [...jurisdictions].sort((a, b) => a.name.localeCompare(b.name));

    return sortedJuris.map(juris => {
      let muncsList = juris.municipalities || [];
      if (muncsList.length === 0) {
        muncsList = Array.from(new Set<string>(
          properties
            .filter(p => p.state === juris.abbreviation)
            .map(p => p.municipality)
        ));
      }
      return {
        ...juris,
        muncsToDisplay: muncsList.sort((a, b) => a.localeCompare(b))
      };
    });
  }, [jurisdictions, properties]);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-slate-900 py-12 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight uppercase">
              Provinces & <span className="text-red-600">Territories</span>
            </h1>
            <p className="text-base text-slate-400 font-medium">
              Regional municipal inventory directory.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {provinceDirectory.map((region) => (
            <div key={region.id} className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                <div className="w-12 h-8 shadow rounded overflow-hidden border border-slate-200 flex-shrink-0">
                  <img src={region.flagUrl} alt={region.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight">{region.name}</h2>
                  <button 
                    onClick={() => onNavigateLocation(region.abbreviation)}
                    className="text-[8px] font-black text-red-600 uppercase tracking-widest hover:text-red-700 transition"
                  >
                    Listings →
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex-grow">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Municipalities ({region.muncsToDisplay.length})</h3>
                {region.muncsToDisplay.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {region.muncsToDisplay.map(munc => (
                      <button
                        key={munc}
                        onClick={() => onNavigateLocation(region.abbreviation, munc)}
                        className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-lg text-[10px] font-bold transition-all border border-slate-200/50"
                      >
                        {munc}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-slate-400 italic text-xs">No inventory tracked.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
