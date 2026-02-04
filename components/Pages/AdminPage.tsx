
import React, { useState, useEffect, useMemo } from 'react';
import { Property, PropertyStatus, Jurisdiction, EducationArticle, FAQItem, SiteConfig, AboutContent, LegalContent, PropertyFeature, PropertyIdentifier, AssessmentIdentifier, IdentifierType, AssessmentType, NewsItem } from '../../types';
import { AdminTab } from '../../App';
import {
  fetchArticles, saveArticle, deleteArticle,
  fetchFAQs, saveFAQ, deleteFAQ,
  fetchJurisdictions, saveJurisdiction, deleteJurisdiction,
  fetchProperties, saveProperty, deleteProperty,
  fetchSiteConfig, saveSiteConfig,
  fetchLegalContent, saveLegalContent,
  fetchAboutContent, saveAboutContent
} from '../../utils/supabaseData';

interface AdminPageProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  jurisdictions: Jurisdiction[];
  setJurisdictions: React.Dispatch<React.SetStateAction<Jurisdiction[]>>;
  siteConfig: SiteConfig | null;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
  onNavigate?: (view: string, options?: any) => void;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const StatCard = ({ label, value, colorClass = "text-slate-900" }: { label: string, value: number, colorClass?: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-center">{label}</span>
    <span className={`text-3xl font-black ${colorClass}`}>{value}</span>
  </div>
);

const InventoryChart = ({ stats }: { stats: any }) => {
  const data = [
    { label: 'ACTIVE', value: stats.active, color: 'bg-emerald-500' },
    { label: 'SOLD', value: stats.sold, color: 'bg-amber-500' },
    { label: 'CANCELLED', value: stats.cancelled, color: 'bg-red-500' },
    { label: 'AUCTIONS', value: stats.auctions, color: 'bg-indigo-500' },
    { label: 'TENDERS', value: stats.tenders, color: 'bg-blue-500' },
  ];

  const maxValue = Math.max(...data.map(d => d.value), 5);

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm w-full h-full flex flex-col">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.1em]">INVENTORY DISTRIBUTION</h3>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">AUTO-SCALING ANALYTICS</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-slate-900 leading-none">{stats.total}</span>
          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">TOTAL RECORDS</span>
        </div>
      </div>
      
      <div className="flex-grow flex items-end justify-between gap-6 px-4">
        {data.map((item, idx) => {
          const heightPercent = (item.value / maxValue) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
              <div 
                className={`w-full max-w-[36px] ${item.color} rounded-lg transition-all duration-700 shadow-lg shadow-black/5 relative`}
                style={{ height: `${heightPercent}%`, minHeight: item.value > 0 ? '4px' : '0px' }}
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 rounded-t-lg"></div>
              </div>
              <span className="mt-4 text-[8px] font-black text-slate-400 uppercase tracking-tighter text-center leading-tight">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AdminToolbar: React.FC<{ activeTab: string; onNavigate: (view: string, options?: any) => void; onTabChange: (tab: AdminTab) => void }> = ({ activeTab, onNavigate, onTabChange }) => {
  return (
    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar items-center mb-10 w-full max-w-fit">
      <button onClick={() => { onNavigate?.('admin'); onTabChange('inventory'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'inventory' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Inventory</button>
      <button onClick={() => onNavigate?.('admin-subscriptions')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'admin-subscriptions' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-600 hover:bg-emerald-50'}`}>Subscribers</button>
      <button onClick={() => onNavigate?.('admin-packages')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'admin-packages' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-600 hover:bg-blue-50'}`}>Pkg Orders</button>
      <button onClick={() => onNavigate?.('admin-upload-packages')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'admin-upload-packages' ? 'bg-red-900 text-white shadow-lg' : 'text-red-900 hover:bg-red-50'}`}>Upload Pkgs</button>
      <button onClick={() => { onNavigate?.('admin'); onTabChange('jurisdictions'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'jurisdictions' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Provinces</button>
      <button onClick={() => { onNavigate?.('admin'); onTabChange('education'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'education' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Education</button>
      <button onClick={() => { onNavigate?.('admin'); onTabChange('faqs'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'faqs' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>FAQs</button>
      <button onClick={() => { onNavigate?.('admin'); onTabChange('settings'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'settings' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Site Editor</button>
      <button onClick={() => { onNavigate?.('admin'); onTabChange('legal'); }} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'legal' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Legal Pages</button>
    </div>
  );
};

export const AdminPage: React.FC<AdminPageProps> = ({ properties, setProperties, jurisdictions, setJurisdictions, siteConfig, setSiteConfig, onNavigate, activeTab, setActiveTab }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showJurisdictionModal, setShowJurisdictionModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  
  // Local transient states for editor modals
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editableConfig, setEditableConfig] = useState<SiteConfig | null>(null);
  const [editableLegal, setEditableLegal] = useState<LegalContent | null>(null);
  const [editableAbout, setEditableAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    const loadAdminData = async () => {
      if (activeTab === 'education') setArticles(await fetchArticles());
      if (activeTab === 'faqs') setFaqs(await fetchFAQs());
      if (activeTab === 'settings') {
        const config = await fetchSiteConfig();
        if (config) setEditableConfig(config);
      }
      if (activeTab === 'legal') {
        const legal = await fetchLegalContent();
        if (legal) setEditableLegal(legal);
      }
      if (activeTab === 'about') {
        const about = await fetchAboutContent();
        if (about) setEditableAbout(about);
      }
    };
    loadAdminData();
  }, [activeTab]);

  const stats = useMemo(() => {
    return {
      total: properties.length,
      active: properties.filter(p => p.status === 'Active').length,
      sold: properties.filter(p => p.status === 'Sold').length,
      cancelled: properties.filter(p => p.status === 'Cancelled').length,
      auctions: properties.filter(p => p.saleType === 'Auction').length,
      tenders: properties.filter(p => p.saleType === 'Tender').length,
    };
  }, [properties]);

  // Modals state
  const [editingArticle, setEditingArticle] = useState<EducationArticle | null>(null);
  const [newArticle, setNewArticle] = useState<Partial<EducationArticle>>({ title: '', category: 'Basics', excerpt: '', content: '', image: '', pdfUrl: '', date: new Date().toLocaleDateString() });
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [newFAQ, setNewFAQ] = useState<Partial<FAQItem>>({ question: '', answer: '', category: 'General' });
  const [editingJurisdiction, setEditingJurisdiction] = useState<Jurisdiction | null>(null);
  const [newJurisdiction, setNewJurisdiction] = useState<Partial<Jurisdiction>>({ name: '', abbreviation: '', type: 'province', flagUrl: '', municipalities: [] });
  const [newMunicipalityInput, setNewMunicipalityInput] = useState('');
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [newProp, setNewProp] = useState<Partial<Property>>({
    status: 'Active', saleType: 'Tender', propertyType: 'Residential', features: [], state: 'ON', images: [], identifiers: [], assessments: [], taxSales: []
  });

  const [isSoldChecked, setIsSoldChecked] = useState(false);
  const [isRedeemableChecked, setIsRedeemableChecked] = useState(false);

  useEffect(() => {
    if (editingProp) {
      setIsSoldChecked(!!editingProp.soldPrice);
      setIsRedeemableChecked(!!editingProp.redeemableInfo);
    } else {
      setIsSoldChecked(false);
      setIsRedeemableChecked(false);
    }
  }, [editingProp, showAddModal]);

  const handleOpenAddModal = () => {
    setEditingProp(null);
    setNewProp({ 
      id: `MLT-${Math.floor(Math.random() * 900000) + 100000}`, 
      status: 'Active', 
      saleType: 'Tender', 
      propertyType: 'Residential', 
      features: [], 
      state: 'ON', 
      images: [], 
      identifiers: [], 
      assessments: [], 
      taxSales: [],
      price: 0,
      marketValue: '0',
      latitude: 43.65,
      longitude: -79.38
    });
    setIsSoldChecked(false);
    setIsRedeemableChecked(false);
    setShowAddModal(true);
  };

  const handleSaveProperty = async () => {
    const propertyToSave = { 
      ...newProp, 
      soldPrice: isSoldChecked ? newProp.soldPrice : undefined,
      redeemableInfo: isRedeemableChecked ? newProp.redeemableInfo : undefined,
      createdAt: newProp.createdAt || new Date().toISOString(),
      coordinates: { lat: newProp.latitude || 0, lng: newProp.longitude || 0 }
    } as Property;
    
    const result = await saveProperty(propertyToSave);
    if (result) {
      setProperties(await fetchProperties());
      setShowAddModal(false);
    } else {
      alert('Failed to save property.');
    }
  };

  const toggleFeature = (feature: PropertyFeature) => {
    const current = newProp.features || [];
    const updated = current.includes(feature) 
      ? current.filter(f => f !== feature) 
      : [...current, feature];
    setNewProp({...newProp, features: updated});
  };

  const addIdentifier = (isAssessment: boolean) => {
    const state = newProp.state || 'ON';
    if (isAssessment) {
      const typeMap: Record<string, AssessmentType> = { 'ON': 'RollNumber', 'BC': 'Folio', 'AB': 'RollNumber', 'NS': 'AAN', 'MB': 'Folio', 'NB': 'AssessmentNumber', 'PE': 'AssessmentNumber', 'NL': 'AssessmentNumber', 'QC': 'RollNumber' };
      const newAssess: AssessmentIdentifier = {
        id: `as-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: newProp.id!,
        type: typeMap[state] || 'AssessmentNumber',
        value: ''
      };
      setNewProp({ ...newProp, assessments: [...(newProp.assessments || []), newAssess] });
    } else {
      const typeMap: Record<string, IdentifierType> = { 'ON': 'PIN', 'BC': 'PID', 'AB': 'LINC', 'NS': 'PID', 'MB': 'ParcelNumber', 'NB': 'PID', 'QC': 'Cadastre' };
      const newIdent: PropertyIdentifier = {
        id: `id-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: newProp.id!,
        type: typeMap[state] || 'PID',
        value: ''
      };
      setNewProp({ ...newProp, identifiers: [...(newProp.identifiers || []), newIdent] });
    }
  };

  const updateIdentifier = (id: string, value: string, isAssessment: boolean) => {
    if (isAssessment) {
      const updated = (newProp.assessments || []).map(a => a.id === id ? { ...a, value } : a);
      setNewProp({ ...newProp, assessments: updated });
    } else {
      const updated = (newProp.identifiers || []).map(i => i.id === id ? { ...i, value } : i);
      setNewProp({ ...newProp, identifiers: updated });
    }
  };

  const deleteIdentifier = (id: string, isAssessment: boolean) => {
    if (isAssessment) {
      const updated = (newProp.assessments || []).filter(a => a.id !== id);
      setNewProp({ ...newProp, assessments: updated });
    } else {
      const updated = (newProp.identifiers || []).filter(i => i.id !== id);
      setNewProp({ ...newProp, identifiers: updated });
    }
  };

  const handleAddMunicipality = () => {
    if (!newMunicipalityInput.trim()) return;
    const current = newJurisdiction.municipalities || [];
    if (current.includes(newMunicipalityInput.trim())) {
      setNewMunicipalityInput('');
      return;
    }
    setNewJurisdiction({
      ...newJurisdiction,
      municipalities: [...current, newMunicipalityInput.trim()]
    });
    setNewMunicipalityInput('');
  };

  const handleRemoveMunicipality = (munc: string) => {
    setNewJurisdiction({
      ...newJurisdiction,
      municipalities: (newJurisdiction.municipalities || []).filter(m => m !== munc)
    });
  };

  const handleSaveSiteSettings = async () => {
    if (!editableConfig) return;
    const result = await saveSiteConfig(editableConfig);
    if (result) {
      setSiteConfig(editableConfig); // Update App.tsx state
      alert('Site settings saved.');
    } else {
      alert('Failed to save site settings.');
    }
  };
  
  const handleSaveLegal = async () => {
    if (!editableLegal) return;
    const result = await saveLegalContent(editableLegal);
    if (result) {
      // setLegalContent(editableLegal); // Uncomment if App.tsx legalContent state needs update
      alert('Legal policies updated.');
    } else {
      alert('Failed to save legal content.');
    }
  };

  const handleSaveAbout = async () => {
    if (!editableAbout) return;
    const result = await saveAboutContent(editableAbout);
    if (result) {
      // setAboutContent(editableAbout); // Uncomment if App.tsx aboutContent state needs update
      alert('About content updated.');
    } else {
      alert('Failed to save about content.');
    }
  };

  const updateNewsItem = (idx: number, updates: Partial<NewsItem>) => {
    const items = [...editableConfig.newsItems];
    items[idx] = { ...items[idx], ...updates };
    setEditableConfig({ ...editableConfig, newsItems: items });
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-10 pb-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        <AdminToolbar activeTab={activeTab} onNavigate={onNavigate || (() => {})} onTabChange={setActiveTab} />

        {activeTab === 'inventory' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:w-[55%]">
                <StatCard label="TOTAL" value={stats.total} />
                <StatCard label="ACTIVE" value={stats.active} colorClass="text-emerald-500" />
                <StatCard label="SOLD" value={stats.sold} colorClass="text-amber-500" />
                <StatCard label="CANCELLED" value={stats.cancelled} colorClass="text-red-500" />
                <StatCard label="AUCTIONS" value={stats.auctions} colorClass="text-indigo-600" />
                <StatCard label="TENDERS" value={stats.tenders} colorClass="text-blue-500" />
              </div>
              <div className="lg:w-[45%]">
                <InventoryChart stats={stats} />
              </div>
            </div>

            <div className="flex justify-between items-center mt-12 mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PROPERTY RECORDS</h2>
              <button 
                onClick={handleOpenAddModal} 
                className="px-8 py-3 bg-[#dc2626] text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition active:scale-95"
              >
                + Add Property
              </button>
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">RECORD ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">LOCATION</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">DATABASE IDENTIFIERS</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SALE DATE</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">TYPE</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {properties.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-6">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                            {idx + 1}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-sm">{p.address}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{p.municipality}, {p.state}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1.5">
                            {(p.identifiers || []).slice(0, 1).map(id => (
                              <div key={id.id} className="flex items-center gap-1.5 bg-[#eff6ff] px-2 py-1 rounded border border-[#dbeafe] w-fit">
                                <span className="text-[9px] font-black text-red-600 uppercase">{id.type}:</span>
                                <span className="text-[10px] font-bold text-blue-600 font-mono tracking-tight">{id.value}</span>
                              </div>
                            ))}
                            {(p.assessments || []).slice(0, 1).map(as => (
                              <div key={as.id} className="flex items-center gap-1.5 bg-[#eff6ff] px-2 py-1 rounded border border-[#dbeafe] w-fit">
                                <span className="text-[9px] font-black text-blue-600 uppercase">{as.type}:</span>
                                <span className="text-[10px] font-bold text-blue-600 font-mono tracking-tight">{as.value}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-6 font-black text-slate-900 text-sm">{p.auctionDate}</td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                            p.status === 'Active' ? 'bg-[#f0fdf4] text-emerald-600 border-emerald-100' : 
                            p.status === 'Sold' ? 'bg-[#f0fdfa] text-emerald-500 border-emerald-100' :
                            'bg-[#fef2f2] text-red-400 border-red-100'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">{p.saleType}</td>
                        <td className="px-8 py-6 text-right space-x-4">
                          <button onClick={() => { setNewProp(p); setEditingProp(p); setShowAddModal(true); }} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">EDIT</button>
                          <button onClick={async () => { if(confirm('Are you sure?')){ await deleteProperty(p.id); setProperties(await fetchProperties()); }}} className="text-red-600 font-black text-[10px] uppercase tracking-widest hover:underline">DELETE</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jurisdictions' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PROVINCES & TERRITORIES</h2>
              <button 
                onClick={() => { setEditingJurisdiction(null); setNewJurisdiction({ name: '', abbreviation: '', type: 'province', flagUrl: '', municipalities: [] }); setShowJurisdictionModal(true); }}
                className="px-6 py-2.5 bg-[#dc2626] text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition flex items-center gap-2"
              >
                + Add Region
              </button>
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">REGION NAME</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">CODE</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">MUNICIPALITIES</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jurisdictions.map((region) => (
                      <tr key={region.id} className="hover:bg-slate-50/50 transition group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-6 rounded shadow-sm overflow-hidden border border-slate-100 bg-slate-50">
                              <img src={region.flagUrl} alt={region.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-black text-slate-900 text-sm">{region.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{region.abbreviation}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-bold text-slate-400 italic">{(region.municipalities || []).length} Tracked</span>
                        </td>
                        <td className="px-8 py-6 text-right space-x-4">
                          <button 
                            onClick={() => { setEditingJurisdiction(region); setNewJurisdiction(region); setShowJurisdictionModal(true); }}
                            className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                          >
                            EDIT
                          </button>
                          <button 
                            onClick={async () => { if(confirm('Delete this region?')){ await deleteJurisdiction(region.id); setJurisdictions(await fetchJurisdictions()); }}}
                            className="text-red-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">EDUCATION HUB ARTICLES</h2>
              <button 
                onClick={() => { setEditingArticle(null); setNewArticle({ title: '', category: 'Basics', excerpt: '', content: '', image: '', pdfUrl: '', date: new Date().toLocaleDateString() }); setShowEducationModal(true); }}
                className="px-6 py-2.5 bg-[#dc2626] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition flex items-center gap-2"
              >
                + New Article
              </button>
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">TITLE</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">CATEGORY</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-slate-50/50 transition group">
                        <td className="px-8 py-6">
                           <span className="font-black text-slate-900 text-sm">{article.title}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-[#eff6ff] text-[#3b82f6] text-[9px] font-black uppercase tracking-widest rounded-md border border-[#dbeafe]">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right space-x-5">
                          <button 
                            onClick={() => { setEditingArticle(article); setNewArticle(article); setShowEducationModal(true); }}
                            className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                          >
                            EDIT
                          </button>
                          <button 
                            onClick={async () => { if(confirm('Delete this article?')){ await deleteArticle(article.id); setArticles(await fetchArticles()); }}}
                            className="text-red-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                    {articles.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-medium italic">No articles found in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PLATFORM FAQS</h2>
              <button 
                onClick={() => { setEditingFAQ(null); setNewFAQ({ question: '', answer: '', category: 'General' }); setShowFAQModal(true); }}
                className="px-6 py-2.5 bg-[#dc2626] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition flex items-center gap-2"
              >
                + New FAQ
              </button>
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">QUESTION</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {faqs.map((faq) => (
                      <tr key={faq.id} className="hover:bg-slate-50/50 transition group">
                        <td className="px-8 py-6">
                           <span className="font-black text-slate-900 text-sm leading-tight block max-w-2xl">{faq.question}</span>
                        </td>
                        <td className="px-8 py-6 text-right space-x-5">
                          <button 
                            onClick={() => { setEditingFAQ(faq); setNewFAQ(faq); setShowFAQModal(true); }}
                            className="text-blue-800 font-black text-[10px] uppercase tracking-widest hover:underline"
                          >
                            EDIT
                          </button>
                          <button 
                            onClick={async () => { if(confirm('Delete this FAQ entry?')){ await deleteFAQ(faq.id); setFaqs(await fetchFAQs()); }}}
                            className="text-red-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                    {faqs.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-8 py-20 text-center text-slate-400 font-medium italic">No FAQ entries found in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            <div className="grid lg:grid-cols-2 gap-12">
               {/* Branding Column */}
               <div className="space-y-8">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Branding</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">BRAND NAME</label>
                    <input 
                      type="text" 
                      value={editableConfig.brandName} 
                      onChange={e => setEditableConfig({...editableConfig, brandName: e.target.value})} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white transition" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">ACCENT TEXT (CANADA)</label>
                    <input 
                      type="text" 
                      value={editableConfig.brandAccent} 
                      onChange={e => setEditableConfig({...editableConfig, brandAccent: e.target.value})} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white transition" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">LOGO URL / UPLOAD</label>
                    <div className="flex gap-4">
                      <textarea 
                        rows={3}
                        value={editableConfig.logoUrl} 
                        onChange={e => setEditableConfig({...editableConfig, logoUrl: e.target.value})} 
                        className="flex-grow px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-mono text-[10px] outline-none focus:bg-white transition resize-none no-scrollbar" 
                      />
                      <button className="px-8 py-4 bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-black transition-all self-start">UPLOAD</button>
                    </div>
                  </div>
               </div>

               {/* Hero Section Column */}
               <div className="space-y-8">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Hero Section</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">HERO TITLE</label>
                    <input 
                      type="text" 
                      value={editableConfig.heroTitle} 
                      onChange={e => setEditableConfig({...editableConfig, heroTitle: e.target.value})} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white transition" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">HERO IMAGE URL / UPLOAD</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={editableConfig.heroImageUrl} 
                        onChange={e => setEditableConfig({...editableConfig, heroImageUrl: e.target.value})} 
                        className="flex-grow px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white transition" 
                      />
                      <button className="px-8 py-4 bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-black transition-all">UPLOAD</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">HERO SUBTITLE</label>
                    <textarea 
                      rows={3}
                      value={editableConfig.heroSubtitle} 
                      onChange={e => setEditableConfig({...editableConfig, heroSubtitle: e.target.value})} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm outline-none focus:bg-white transition resize-none" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">BADGE 1 (GREEN)</label>
                      <input 
                        type="text" 
                        value={editableConfig.statsBadge1Title} 
                        onChange={e => setEditableConfig({...editableConfig, statsBadge1Title: e.target.value})} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" 
                      />
                      <input 
                        type="text" 
                        value={editableConfig.statsBadge1Subtitle} 
                        onChange={e => setEditableConfig({...editableConfig, statsBadge1Subtitle: e.target.value})} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-xs mt-2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">BADGE 2 (BLUE)</label>
                      <input 
                        type="text" 
                        value={editableConfig.statsBadge2Title} 
                        onChange={e => setEditableConfig({...editableConfig, statsBadge2Title: e.target.value})} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" 
                      />
                      <input 
                        type="text" 
                        value={editableConfig.statsBadge2Subtitle} 
                        onChange={e => setEditableConfig({...editableConfig, statsBadge2Subtitle: e.target.value})} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-xs mt-2" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">FOOTER COPYRIGHT</label>
                    <input 
                      type="text" 
                      value={editableConfig.footerCopyright} 
                      onChange={e => setEditableConfig({...editableConfig, footerCopyright: e.target.value})} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm" 
                    />
                  </div>
               </div>
            </div>

            <div className="h-px bg-slate-100 my-10"></div>

            <div className="space-y-8">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">HOME PAGE NEWS TICKER (MAX 6)</h3>
               <div className="grid md:grid-cols-2 gap-8">
                  {editableConfig.newsItems.slice(0, 6).map((item, idx) => (
                    <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ITEM #{idx + 1}</span>
                          <div className="relative">
                            <select 
                              value={item.type} 
                              onChange={e => updateNewsItem(idx, { type: e.target.value as any })}
                              className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest appearance-none pr-8 cursor-pointer"
                            >
                              <option value="update">UPDATE</option>
                              <option value="news">NEWS</option>
                              <option value="alert">ALERT</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <input 
                            type="text" 
                            value={item.text} 
                            onChange={e => updateNewsItem(idx, { text: e.target.value })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white transition" 
                          />
                          <input 
                            type="text" 
                            value={item.link} 
                            onChange={e => updateNewsItem(idx, { link: e.target.value })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-xs outline-none focus:bg-white transition text-slate-400" 
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            
            {/* Save Button Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a] border-t border-white/5 py-4 px-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
                <div className="max-w-[1440px] mx-auto flex justify-center">
                    <button 
                        onClick={handleSaveSiteSettings}
                        className="w-full max-w-lg py-5 bg-[#dc2626] text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-red-600/20 active:scale-95 transition-all text-xs"
                    >
                        SAVE SITE SETTINGS
                    </button>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">LEGAL POLICY EDITOR</h2>
              <div className="h-px flex-grow bg-slate-200"></div>
            </div>
            
            <div className="space-y-12">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PRIVACY POLICY</label>
                <textarea 
                  value={editableLegal.privacyPolicy}
                  onChange={e => setEditableLegal({...editableLegal, privacyPolicy: e.target.value})}
                  rows={12}
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-medium text-sm text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all resize-none shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">TERMS & CONDITIONS</label>
                <textarea 
                  value={editableLegal.termsConditions}
                  onChange={e => setEditableLegal({...editableLegal, termsConditions: e.target.value})}
                  rows={12}
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-medium text-sm text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all resize-none shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">COOKIE POLICY</label>
                <textarea 
                  value={editableLegal.cookiePolicy}
                  onChange={e => setEditableLegal({...editableLegal, cookiePolicy: e.target.value})}
                  rows={12}
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-medium text-sm text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all resize-none shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">LEGAL DISCLAIMER</label>
                <textarea 
                  value={editableLegal.disclaimer}
                  onChange={e => setEditableLegal({...editableLegal, disclaimer: e.target.value})}
                  rows={12}
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-medium text-sm text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all resize-none shadow-inner"
                />
              </div>
            </div>

            <div className="pt-10">
              <button 
                onClick={handleSaveLegal}
                className="w-full py-6 bg-[#dc2626] text-white font-black uppercase tracking-[0.3em] rounded-[1.5rem] shadow-xl shadow-red-600/20 active:scale-95 transition-all text-sm"
              >
                UPDATE LEGAL DOCUMENTATION
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE/EDIT PROPERTY RECORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[1rem] shadow-2xl w-full max-w-2xl flex flex-col relative my-8">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{editingProp ? 'Modify Property Record' : 'Create Property Record'}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-red-600">Close X</button>
            </div>

            <div className="px-10 pb-10 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                id: {newProp.id}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">ADDRESS</label>
                   <input type="text" value={newProp.address || ''} onChange={e => setNewProp({...newProp, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white" />
                </div>
                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">MUNICIPALITY</label>
                   <input type="text" value={newProp.municipality || ''} onChange={e => setNewProp({...newProp, municipality: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white" />
                </div>
                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">PROVINCE</label>
                   <select value={newProp.state || 'ON'} onChange={e => setNewProp({...newProp, state: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none">
                     <option value="AB">Alberta (AB)</option>
                     <option value="BC">British Columbia (BC)</option>
                     <option value="MB">Manitoba (MB)</option>
                     <option value="NB">New Brunswick (NB)</option>
                     <option value="NL">Newfoundland and Labrador (NL)</option>
                     <option value="NS">Nova Scotia (NS)</option>
                     <option value="ON">Ontario (ON)</option>
                     <option value="PE">Prince Edward Island (PE)</option>
                     <option value="QC">Quebec (QC)</option>
                     <option value="SK">Saskatchewan (SK)</option>
                     <option value="NT">Northwest Territories (NT)</option>
                     <option value="NU">Nunavut (NU)</option>
                     <option value="YT">Yukon (YT)</option>
                   </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">POSTAL CODE</label>
                   <input type="text" placeholder="e.g. M5H 2N2" value={newProp.zipCode || ''} onChange={e => setNewProp({...newProp, zipCode: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" />
                </div>
                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">PRICE ($)</label>
                   <input type="number" value={newProp.price || 0} onChange={e => setNewProp({...newProp, price: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" />
                </div>
                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">MARKET VALUE ($)</label>
                   <input type="text" value={newProp.marketValue || '0'} onChange={e => setNewProp({...newProp, marketValue: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" />
                </div>
                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">SALE DATE</label>
                   <input type="date" value={newProp.auctionDate || ''} onChange={e => setNewProp({...newProp, auctionDate: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">LATITUDE (MAP PIN)</label>
                    <input type="number" step="0.0001" value={newProp.latitude || 43.65} onChange={e => setNewProp({...newProp, latitude: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" />
                 </div>
                 <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">LONGITUDE (MAP PIN)</label>
                    <input type="number" step="0.0001" value={newProp.longitude || -79.38} onChange={e => setNewProp({...newProp, longitude: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">STATUS</label>
                   <select value={newProp.status || 'Active'} onChange={e => setNewProp({...newProp, status: e.target.value as PropertyStatus})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none">
                     <option>Active</option>
                     <option>Sold</option>
                     <option>Cancelled</option>
                     <option>Not Available</option>
                   </select>
                </div>
                <div className="md:col-span-2">
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">PROPERTY FEATURES</label>
                   <div className="flex flex-wrap gap-4 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                      {['Waterfront', 'Near Water', 'Road Access', 'Mountain'].map(f => (
                        <label key={f} className="flex items-center gap-2 cursor-pointer">
                           <input type="checkbox" checked={newProp.features?.includes(f as PropertyFeature)} onChange={() => toggleFeature(f as PropertyFeature)} className="w-4 h-4 rounded text-red-600 focus:ring-red-500" />
                           <span className="text-[10px] font-bold text-slate-600">{f}</span>
                        </label>
                      ))}
                   </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              <div>
                <div className="flex justify-between items-end mb-4">
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">PROPERTY GALLERY (MAX 3)</h3>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{(newProp.images || []).length} / 3 UPLOADED</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                   {[1,2,3].map(i => (
                     <div key={i} className="aspect-square border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition group">
                        <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-200 group-hover:text-red-400 group-hover:border-red-100">+</div>
                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-slate-400">UPLOAD PHOTO</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex flex-col p-6 bg-slate-900 rounded-2xl text-white transition-all duration-300">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <input type="checkbox" checked={isSoldChecked} onChange={(e) => setIsSoldChecked(e.target.checked)} className="w-5 h-5 rounded bg-white/10 border-white/20" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">PROPERTY SOLD FOR</span>
                       </div>
                       {isSoldChecked && (
                          <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
                             <span className="text-[10px] font-black text-slate-400">$</span>
                             <input type="number" value={newProp.soldPrice || ''} onChange={(e) => setNewProp({...newProp, soldPrice: e.target.value})} placeholder="Amount" className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:bg-white/20" />
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="flex flex-col p-6 bg-[#abb7d6] rounded-2xl text-white transition-all duration-300">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <input type="checkbox" checked={isRedeemableChecked} onChange={(e) => setIsRedeemableChecked(e.target.checked)} className="w-5 h-5 rounded bg-white/10 border-white/20" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">PROPERTY IS REDEEMABLE</span>
                       </div>
                       {isRedeemableChecked && (
                          <div className="animate-in slide-in-from-right-4 duration-300">
                             <select value={newProp.redeemableInfo || 'No'} onChange={(e) => setNewProp({...newProp, redeemableInfo: e.target.value})} className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-black uppercase outline-none focus:bg-white/20">
                                <option value="Yes" className="bg-slate-700">Yes</option>
                                <option value="No" className="bg-slate-700">No</option>
                                <option value="NA" className="bg-slate-700">NA</option>
                             </select>
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              <div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">LINKED IDENTIFIERS (PID/AAN)</h3>
                 
                 <div className="space-y-3 mb-6">
                    {(newProp.identifiers || []).map(id => (
                       <div key={id.id} className="flex items-center gap-3 animate-in fade-in duration-300">
                          <div className="w-24 text-[10px] font-black text-red-600 uppercase bg-red-50 px-2 py-1.5 rounded-lg border border-red-100 text-center flex flex-col">
                             <span>{id.type}</span>
                          </div>
                          <input type="text" value={id.value} onChange={(e) => updateIdentifier(id.id, e.target.value, false)} placeholder="Identifier Value" className="flex-grow px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white" />
                          <button onClick={() => deleteIdentifier(id.id, false)} className="text-slate-300 hover:text-red-600 transition-colors">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                       </div>
                    ))}
                    {(newProp.assessments || []).map(as => (
                       <div key={as.id} className="flex items-center gap-3 animate-in fade-in duration-300">
                          <div className="w-24 text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100 text-center flex flex-col">
                             <span>{as.type}</span>
                          </div>
                          <input type="text" value={as.value} onChange={(e) => updateIdentifier(as.id, e.target.value, true)} placeholder="Assessment Value" className="flex-grow px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white" />
                          <button onClick={() => deleteIdentifier(as.id, true)} className="text-slate-300 hover:text-red-600 transition-colors">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                       </div>
                    ))}
                 </div>

                 <div className="flex gap-4">
                    <button onClick={() => addIdentifier(false)} className="px-4 py-2 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all">+ ADD PID/PIN/LINC/CADASTRE</button>
                    <button onClick={() => addIdentifier(true)} className="px-4 py-2 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-all">+ ADD AAN/ROLL/FOLIO</button>
                 </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">LAND DESCRIPTION</label>
                    <textarea value={newProp.landDescription || ''} onChange={e => setNewProp({...newProp, landDescription: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl h-24 text-xs font-medium outline-none focus:bg-white resize-none" />
                 </div>
                 <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">NOTICE DESCRIPTION</label>
                    <textarea value={newProp.description || ''} onChange={e => setNewProp({...newProp, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl h-24 text-xs font-medium outline-none focus:bg-white resize-none" />
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button onClick={handleSaveProperty} className="flex-[2] py-4 bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-600/20 active:scale-95 transition">SAVE RECORD</button>
                 <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition">CANCEL</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JURISDICTION MODAL */}
      {showJurisdictionModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl p-12 animate-in zoom-in duration-200">
            <h2 className="text-3xl font-black text-[#1e293b] mb-10 tracking-tight">{editingJurisdiction ? 'Edit Region' : 'Add New Region'}</h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">REGION NAME</label>
                  <input 
                    type="text" 
                    value={newJurisdiction.name} 
                    onChange={e => setNewJurisdiction({...newJurisdiction, name: e.target.value})} 
                    placeholder="e.g., Ontario" 
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#1e293b]/5 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ABBREVIATION</label>
                  <input 
                    type="text" 
                    value={newJurisdiction.abbreviation} 
                    onChange={e => setNewJurisdiction({...newJurisdiction, abbreviation: e.target.value.toUpperCase()})} 
                    placeholder="e.g., ON" 
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#1e293b]/5 transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">FLAG URL / UPLOAD</label>
                <div className="flex gap-4">
                   <input 
                    type="text" 
                    value={newJurisdiction.flagUrl} 
                    onChange={e => setNewJurisdiction({...newJurisdiction, flagUrl: e.target.value})} 
                    placeholder="https://..." 
                    className="flex-grow px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#1e293b]/5 transition-all" 
                   />
                   <button className="px-8 py-4 bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-black transition-all">UPLOAD</button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">MUNICIPALITIES</label>
                <div className="flex gap-4 mb-4">
                   <input 
                    type="text" 
                    value={newMunicipalityInput} 
                    onChange={e => setNewMunicipalityInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddMunicipality()}
                    placeholder="Add municipality name..." 
                    className="flex-grow px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#1e293b]/5 transition-all" 
                   />
                   <button 
                    onClick={handleAddMunicipality}
                    className="px-8 py-4 bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-black transition-all"
                   >
                    ADD
                   </button>
                </div>
                
                {/* List of current municipalities */}
                <div className="flex flex-wrap gap-2 min-h-[48px] p-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem]">
                   {(newJurisdiction.municipalities || []).map(m => (
                     <div key={m} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 group">
                        {m}
                        <button 
                          onClick={() => handleRemoveMunicipality(m)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                     </div>
                   ))}
                   {(!newJurisdiction.municipalities || newJurisdiction.municipalities.length === 0) && (
                     <span className="text-xs text-slate-400 font-medium italic py-1">No municipalities added yet.</span>
                   )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={async () => {
                    const jurisToSave = { 
                      ...newJurisdiction, 
                      id: newJurisdiction.id || `jur-${Math.random().toString(36).substr(2, 5)}` 
                    } as Jurisdiction;
                    const result = await saveJurisdiction(jurisToSave);
                    if (result) {
                      setJurisdictions(await fetchJurisdictions());
                      setShowJurisdictionModal(false);
                    } else {
                      alert('Failed to save jurisdiction.');
                    }
                  }}
                  className="flex-[2] py-5 bg-[#dc2626] text-white font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-red-600/20 active:scale-95 transition-all"
                >
                  SAVE REGION
                </button>
                <button 
                  onClick={() => setShowJurisdictionModal(false)} 
                  className="flex-1 py-5 bg-slate-50 text-slate-500 font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-slate-100 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDUCATION ARTICLE MODAL */}
      {showEducationModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl p-10 animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-[#1e293b] mb-10 tracking-tight">New Education Hub Entry</h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">TITLE</label>
                  <input 
                    type="text" 
                    value={newArticle.title} 
                    onChange={e => setNewArticle({...newArticle, title: e.target.value})} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">CATEGORY</label>
                  <div className="relative">
                    <select 
                      value={newArticle.category} 
                      onChange={e => setNewArticle({...newArticle, category: e.target.value as any})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none appearance-none cursor-pointer"
                    >
                      <option>Basics</option>
                      <option>Risk</option>
                      <option>Strategy</option>
                      <option>Glossary</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">FEATURED IMAGE URL / UPLOAD</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={newArticle.image} 
                    onChange={e => setNewArticle({...newArticle, image: e.target.value})} 
                    className="flex-grow px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" 
                  />
                  <button className="px-8 py-4 bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-black transition-all">UPLOAD</button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">PDF / DOCUMENT ATTACHMENT URL / UPLOAD</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={newArticle.pdfUrl} 
                    onChange={e => setNewArticle({...newArticle, pdfUrl: e.target.value})} 
                    placeholder="Document link or local file..."
                    className="flex-grow px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none placeholder:text-slate-300" 
                  />
                  <button className="px-8 py-4 bg-[#2563eb] text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-blue-700 transition-all">UPLOAD FILE</button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ARTICLE EXCERPT (SUMMARY)</label>
                <textarea 
                  value={newArticle.excerpt} 
                  onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} 
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm outline-none transition-all resize-none" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">FULL CONTENT</label>
                <textarea 
                  value={newArticle.content} 
                  onChange={e => setNewArticle({...newArticle, content: e.target.value})} 
                  rows={8}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm outline-none transition-all resize-none" 
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={async () => {
                    const articleToSave = { 
                      ...newArticle, 
                      id: newArticle.id || `art-${Math.random().toString(36).substr(2, 5)}`,
                      date: newArticle.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    } as EducationArticle;
                    const result = await saveArticle(articleToSave);
                    if (result) {
                      setArticles(await fetchArticles());
                      setShowEducationModal(false);
                    } else {
                      alert('Failed to save article.');
                    }
                  }}
                  className="flex-[2] py-5 bg-[#dc2626] text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-red-600/20 active:scale-95 transition-all text-xs"
                >
                  SAVE ARTICLE
                </button>
                <button 
                  onClick={() => setShowEducationModal(false)} 
                  className="flex-1 py-5 bg-[#f1f5f9] text-slate-500 font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all text-xs"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {showFAQModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-10 animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-[#1e293b] mb-10 tracking-tight">{editingFAQ ? 'Edit FAQ' : 'New Platform FAQ'}</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">QUESTION</label>
                <input 
                  type="text" 
                  value={newFAQ.question} 
                  onChange={e => setNewFAQ({...newFAQ, question: e.target.value})} 
                  placeholder="Enter the question..." 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">CATEGORY</label>
                <select 
                  value={newFAQ.category} 
                  onChange={e => setNewFAQ({...newFAQ, category: e.target.value as any})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none appearance-none"
                >
                  <option>General</option>
                  <option>Process</option>
                  <option>Legal</option>
                  <option>Investing</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ANSWER</label>
                <textarea 
                  value={newFAQ.answer} 
                  onChange={e => setNewFAQ({...newFAQ, answer: e.target.value})} 
                  rows={6}
                  placeholder="Detailed answer..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm outline-none resize-none" 
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={async () => {
                    const faqToSave = { 
                      ...newFAQ, 
                      id: newFAQ.id || `faq-${Math.random().toString(36).substr(2, 5)}`
                    } as FAQItem;
                    const result = await saveFAQ(faqToSave);
                    if (result) {
                      setFaqs(await fetchFAQs());
                      setShowFAQModal(false);
                    } else {
                      alert('Failed to save FAQ.');
                    }
                  }}
                  className="flex-[2] py-4 bg-[#dc2626] text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-red-600/20 active:scale-95 transition-all text-xs"
                >
                  SAVE FAQ
                </button>
                <button 
                  onClick={() => setShowFAQModal(false)} 
                  className="flex-1 py-4 bg-[#f1f5f9] text-slate-500 font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all text-xs"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
