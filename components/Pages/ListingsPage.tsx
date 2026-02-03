
import React, { useState, useMemo, useEffect } from 'react';
import { Property, User, FilterOptions, PropertyStatus, PropertyCategory, PropertyFeature, SaleType, Jurisdiction } from '../../types';

interface ListingsPageProps {
  properties: Property[];
  jurisdictions: Jurisdiction[];
  user: User | null;
  onViewDetails: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  initialProvinceFilter?: string[];
  initialMunicipalityFilter?: string[];
  initialStatusFilter?: PropertyStatus[];
  isSubscribed?: boolean;
  pageTitle?: string;
}

const ITEMS_PER_PAGE = 99;

const STATUS_COLORS: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  'Sold': 'bg-yellow-400 text-slate-900',
  'Cancelled': 'bg-red-600 text-white',
  'Not Available': 'bg-slate-400 text-white',
  'Redeemable: Yes': 'bg-blue-600 text-white',
  'Redeemable: No': 'bg-slate-700 text-white'
};

const CollapsibleSection: React.FC<{ 
  title: string, 
  isOpen: boolean, 
  onToggle: () => void, 
  children: React.ReactNode 
}> = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-slate-100 last:border-0 pb-2 mb-2">
    <button 
      onClick={onToggle}
      className="w-full flex justify-between items-center py-1.5 group"
    >
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-red-600 transition-colors">
        {title}
      </span>
      <svg 
        className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
      {children}
    </div>
  </div>
);

const FilterRow: React.FC<{ label: string, count?: number, checked: boolean, onChange: () => void, isLocked?: boolean, isDisabled?: boolean }> = ({ label, count, checked, onChange, isLocked, isDisabled }) => (
  <label className={`flex items-center gap-2 ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} group py-0.5`}>
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        checked={checked}
        disabled={isDisabled}
        onChange={onChange}
        className={`peer h-3 w-3 appearance-none rounded border border-slate-300 transition-all ${isDisabled ? 'bg-slate-100 border-slate-200' : 'checked:border-red-600 checked:bg-red-600'}`}
      />
      <svg className="absolute w-2 h-2 text-white pointer-events-none hidden peer-checked:block left-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className={`text-[11px] ${isDisabled ? 'text-slate-400' : 'text-slate-600 group-hover:text-red-600'} transition font-medium truncate flex-1 flex items-center gap-1`}>
      {label}
      {isLocked && <svg className="w-2.5 h-2.5 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 7a2 2 0 110 4 2 2 0 010-4z"/></svg>}
    </span>
    {count !== undefined && (
      <span className="bg-slate-50 text-slate-400 text-[8px] font-bold px-1 py-0.5 rounded border border-slate-100">
        {count}
      </span>
    )}
  </label>
);

