
import React from 'react';
import { SiteConfig, Jurisdiction, Property } from '../../types';

interface FooterProps {
  config: SiteConfig;
  jurisdictions: Jurisdiction[];
  properties: Property[];
  onNavigateAbout?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
  onNavigateCookie?: () => void;
  onNavigateDisclaimer?: () => void;
  onNavigateContact?: () => void;
  onNavigateCareers?: () => void;
  onNavigateFAQ?: () => void;
  onNavigateEducation?: () => void;
  onNavigateActiveListings?: () => void;
  onNavigateSoldListings?: () => void;
  onNavigateCancelledListings?: () => void;
  onNavigateNotAvailableListings?: () => void;
  onNavigateProvinces?: () => void;
  onNavigateLocation: (province?: string, municipality?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  config,
  onNavigateAbout, 
  onNavigatePrivacy, 
  onNavigateTerms, 
  onNavigateCookie, 
  onNavigateDisclaimer, 
  onNavigateContact, 
  onNavigateCareers,
  onNavigateFAQ,
  onNavigateEducation,
  onNavigateProvinces
}) => {
  const copyrightText = config.footerCopyright || "© 2026 Maple Leaf Tax Sales Canada. All rights reserved.";

  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Branding */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={config.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              <span className="text-xl font-bold tracking-tight text-white">
                {config.brandName} <span className="text-red-600">{config.brandAccent}</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              Canada's premier gateway to high-equity municipal tax sale opportunities.
            </p>
          </div>
          
          {/* Column 2: MLTSC - Formerly Company */}
          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-6">MLTSC</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <button 
                  onClick={onNavigateAbout} 
                  className="hover:text-red-400 transition text-left uppercase tracking-tight text-xs"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateCareers} 
                  className="hover:text-red-400 transition text-left uppercase tracking-tight text-xs"
                >
                  Careers
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateContact} 
                  className="hover:text-red-400 transition text-left uppercase tracking-tight text-xs"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Resources */}
          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-6">Resources</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={onNavigateEducation} className="hover:text-red-400 transition text-left uppercase tracking-tight text-xs">Education Hub</button></li>
              <li><button onClick={onNavigateFAQ} className="hover:text-red-400 transition text-left uppercase tracking-tight text-xs">FAQs</button></li>
              <li>
                <button 
                  onClick={onNavigateProvinces} 
                  className="hover:text-red-400 transition text-left uppercase tracking-tight text-xs"
                >
                  Provinces and Territories
                </button>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Support Info */}
          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-6">Support Info</h4>
            <div className="space-y-2 text-xs">
              <p><span className="font-bold text-white">Email:</span> {config.supportEmail}</p>
              <p><span className="font-bold text-white">Hours:</span> {config.officeHours}</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
          <p className="text-slate-500">{copyrightText}</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <button onClick={onNavigatePrivacy} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={onNavigateTerms} className="hover:text-white transition">Terms & Conditions</button>
            <button onClick={onNavigateCookie} className="hover:text-white transition">Cookie Policy</button>
            <button onClick={onNavigateDisclaimer} className="hover:text-white transition">Disclaimer</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
