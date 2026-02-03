
import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { AdminToolbar } from './AdminPage';

interface AdminBiddingPackagesProps {
  user: User | null;
  onNavigate: (view: string, options?: any) => void;
  currentTab: string;
}

// Mock Data for the Admin View
const MOCK_PACKAGES = [
  { id: 'MLT-90210', municipality: 'Kawartha Lakes', status: 'Active', price: 15.00, downloads: 24 },
  { id: 'MLT-44512', municipality: 'Niagara Falls', status: 'Active', price: 15.00, downloads: 8 },
  { id: 'MLT-11293', municipality: 'Toronto', status: 'Disabled', price: 15.00, downloads: 142 },
];

const MOCK_ORDERS = [
  { id: 'ORD-7712', propertyId: 'MLT-90210', email: 'investor@gmail.com', type: 'Guest', amount: 15.00, date: '2024-03-01 14:22' },
  { id: 'ORD-7715', propertyId: 'MLT-44512', email: 'admin@mapleleaftax.ca', type: 'Subscriber', amount: 0.00, date: '2024-03-02 09:10' },
  { id: 'ORD-7719', propertyId: 'MLT-90210', email: 'user99@yahoo.com', type: 'Guest', amount: 15.00, date: '2024-03-02 11:45' },
];

const MOCK_LOGS = [
  { propertyId: 'MLT-90210', email: 'investor@gmail.com', ip: '192.168.1.1', method: 'Paid', at: '2024-03-01 14:25' },
  { propertyId: 'MLT-44512', email: 'admin@mapleleaftax.ca', ip: '24.112.5.99', method: 'Subscription', at: '2024-03-02 09:12' },
];

