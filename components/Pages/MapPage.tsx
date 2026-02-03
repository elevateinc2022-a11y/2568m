
import React, { useEffect, useRef, useState } from 'react';
import { Property, PropertyStatus } from '../../types';

interface MapPageProps {
  properties: Property[];
  onViewDetails: (id: string) => void;
  isSubscribed?: boolean;
}

declare const L: any;

export const MapPage: React.FC<MapPageProps> = ({ properties, onViewDetails, isSubscribed = false }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const [libReady, setLibReady] = useState(false);
  
  // Default to only 'Sold' properties for all users. 
  // Active properties are only visible if the user manually selects them AND is subscribed.
  const [visibleStatuses, setVisibleStatuses] = useState<PropertyStatus[]>(['Sold']);

  // Poll for Leaflet availability
  useEffect(() => {
    const checkL = () => {
      if (typeof L !== 'undefined') {
        setLibReady(true);
      } else {
        setTimeout(checkL, 100);
      }
    };
    checkL();
  }, []);

  // Initialize Map Instance
  useEffect(() => {
    if (!libReady || !mapContainerRef.current || mapInstanceRef.current) return;

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
      center: [56.13, -106.34],
      zoom: 4,
      layers: [streetMap],
      zoomControl: true,
      scrollWheelZoom: true
    });
    
    mapInstanceRef.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);

    const baseMaps = {
      "Street Map": streetMap,
      "Satellite": satelliteMap
    };
    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    if (properties.length > 0) {
      const bounds: any[] = [];
      const targetProps = properties.filter(p => visibleStatuses.includes(p.status));
      
      targetProps.forEach(p => {
        const lat = p.latitude ?? p.coordinates?.lat;
        const lng = p.longitude ?? p.coordinates?.lng;
        if (lat && lng) bounds.push([lat, lng]);
      });
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [libReady]);

  // Update Markers
  useEffect(() => {
    if (!libReady || !mapInstanceRef.current || !markerLayerRef.current) return;

    markerLayerRef.current.clearLayers();

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

    properties.forEach(p => {
      // Enforcement: Even if Active is in visibleStatuses (buggy state), prevent rendering if not subscribed
      if (p.status === 'Active' && !isSubscribed) return;
      if (!visibleStatuses.includes(p.status)) return;

      const lat = p.latitude ?? p.coordinates?.lat;
      const lng = p.longitude ?? p.coordinates?.lng;

      if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
        let propertyIcon = icons.active;
        const statusKey = p.status.toLowerCase().replace(/\s/g, '');
        if (statusKey === 'sold') propertyIcon = icons.sold;
        else if (statusKey === 'cancelled') propertyIcon = icons.cancelled;
        else if (statusKey === 'notavailable') propertyIcon = icons.notavailable;

        const marker = L.marker([lat, lng], { icon: propertyIcon });
        
        const popupDiv = document.createElement('div');
        popupDiv.className = 'font-sans overflow-hidden bg-white';
        popupDiv.innerHTML = `
          <div class="px-4 py-4 flex flex-col gap-1">
            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">${p.municipality}</span>
            <h3 class="font-black text-slate-900 text-sm popup-address">${p.address}</h3>
            <div class="flex items-center justify-between gap-4 mt-1">
              <span class="text-sm font-black text-red-600">$${p.price.toLocaleString()}</span>
              <span class="text-[7px] font-black text-slate-300 uppercase bg-slate-50 px-1 py-0.5 rounded border border-slate-100">${p.status}</span>
            </div>
            <button id="view-details-${p.id}" class="mt-2 w-full py-2 bg-[#111827] text-white text-[9px] font-black rounded-md hover:bg-red-600 transition-colors cursor-pointer uppercase tracking-widest">
              Details
            </button>
          </div>
        `;

        marker.bindPopup(popupDiv, { maxWidth: 300, minWidth: 120 });
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-details-${p.id}`);
          if (btn) btn.onclick = () => onViewDetails(p.id);
        });

        marker.addTo(markerLayerRef.current);
      }
    });

  }, [libReady, properties, visibleStatuses, isSubscribed, onViewDetails]);

  const toggleStatus = (status: PropertyStatus) => {
    if (status === 'Active' && !isSubscribed) return;
    setVisibleStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const statusOptions: { label: PropertyStatus; icon: string }[] = [
    { label: 'Active', icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' },
    { label: 'Sold', icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png' },
    { label: 'Cancelled', icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-1">
            Properties Map
          </h1>
          <p className="text-slate-500 text-sm font-medium italic">
            Visualizing active tax sale opportunities across Canada.
          </p>
        </div>

        <div className="flex-grow bg-white rounded-[2rem] shadow-xl border-4 border-white overflow-hidden relative min-h-[600px]">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full z-10"
            style={{ height: '600px', minHeight: '600px' }}
          >
            {!libReady && (
              <div className="flex flex-col items-center justify-center h-full gap-3 bg-slate-50">
                <div className="w-8 h-8 border-3 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
                <div className="text-slate-400 font-black text-[9px] uppercase tracking-widest">
                  Initializing Map Engine...
                </div>
              </div>
            )}
          </div>

          {/* Interactive Legend Checkboxes */}
          <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-2xl hidden sm:block">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Filter Properties</h4>
            <div className="space-y-3">
              {statusOptions.map((opt) => {
                const isLocked = opt.label === 'Active' && !isSubscribed;
                return (
                  <label 
                    key={opt.label} 
                    className={`flex items-center gap-3 select-none ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}
                    title={isLocked ? "Paid subscription required to view active listings" : ""}
                  >
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        disabled={isLocked}
                        checked={visibleStatuses.includes(opt.label)}
                        onChange={() => toggleStatus(opt.label)}
                        className={`peer h-4 w-4 appearance-none rounded border border-slate-300 transition-all ${isLocked ? 'bg-slate-100' : 'checked:bg-red-600 checked:border-red-600'}`}
                      />
                      <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none hidden peer-checked:block left-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={opt.icon} className="w-4 h-4 opacity-80" alt={opt.label} />
                      <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                        {opt.label}
                        {isLocked && (
                          <svg className="w-2.5 h-2.5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 7a2 2 0 110 4 2 2 0 010-4z"/>
                          </svg>
                        )}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center gap-4">
               <button 
                onClick={() => {
                  const all = isSubscribed ? ['Active', 'Sold', 'Cancelled'] : ['Sold', 'Cancelled'];
                  setVisibleStatuses(all as PropertyStatus[]);
                }}
                className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition"
               >
                Show All
               </button>
               <button 
                onClick={() => setVisibleStatuses([])}
                className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition"
               >
                Clear
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
