
import React, { useState, useEffect, useMemo } from 'react';
import { User, SubscriptionStatus, SubscriptionPlan, PaymentHistoryItem } from '../../types';
import { AdminToolbar } from './AdminPage';
import { fetchAllUsers, updateUserProfile } from '../../utils/supabaseData';

interface AdminSubscriptionsProps {
  onNavigate: (view: string, options?: any) => void;
  currentTab: string;
}

export const AdminSubscriptions: React.FC<AdminSubscriptionsProps> = ({ onNavigate, currentTab }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    plan: 'all',
    status: 'all',
    payment: 'all'
  });
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setUsers(await fetchAllUsers());
    };
    loadUsers();
  }, []);

  // KPIs Calculation
  const kpis = useMemo(() => {
    const now = new Date();
    const next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);

    return {
      activePaid: users.filter(u => u.subscription.status === 'active').length,
      trials: users.filter(u => u.subscription.status === 'trial').length,
      expiringSoon: users.filter(u => {
        const nextBilling = new Date(u.subscription.nextBillingDate);
        return u.subscription.status !== 'canceled' && nextBilling <= next7Days && nextBilling >= now;
      }).length,
      revenueMTD: users.reduce((acc, u) => {
        const monthPayments = (u.paymentHistory || []).filter(p => {
          const d = new Date(p.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && p.status === 'paid';
        });
        return acc + monthPayments.reduce((pAcc, p) => pAcc + p.amount, 0);
      }, 0)
    };
  }, [users]);

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (u.id || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPlan = filters.plan === 'all' || u.subscription.plan === filters.plan;
      const matchesStatus = filters.status === 'all' || u.subscription.status === filters.status;
      
      const hasFailed = u.paymentHistory?.some(p => p.status === 'failed');
      const matchesPayment = filters.payment === 'all' || 
        (filters.payment === 'failed' && hasFailed) || 
        (filters.payment === 'clean' && !hasFailed);

      return matchesSearch && matchesPlan && matchesStatus && matchesPayment;
    });
  }, [users, searchQuery, filters]);

  const handleUpdateUser = async (updatedUser: User) => {
    const result = await updateUserProfile(updatedUser.id, updatedUser);
    if (result) {
      setUsers(await fetchAllUsers()); // Refetch all users to ensure consistency
      setShowManageModal(false);
      setSelectedUser(null);
    } else {
      alert('Failed to update user profile in Supabase.');
    }
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'trial': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'canceled': return 'bg-red-50 text-red-700 border-red-100';
      case 'expired': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('admin')}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            Admin Dashboard
          </button>
          <svg className="w-2.5 h-2.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
            Subscription Management
          </span>
        </div>

        {/* Unified Admin Toolbar */}
        <AdminToolbar activeTab={currentTab} onNavigate={onNavigate} onTabChange={(tab) => onNavigate('admin', { tab })} />

        <div className="flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Subscriptions & Billing</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Live customer financial database</p>
           </div>
        </div>

        {/* KPIs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Paid</span>
            <span className="text-4xl font-black text-emerald-600">{kpis.activePaid}</span>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trialing Users</span>
            <span className="text-4xl font-black text-amber-600">{kpis.trials}</span>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expiring (7d)</span>
            <span className="text-4xl font-black text-red-600">{kpis.expiringSoon}</span>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Revenue (MTD)</span>
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">${kpis.revenueMTD.toLocaleString()}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase">CAD</span>
            </div>
          </div>
        </div>

        {/* Filters & Table */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col xl:flex-row gap-6 items-start xl:items-center">
            <div className="flex-grow w-full xl:w-auto">
               <input 
                type="text" 
                placeholder="Search Name, Email, or ID..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-600 transition" 
               />
            </div>
            <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                <select 
                    value={filters.plan} 
                    onChange={e => setFilters({...filters, plan: e.target.value})}
                    className="px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-red-600"
                >
                    <option value="all">All Plans</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                <select 
                    value={filters.status} 
                    onChange={e => setFilters({...filters, status: e.target.value})}
                    className="px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-red-600"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="trial">Trial</option>
                    <option value="canceled">Canceled</option>
                    <option value="expired">Expired</option>
                </select>
                <select 
                    value={filters.payment} 
                    onChange={e => setFilters({...filters, payment: e.target.value})}
                    className="px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-red-600"
                >
                    <option value="all">Payment Status</option>
                    <option value="clean">All Paid</option>
                    <option value="failed">Failed History</option>
                </select>
                <button 
                    onClick={() => { setSearchQuery(''); setFilters({ plan: 'all', status: 'all', payment: 'all' }); }}
                    className="px-6 py-3.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-xl hover:bg-slate-200 transition"
                >
                    Reset
                </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trial End</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Billing</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Payment</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map(user => {
                  const lastPayment = user.paymentHistory?.[user.paymentHistory.length - 1];
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors">{user.email}</span>
                          <span className="text-[10px] font-mono text-slate-400">{user.id}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{user.subscription.plan}ly</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusBadge(user.subscription.status)}`}>
                            {user.subscription.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500">
                            {user.subscription.trialEndDate ? new Date(user.subscription.trialEndDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-900">
                            {new Date(user.subscription.nextBillingDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-slate-900">${lastPayment?.amount || 0}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase">{lastPayment ? new Date(lastPayment.date).toLocaleDateString() : 'Never'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => { setSelectedUser(user); setShowManageModal(true); }}
                                className="px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition shadow-lg shadow-slate-900/10"
                            >
                                Manage
                            </button>
                            <button 
                                onClick={() => { setSelectedUser(user); setShowHistoryModal(true); }}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-50 transition"
                            >
                                History
                            </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Management Modal */}
        {showManageModal && selectedUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowManageModal(false)}></div>
             <div className="relative bg-white rounded-[3rem] p-10 max-w-xl w-full animate-in zoom-in duration-200 shadow-2xl">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Manual Subscriber Override</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">{selectedUser.email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Plan</span>
                        <span className="text-sm font-black text-slate-900 uppercase">{selectedUser.subscription.plan}ly</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</span>
                        <span className="text-sm font-black text-slate-900 uppercase">{selectedUser.subscription.status}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleUpdateUser({...selectedUser, subscription: {...selectedUser.subscription, plan: 'monthly', status: 'active', autoRenew: true}})}
                            className="py-4 bg-emerald-600 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-emerald-700 transition"
                        >
                            Activate Monthly
                        </button>
                        <button 
                            onClick={() => handleUpdateUser({...selectedUser, subscription: {...selectedUser.subscription, plan: 'yearly', status: 'active', autoRenew: true}})}
                            className="py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-blue-700 transition"
                        >
                            Activate Yearly
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => handleUpdateUser({...selectedUser, subscription: {...selectedUser.subscription, status: 'trial'}})}
                        className="w-full py-4 bg-amber-50 text-amber-700 border border-amber-100 font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-amber-100 transition"
                    >
                        Reset to 7-Day Trial
                    </button>

                    <div className="h-px bg-slate-100 my-4"></div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleUpdateUser({...selectedUser, subscription: {...selectedUser.subscription, status: 'canceled', autoRenew: false}})}
                            className="py-4 bg-red-50 text-red-600 border border-red-100 font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-red-100 transition"
                        >
                            Cancel Renewal
                        </button>
                        <button 
                            onClick={() => handleUpdateUser({...selectedUser, subscription: {...selectedUser.subscription, status: 'expired', autoRenew: false}})}
                            className="py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-black transition"
                        >
                            Expire Access Instantly
                        </button>
                    </div>

                    <button onClick={() => setShowManageModal(false)} className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-[9px] mt-4 hover:text-slate-600">Close Window</button>
                </div>
             </div>
          </div>
        )}

        {/* History Modal */}
        {showHistoryModal && selectedUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowHistoryModal(false)}></div>
             <div className="relative bg-white rounded-[3rem] max-w-4xl w-full animate-in zoom-in duration-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="px-10 py-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Payment Ledger</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">History for {selectedUser.email}</p>
                    </div>
                    <button onClick={() => setShowHistoryModal(false)} className="p-2 text-slate-400 hover:text-red-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-10">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {(selectedUser.paymentHistory || []).map((p: PaymentHistoryItem) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{new Date(p.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-xs font-black text-slate-900">{p.plan} Subscription</td>
                                    <td className="px-6 py-4 text-xs font-black text-slate-900">${p.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                                            p.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[9px] font-black text-red-600 uppercase hover:underline">Download PDF</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(!selectedUser.paymentHistory || selectedUser.paymentHistory.length === 0) && (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 font-black uppercase text-xs">No transactions recorded</p>
                        </div>
                    )}
                </div>
                
                <div className="px-10 py-6 border-t border-slate-100 text-center">
                    <button onClick={() => setShowHistoryModal(false)} className="px-8 py-3 bg-slate-900 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-black transition">Close Ledger</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