export const AdminBiddingPackages: React.FC<AdminBiddingPackagesProps> = ({ user, onNavigate, currentTab }) => {
  const isAdmin = user?.role === 'admin';

  // Section 1 State: Global Settings
  const [globalSettings, setGlobalSettings] = useState({
    price: 15.00,
    currency: 'CAD',
    urlExpiry: 10,
    nonRefundable: true
  });

  // Section 5 State: Manual Grant Form
  const [manualGrant, setManualGrant] = useState({
    propertyId: '',
    email: '',
    type: 'One-Time Download',
    expiry: ''
  });

  // Filters for Orders
  const [orderFilter, setOrderFilter] = useState({
    propertyId: '',
    email: '',
    type: 'All'
  });

  if (!isAdmin) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span className="font-black text-slate-900 uppercase tracking-widest">Unauthorized Access - Admin Personnel Only</span>
      </div>
    );
  }

  const handleManualGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Access granted for ${manualGrant.email} on property ${manualGrant.propertyId}`);
    setManualGrant({ propertyId: '', email: '', type: 'One-Time Download', expiry: '' });
  };

  const handleGlobalSave = () => {
    alert('Global settings updated successfully.');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Admin Breadcrumb */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate?.('admin')}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            Admin Dashboard
          </button>
          <svg className="w-2.5 h-2.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
            Bidding Packages
          </span>
        </div>

        {/* Unified Admin Toolbar */}
        <AdminToolbar activeTab={currentTab} onNavigate={onNavigate} onTabChange={(tab) => onNavigate('admin', { tab })} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Admin – Bidding Packages</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Global Controls & Order Fulfillment</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distribution Engine Live</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* SECTION 1: Global Settings */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col h-full">
            <h2 className="text-xl font-black text-slate-900 uppercase mb-6 tracking-tight">Global Package Settings</h2>
            <div className="space-y-6 flex-grow">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Package Price (CAD)</label>
                <input 
                  type="number" 
                  value={globalSettings.price} 
                  onChange={e => setGlobalSettings({...globalSettings, price: parseFloat(e.target.value)})} 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-lg focus:ring-2 focus:ring-red-600 outline-none transition" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Currency</label>
                <input type="text" readOnly value="CAD" className="w-full p-4 bg-slate-100 border border-slate-100 rounded-2xl font-bold text-slate-500 cursor-not-allowed" />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Non-Refundable</p>
                   <p className="text-[9px] text-slate-400 font-medium italic">Enforce "No Refund" policy on checkout</p>
                </div>
                <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1">
                   <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Download URL Expiry (Minutes)</label>
                <input 
                  type="number" 
                  value={globalSettings.urlExpiry} 
                  onChange={e => setGlobalSettings({...globalSettings, urlExpiry: parseInt(e.target.value)})} 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black focus:ring-2 focus:ring-red-600 outline-none transition" 
                />
              </div>
            </div>
            <button 
              onClick={handleGlobalSave}
              className="w-full py-4 mt-8 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Save Changes
            </button>
          </div>

          {/* SECTION 5: Manual Access Grant */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col h-full">
            <h2 className="text-xl font-black text-slate-900 uppercase mb-6 tracking-tight">Grant Manual Access</h2>
            <form onSubmit={handleManualGrantSubmit} className="space-y-6 flex-grow">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Property ID</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., MLT-90210"
                  value={manualGrant.propertyId} 
                  onChange={e => setManualGrant({...manualGrant, propertyId: e.target.value.toUpperCase()})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-600 outline-none transition" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">User Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="investor@example.com"
                  value={manualGrant.email} 
                  onChange={e => setManualGrant({...manualGrant, email: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-600 outline-none transition" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Type</label>
                <select 
                  value={manualGrant.type}
                  onChange={e => setManualGrant({...manualGrant, type: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-600 outline-none transition appearance-none"
                >
                  <option>Subscriber Override</option>
                  <option>One-Time Download</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date (Optional)</label>
                <input 
                  type="date" 
                  value={manualGrant.expiry}
                  onChange={e => setManualGrant({...manualGrant, expiry: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-600 outline-none transition" 
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 mt-4 active:scale-95"
              >
                Grant Access
              </button>
            </form>
          </div>

          {/* Quick Metrics / Summary */}
          <div className="space-y-6">
             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/20 rounded-full blur-3xl -mr-12 -mt-12"></div>
                <h3 className="font-black uppercase tracking-widest text-[10px] mb-6 text-slate-400">Total Revenue (Packages)</h3>
                <span className="text-4xl font-black">$4,215.00</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Historical CAD Total</p>
             </div>
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-4">Top Municipalities</h3>
                <div className="space-y-3">
                   {['Kawartha Lakes', 'Hamilton', 'Niagara Falls'].map((city, i) => (
                     <div key={i} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-600">{city}</span>
                        <span className="font-black text-slate-900">{142 - (i * 30)} sales</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* SECTION 2: Packages by Property */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Bidding Packages by Property</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active municipal file inventory</p>
              </div>
              <button className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all">
                Batch Regenerate Files
              </button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Municipality</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Downloads</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {MOCK_PACKAGES.map(pkg => (
                     <tr key={pkg.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-5 font-black text-slate-900 text-sm">{pkg.id}</td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-600">{pkg.municipality}</td>
                        <td className="px-8 py-5">
                           <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                             pkg.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                           }`}>
                             {pkg.status}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-sm font-black text-slate-900">${pkg.price.toFixed(2)}</td>
                        <td className="px-8 py-5 text-center font-bold text-slate-500">{pkg.downloads}</td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex justify-end gap-3">
                              <button className="p-2 text-slate-400 hover:text-red-600 transition" title="Toggle Status">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                              </button>
                              <button className="p-2 text-slate-400 hover:text-red-600 transition" title="Regenerate File">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>

        {/* SECTION 3: Orders & Purchases */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-8 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Bidding Package Orders</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <input 
                  type="text" 
                  placeholder="Filter Property ID" 
                  value={orderFilter.propertyId} 
                  onChange={e => setOrderFilter({...orderFilter, propertyId: e.target.value})}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-1 focus:ring-red-600" 
                 />
                 <input 
                  type="text" 
                  placeholder="Filter Email" 
                  value={orderFilter.email} 
                  onChange={e => setOrderFilter({...orderFilter, email: e.target.value})}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-1 focus:ring-red-600" 
                 />
                 <select 
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-1 focus:ring-red-600"
                  value={orderFilter.type}
                  onChange={e => setOrderFilter({...orderFilter, type: e.target.value})}
                 >
                    <option>All Orders</option>
                    <option>Subscriber</option>
                    <option>Guest</option>
                 </select>
                 <div className="flex items-center gap-2">
                    <div className="h-full px-4 bg-slate-100 border border-slate-100 rounded-xl flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-200 transition">Reset</div>
                 </div>
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User / Email</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {MOCK_ORDERS.map(order => (
                     <tr key={order.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-5 font-mono text-[10px] text-slate-400">{order.id}</td>
                        <td className="px-8 py-5 font-black text-slate-900 text-sm">{order.propertyId}</td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-600">{order.email}</td>
                        <td className="px-8 py-5">
                           <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                             order.type === 'Subscriber' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                           }`}>
                             {order.type}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-center text-sm font-black text-slate-900">${order.amount.toFixed(2)}</td>
                        <td className="px-8 py-5 text-right font-bold text-slate-400 text-xs">{order.date}</td>
                        <td className="px-8 py-5 text-right">
                           <button className="text-[10px] font-black text-red-600 uppercase hover:underline">Resend Receipt</button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>

        {/* SECTION 4: Download Logs */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-8 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Package Download Logs</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time distribution audit trail</p>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Email</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">IP Address</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Downloaded At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {MOCK_LOGS.map((log, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-5 font-black text-slate-900 text-sm">{log.propertyId}</td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-600">{log.email}</td>
                        <td className="px-8 py-5 font-mono text-[10px] text-slate-400">{log.ip}</td>
                        <td className="px-8 py-5">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{log.method}</span>
                        </td>
                        <td className="px-8 py-5 text-right font-bold text-slate-400 text-xs">{log.at}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>

        {/* Security & Permissions Policy Footer */}
        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
           <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                 <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                 <h4 className="font-black uppercase tracking-widest text-xs mb-2">Permissions & Security Rules</h4>
                 <ul className="space-y-1.5 text-[10px] text-slate-400 font-medium list-disc pl-4">
                    <li>This management interface is restricted to Admin roles.</li>
                    <li>Raw file URLs are never exposed directly to client-side scripts.</li>
                    <li>Disabling a package revokes active download sessions instantly.</li>
                    <li>All administrative actions (manual grants, status toggles) are logged for security auditing.</li>
                 </ul>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