export const ListingsPage: React.FC<ListingsPageProps> = ({ 
  properties, 
  jurisdictions, 
  user, 
  onViewDetails, 
  onToggleFavorite, 
  initialProvinceFilter = [],
  initialMunicipalityFilter = [],
  initialStatusFilter = [],
  isSubscribed = false,
  pageTitle = "Tax Sale Properties"
}) => {
  const [keywordSearch, setKeywordSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isSoldPage = pageTitle === "Sold Tax Sale Properties";
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    status: true,
    province: true,
    municipality: true,
    saleType: true,
    propertyType: true,
    features: true
  });

  const [filters, setFilters] = useState<FilterOptions>({
    states: initialProvinceFilter,
    municipalities: initialMunicipalityFilter,
    minPrice: 0,
    maxPrice: 5000000,
    statuses: initialStatusFilter,
    saleTypes: [],
    propertyTypes: [],
    features: [],
    postalCode: '',
    radius: 'All',
    sortBy: 'newest',
    waterFilter: []
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      states: initialProvinceFilter,
      municipalities: initialMunicipalityFilter,
      statuses: initialStatusFilter
    }));
    setCurrentPage(1);
  }, [initialProvinceFilter, initialMunicipalityFilter, initialStatusFilter]);

  const toggleArrayFilter = (key: keyof FilterOptions, value: any) => {
    // Prevent unchecking 'Sold' if we are on the Sold page
    if (isSoldPage && key === 'statuses' && value === 'Sold') return;
    
    setFilters(prev => {
      const current = (prev[key] as any[]) || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
    setCurrentPage(1);
  };

  const getStatusCount = (status: PropertyStatus) => {
    return properties.filter(p => p.status === status).length;
  };

  const availableMunicipalities = useMemo(() => {
    if (filters.states.length === 0) return [];
    const selectedStates = jurisdictions.filter(j => filters.states.includes(j.abbreviation));
    const muncs = selectedStates.flatMap(j => j.municipalities);
    return Array.from(new Set(muncs)).sort();
  }, [filters.states, jurisdictions]);

  const filteredProperties = useMemo(() => {
    return properties
      .filter(p => {
        if (keywordSearch) {
          const lowerSearch = keywordSearch.toLowerCase();
          const matchesKeyword = 
            p.address.toLowerCase().includes(lowerSearch) ||
            p.city.toLowerCase().includes(lowerSearch) ||
            p.municipality.toLowerCase().includes(lowerSearch);
          if (!matchesKeyword) return false;
        }
        if (filters.states.length > 0 && !filters.states.includes(p.state)) return false;
        if (filters.municipalities.length > 0 && !filters.municipalities.includes(p.municipality)) return false;
        if (filters.statuses.length > 0 && !filters.statuses.includes(p.status)) return false;
        if (filters.saleTypes.length > 0 && !filters.saleTypes.includes(p.saleType)) return false;
        if (filters.propertyTypes.length > 0) {
          const typeToMatch = p.propertyType;
          if (!filters.propertyTypes.includes(typeToMatch)) return false;
        }
        if (filters.features.length > 0) {
          const hasAllFeatures = filters.features.every(f => p.features.includes(f));
          if (!hasAllFeatures) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.auctionDate).getTime() - new Date(a.auctionDate).getTime());
  }, [properties, filters, keywordSearch]);

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const statusOptions = isSoldPage 
    ? ['Active', 'Sold'] as PropertyStatus[]
    : ['Active', 'Sold', 'Cancelled', 'Not Available'] as PropertyStatus[];

  return (
    <div className="bg-slate-50 min-h-screen relative">
      {/* Visual content for both subscribers and guests - Only Active is blurred if not subscribed, but Sold is usually free archive */}
      <div className={`max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6`}>
        <div className="mb-8">
           <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{pageTitle}</h1>
           <div className="w-12 h-1 bg-red-600 mt-2"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-56 flex-shrink-0 bg-white p-4 rounded-3xl shadow-sm border border-slate-200 self-start">
            <h2 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h2>

            <div className="space-y-1">
              <CollapsibleSection title="Province" isOpen={openSections.province} onToggle={() => toggleSection('province')}>
                <div className="space-y-0.5">
                  {jurisdictions.map(region => (
                    <FilterRow 
                      key={region.abbreviation} 
                      label={region.name} 
                      count={properties.filter(p => p.state === region.abbreviation).length}
                      checked={filters.states.includes(region.abbreviation)}
                      onChange={() => toggleArrayFilter('states', region.abbreviation)}
                    />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Dynamic Municipality Section */}
              {filters.states.length > 0 && (
                <CollapsibleSection title="Municipality" isOpen={openSections.municipality} onToggle={() => toggleSection('municipality')}>
                  <div className="space-y-0.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {availableMunicipalities.map(munc => (
                      <FilterRow 
                        key={munc} 
                        label={munc} 
                        checked={filters.municipalities.includes(munc)}
                        onChange={() => toggleArrayFilter('municipalities', munc)}
                      />
                    ))}
                    {availableMunicipalities.length === 0 && (
                      <span className="text-[10px] text-slate-400 italic px-1">No municipalities found</span>
                    )}
                  </div>
                </CollapsibleSection>
              )}

              <CollapsibleSection title="Status" isOpen={openSections.status} onToggle={() => toggleSection('status')}>
                <div className="space-y-0.5">
                  {statusOptions.map(s => {
                    // Lock Logic for "Sold Tax Sale Properties" page specifically
                    const isAlwaysLocked = isSoldPage && s === 'Active';
                    const isSoldPermanent = isSoldPage && s === 'Sold';
                    
                    // General logic for main listings page
                    const isSubscriberLocked = !isSoldPage && s === 'Active' && !isSubscribed;
                    
                    const isLocked = isAlwaysLocked || isSubscriberLocked || isSoldPermanent;
                    const isDisabled = isAlwaysLocked || isSoldPermanent; // Disable interaction on Sold page statuses
                    
                    return (
                      <FilterRow 
                        key={s} 
                        label={s} 
                        isLocked={isLocked}
                        isDisabled={isDisabled}
                        count={getStatusCount(s as PropertyStatus)} 
                        checked={filters.statuses.includes(s as PropertyStatus)}
                        onChange={() => toggleArrayFilter('statuses', s)}
                      />
                    );
                  })}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Sale Type" isOpen={openSections.saleType} onToggle={() => toggleSection('saleType')}>
                <div className="space-y-0.5">
                  <FilterRow 
                    label="Public Auction" 
                    checked={filters.saleTypes.includes('Auction')}
                    onChange={() => toggleArrayFilter('saleTypes', 'Auction')}
                  />
                  <FilterRow 
                    label="Public Tender" 
                    checked={filters.saleTypes.includes('Tender')}
                    onChange={() => toggleArrayFilter('saleTypes', 'Tender')}
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Property Type" isOpen={openSections.propertyType} onToggle={() => toggleSection('propertyType')}>
                <div className="space-y-0.5">
                  <FilterRow label="Land" checked={filters.propertyTypes.includes('Land')} onChange={() => toggleArrayFilter('propertyTypes', 'Land')} />
                  <FilterRow label="Structures" checked={filters.propertyTypes.includes('Residential')} onChange={() => toggleArrayFilter('propertyTypes', 'Residential')} />
                  <FilterRow label="Commercial" checked={filters.propertyTypes.includes('Commercial')} onChange={() => toggleArrayFilter('propertyTypes', 'Commercial')} />
                  <FilterRow label="Industrial" checked={filters.propertyTypes.includes('Industrial')} onChange={() => toggleArrayFilter('propertyTypes', 'Industrial')} />
                </div>
              </CollapsibleSection>
            </div>
          </aside>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="w-full">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
                   <div className="relative">
                    <input
                      type="text"
                      placeholder="Search address or municipality..."
                      value={keywordSearch}
                      onChange={(e) => setKeywordSearch(e.target.value)}
                      className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:bg-white outline-none transition font-bold text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-lg">No properties found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedProperties.map((prop) => (
                  <PropertyGridCard key={prop.id} prop={prop} onViewDetails={onViewDetails} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyGridCard: React.FC<{ prop: Property, onViewDetails: (id: string) => void }> = ({ prop, onViewDetails }) => {
  const statusColorClass = STATUS_COLORS[prop.status] || 'bg-slate-900 text-white';
  const fullAddress = `${prop.address}, ${prop.city}, ${prop.state}`;
  
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group cursor-pointer h-full flex flex-col hover:shadow-md transition-all duration-300"
      onClick={() => onViewDetails(prop.id)}
    >
      <div className="relative h-32 overflow-hidden">
        <img src={prop.images[0]} alt={prop.address} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${statusColorClass} text-[7px] font-black uppercase rounded-full shadow`}>
            {prop.status}
          </span>
        </div>
      </div>
      <div className="p-3 flex-grow flex flex-col">
        <h3 className="text-xs font-bold text-slate-900 mb-0.5 truncate">{fullAddress}</h3>
        <p className="text-slate-500 text-[9px] font-medium mb-2">{prop.municipality}</p>
        <div className="mt-auto pt-2 border-t border-slate-50 flex justify-between items-center">
          <span className="text-sm font-black text-red-600">${prop.price.toLocaleString()}</span>
          <div className="flex flex-col items-end">
             <span className="text-[8px] font-bold text-slate-400 uppercase">{prop.auctionDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
