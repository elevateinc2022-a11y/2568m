
import React from 'react';
import { User } from '../../../types';

interface PaymentHistoryPageProps {
  user: User;
}

export const PaymentHistoryPage: React.FC<PaymentHistoryPageProps> = ({ user }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Payment History</h1>
        <div className="w-16 h-1.5 bg-red-600 rounded-full"></div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {user.paymentHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-8 py-5 font-bold text-slate-700 text-sm">
                    {new Date(item.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 font-mono text-[10px] text-slate-400">
                    {item.id}
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-900 text-sm">{item.plan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription</span>
                    {item.amount === 0 && <span className="ml-2 text-[8px] font-black text-amber-600 uppercase bg-amber-50 px-1.5 py-0.5 rounded">Free Trial</span>}
                  </td>
                  <td className="px-8 py-5 font-black text-slate-900 text-sm">
                    ${item.amount.toFixed(2)} CAD
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-full border ${
                      item.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-[10px] font-black text-red-600 uppercase hover:underline decoration-2 underline-offset-4">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {user.paymentHistory.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No transactions recorded yet.</p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Legal Notice</p>
        <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed italic">
          Transactions listed above are non-refundable. For billing disputes or incorrect charges, 
          please contact our finance department at <span className="text-slate-900 font-bold">billing@mapleleaftaxsales.ca</span>
        </p>
      </div>
    </div>
  );
};
