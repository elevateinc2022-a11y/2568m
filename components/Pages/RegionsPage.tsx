
import React from 'react';
import { ProvinceGrid } from '../Home/ProvinceGrid';
import { Property, Jurisdiction } from '../../types';

interface RegionsPageProps {
  properties: Property[];
  jurisdictions: Jurisdiction[];
  onSelectProvince: (provinceCode: string) => void;
}

export const RegionsPage: React.FC<RegionsPageProps> = ({ properties, jurisdictions, onSelectProvince }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl -ml-48 -mb-48"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Regional Investment Hub</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Navigate the Canadian tax sale market by province and territory. Access localized data, 
            regional trends, and up-to-the-minute property listings across the country.
          </p>
        </div>
      </div>

      {/* Grid Section - Reusing the high-quality ProvinceGrid component */}
      <div className="pb-20 -mt-10">
        <ProvinceGrid properties={properties} jurisdictions={jurisdictions} onSelectProvince={onSelectProvince} />
      </div>

      {/* Info Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Why Search Regionally?</h2>
        <p className="text-slate-600 text-lg font-medium leading-relaxed">
          Tax sale legislation varies significantly between provinces. Understanding regional regulations 
          like redemption periods and bidding formats is crucial for a successful acquisition strategy. 
          Select a province above to view its specific active inventory.
        </p>
      </section>
    </div>
  );
};
