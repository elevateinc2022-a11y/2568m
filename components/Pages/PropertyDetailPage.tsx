
import React, { useState, useEffect, useRef } from 'react';
import { Property, Jurisdiction, User } from '../../types';
import { BiddingPackageModal } from '../Modals/BiddingPackageModal';

interface PropertyDetailPageProps {
  property: Property;
  jurisdictions: Jurisdiction[];
  user: User | null;
  onNavigate: (view: string, options?: any) => void;
  isSubscribed?: boolean;
}

declare const L: any;

const STATUS_COLORS: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  'Sold': 'bg-yellow-400 text-slate-900',
  'Cancelled': 'bg-red-600 text-white',
  'Not Available': 'bg-slate-400 text-white'
};

const formatCurrencyValue = (val: string | number | undefined) => {
  if (val === undefined || val === null || val === '') return 'N/A';
  if (typeof val === 'number') return `$${val.toLocaleString()}`;
  const numericVal = Number(val.replace(/[^0-9.-]+/g,""));
  if (!isNaN(numericVal) && val.trim() !== '' && !/[a-zA-Z]/.test(val)) {
    return `$${numericVal.toLocaleString()}`;
  }
  return val;
};

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ property, jurisdictions, user, onNavigate, isSubscribed }) => {
  const juris = jurisdictions.find(j => j.abbreviation === property.state);
  const provinceName = juris ? juris.name : property.state;
  const statusClass = STATUS_COLORS[property.status] || 'bg-slate-900 text-white';
  const isActive = property.status === 'Active';

  const [showTitleSearchModal, setShowTitleSearchModal] = useState(false);
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchForm, setSearchForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const images = property.images.length > 0 ? property.images : ['https://via.placeholder.com/1200x800?text=No+Images+Available'];

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;

  // Check for auto-download flag on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autoDownload = params.get('autoDownload');

    if (autoDownload === 'true' && isSubscribed) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        triggerBiddingPackageDownload();
        // Clear the param to prevent triggers on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, isSubscribed, property.id]);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentImgIdx(prev => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [images.length, isPaused]);

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx(prev => (prev + 1) % images.length);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx(prev => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (typeof L === 'undefined' || !mapContainerRef.current) return;

    const lat = property.latitude ?? property.coordinates?.lat;
    const lng = property.longitude ?? property.coordinates?.lng;

    if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const streetMap = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }
    );

    const satelliteMap = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: '© Esri, Maxar, Earthstar Geographics'
      }
    );

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 14,
      layers: [streetMap]
    });
    mapInstanceRef.current = map;

    const baseMaps = {
      "Street Map": streetMap,
      "Satellite": satelliteMap
    };
    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    const icons = {
      active: L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      }),
      sold: L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      }),
      notavailable: L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/grey-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      }),
      cancelled: L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })
    };

    let propertyIcon = icons.active;
    const status = property.status.toLowerCase().replace(/\s/g, '');
    if (status === 'sold') propertyIcon = icons.sold;
    else if (status === 'cancelled') propertyIcon = icons.cancelled;
    else if (status === 'notavailable') propertyIcon = icons.notavailable;

    L.marker([lat, lng], { icon: propertyIcon })
      .addTo(map)
      .bindPopup(`
        <div class="px-3 py-3 flex flex-col gap-0.5">
          <strong class="text-slate-900 text-sm popup-address">${property.address}</strong>
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-tight">${property.municipality}</span>
        </div>
      `, { maxWidth: 300, minWidth: 100 })
      .openPopup();

    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [property]);

  const handleTitleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmitted(true);
  };

  /**
   * Protected Bidding Package Logic
   */
  const triggerBiddingPackageDownload = () => {
    console.log(`[PROTECTED] Triggering backend download for property: ${property.id}`);
    alert(`Downloading Bidding Package for Property ${property.id}... \n\nLogic: Active Subscription verified. No payment required.`);
  };

  const handleBiddingClick = () => {
    if (isSubscribed) {
      triggerBiddingPackageDownload();
    } else {
      setShowBiddingModal(true);
    }
  };

  const handleLoginRedirect = () => {
    onNavigate('login', { 
      redirect: 'details', 
      propertyId: property.id 
    });
  };

  const handleGuestPurchaseRedirect = () => {
    onNavigate('payment', { propId: property.id });
  };

  return (
    <div className="bg-slate-50 pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
              <div 
                className="relative h-[500px] overflow-hidden group bg-slate-900"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {images.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentImgIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    <img 
                      src={img} 
                      alt={`${property.address} - View ${idx + 1}`}
                      className={`w-full h-full object-cover transform scale-110 transition-transform duration-1000 ease-linear ${idx === currentImgIdx && !isPaused ? 'translate-x-[-2%] translate-y-[-2%] scale-105' : ''}`}
                    />
                  </div>
                ))}

                <div className="absolute top-6 left-6 flex gap-2 z-20">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 ${statusClass} text-xs font-black uppercase tracking-widest rounded-full shadow-lg`}>
                    {isActive && (
                      <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(5,150,105,0.4)]"></span>
                    )}
                    {property.status}
                  </span>
                </div>

                {images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImg}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                      onClick={handleNextImg}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                      {images.map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(idx); }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImgIdx ? 'w-8 bg-white' : 'bg-white/40 hover:bg-white/60'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="p-8 md:p-12">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-2">Tax Sale Date</span>
                    <p className="text-lg font-bold text-blue-600">{property.auctionDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-2">Minimum Bid</span>
                    <span className="text-4xl font-black text-red-600">${property.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-10">
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Property Location Map
                    </h3>
                    <div className="bg-slate-100 rounded-3xl border border-slate-200 h-[400px] w-full overflow-hidden relative shadow-inner">
                      <div ref={mapContainerRef} className="w-full h-full z-10" style={{ height: '400px' }} />
                    </div>
                </div>

                <div className="py-8 border-y border-slate-100 mb-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Land Description</h3>
                  <p className="text-slate-900 font-medium leading-relaxed">
                    {property.landDescription || "Official legal description will be updated as provided by the municipality."}
                  </p>
                </div>

                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-4 text-slate-900">Notice from Municipality</h2>
                  <p className="text-slate-800 font-bold text-sm">Information will be posted from municipality.</p>
                  <p className="text-slate-600 text-lg leading-relaxed mt-2">{property.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Property Tax Sale Information</h3>
              <div className="space-y-4 mb-8">
                <div className="pb-3 border-b border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Sale Type</span>
                  <span className="text-sm font-bold text-slate-900">Public {property.saleType === 'Tender' ? 'Tender' : 'Auction'}</span>
                </div>
                <div className="pb-3 border-b border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Minimum Bid Amount</span>
                  <span className="text-sm font-bold text-red-600">${property.price.toLocaleString()}</span>
                </div>
                <div className="pb-3 border-b border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Assessed Value</span>
                  <span className="text-sm font-bold text-slate-900">{formatCurrencyValue(property.marketValue)}</span>
                </div>
                <div className="pb-3 border-b border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Address</span>
                  <span className="text-sm font-bold text-slate-900">{fullAddress}</span>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">Property Identifiers</h4>
                  <div className="space-y-3">
                    {property.identifiers.map(ident => (
                      <div key={ident.id} className="pb-2 border-b border-slate-50 last:border-0">
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block mb-1">{ident.type}</span>
                        <span className="text-xs font-bold text-slate-900 block">{ident.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {isActive && (
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowTitleSearchModal(true)}
                    className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-red-700 transition shadow-xl shadow-red-600/20"
                  >
                    Order a Title Search
                  </button>
                  <button 
                    onClick={handleBiddingClick}
                    className="w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-emerald-700 transition shadow-xl shadow-emerald-600/20"
                  >
                    {isSubscribed ? 'Free Download (Subscriber)' : 'Download Bidding Package'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BiddingPackageModal 
        propertyId={property.id}
        isOpen={showBiddingModal}
        onClose={() => setShowBiddingModal(false)}
        onLogin={handleLoginRedirect}
        onGuestPurchase={handleGuestPurchaseRedirect}
      />

      {showTitleSearchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => { setShowTitleSearchModal(false); setSearchSubmitted(false); }}></div>
          <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-xl p-10 animate-in fade-in zoom-in duration-300">
            {!searchSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Order a Title Search</h2>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2">check ownership and liens</p>
                </div>
                <form onSubmit={handleTitleSearchSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property ID</label>
                    <input type="text" readOnly value={property.id} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-black text-sm outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Address</label>
                    <input type="text" readOnly value={fullAddress} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-bold text-sm outline-none" />
                  </div>
                  <input type="text" required placeholder="Your Full Name" value={searchForm.name} onChange={e => setSearchForm({...searchForm, name: e.target.value})} className="w-full px-5 py-3 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="email" required placeholder="Email" value={searchForm.email} onChange={e => setSearchForm({...searchForm, email: e.target.value})} className="w-full px-5 py-3 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-500" />
                    <input type="tel" required placeholder="Phone" value={searchForm.phone} onChange={e => setSearchForm({...searchForm, phone: e.target.value})} className="w-full px-5 py-3 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-500" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition">Submit Request</button>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Request Received</h2>
                <p className="text-slate-600">A member of our team will contact you shortly.</p>
                <button onClick={() => setShowTitleSearchModal(false)} className="mt-10 px-8 py-3 bg-slate-900 text-white font-black uppercase rounded-xl">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
