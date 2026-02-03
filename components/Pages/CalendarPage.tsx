
import React, { useState, useMemo } from 'react';
import { Property } from '../../types';

const StatBox = ({ label, value, color }: { label: string, value: number, color: 'emerald' | 'amber' | 'red' | 'slate' }) => {
  const colors = {
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
    slate: 'text-white'
  };
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl min-w-[120px]">
      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</span>
      <span className={`text-2xl font-black ${colors[color]}`}>{value}</span>
    </div>
  );
};

const NavButton = ({ onClick, children, title }: { onClick: () => void, children?: React.ReactNode, title: string }) => (
  <button 
    onClick={onClick}
    title={title}
    className="p-3 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-200"
  >
    {children}
  </button>
);

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

interface CalendarPageProps {
  properties: Property[];
  onViewDetails: (id: string) => void;
  isSubscribed?: boolean;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ properties, onViewDetails, isSubscribed = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const handlePrevYear = () => setCurrentDate(new Date(currentYear - 1, currentMonth, 1));
  const handleNextYear = () => setCurrentDate(new Date(currentYear + 1, currentMonth, 1));

  const calendarDays = useMemo(() => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);
    const days = [];

    const prevMonthDays = daysInMonth(currentMonth - 1, currentYear);
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, month: currentMonth - 1, year: currentYear, isPadding: true });
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, month: currentMonth, year: currentYear, isPadding: false });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: currentMonth + 1, year: currentYear, isPadding: true });
    }
    return days;
  }, [currentMonth, currentYear]);

  const propertiesByDay = useMemo(() => {
    const map: Record<string, Property[]> = {};
    properties.forEach(p => {
      const date = new Date(p.auctionDate);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [properties]);

  const monthStats = useMemo(() => {
    const currentMonthProps = properties.filter(p => {
      const d = new Date(p.auctionDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    return {
      total: currentMonthProps.length,
      active: currentMonthProps.filter(p => p.status === 'Active').length,
      sold: currentMonthProps.filter(p => p.status === 'Sold').length,
      cancelled: currentMonthProps.filter(p => p.status === 'Cancelled').length
    };
  }, [properties, currentMonth, currentYear]);

  const selectedDaySales = selectedDayKey ? propertiesByDay[selectedDayKey] : [];

  if (!isSubscribed) {
    return (
      <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center p-6 text-center">
         <div className="max-w-xl w-full bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 7a2 2 0 110 4 2 2 0 010-4z"/></svg>
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Calendar Locked</h1>
            <p className="text-lg text-slate-600 font-medium mb-10 leading-relaxed">
              Tracking upcoming municipal tax sales and tender deadlines across Canada requires an active premium subscription.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.href = '#/signup'}
                className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-600/20"
              >
                Get Full Access Today
              </button>
              <button 
                onClick={() => window.location.href = '#/'}
                className="w-full py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600"
              >
                Back to Home
              </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfdfd] min-h-screen pb-32 font-sans text-slate-900">
      <div className="bg-slate-900 pt-20 pb-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.1),transparent)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-6">
              Upcoming <span className="text-red-600">Sales</span> <br />Calendar
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-lg leading-relaxed">
              Track active tenders, live auctions, and recently concluded sales across Canada in real-time.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            <StatBox label="Active" value={monthStats.active} color="emerald" />
            <StatBox label="Sold" value={monthStats.sold} color="amber" />
            <StatBox label="Cancelled" value={monthStats.cancelled} color="red" />
            <StatBox label="Total" value={monthStats.total} color="slate" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.15)] border border-slate-200/60 overflow-hidden flex flex-col">
          
          <div className="px-8 py-10 flex flex-col lg:flex-row justify-between items-center gap-10 border-b border-slate-100">
            <div className="flex items-center gap-6">
              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200">
                <NavButton onClick={handlePrevYear} title="Previous Year">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                </NavButton>
                <NavButton onClick={handlePrevMonth} title="Previous Month">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </NavButton>
              </div>

              <div className="text-center px-4">
                <span className="block text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">{currentYear}</span>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{months[currentMonth]}</h2>
              </div>

              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200">
                <NavButton onClick={handleNextMonth} title="Next Month">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </NavButton>
                <NavButton onClick={handleNextYear} title="Next Year">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </NavButton>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <LegendItem color="bg-emerald-500" label="Active" />
              <LegendItem color="bg-amber-500" label="Sold" />
              <LegendItem color="bg-red-500" label="Cancelled" />
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition shadow-lg shadow-slate-900/10 active:scale-95"
              >
                Go to Today
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center py-4 bg-slate-50/50 border-b border-slate-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 border-r border-slate-100">
            {calendarDays.map((dateObj, idx) => {
              const date = new Date(dateObj.year, dateObj.month, dateObj.day);
              const isToday = date.getTime() === today.getTime();
              const key = `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
              const daySales = propertiesByDay[key] || [];
              
              const activeCount = daySales.filter(p => p.status === 'Active').length;
              const soldCount = daySales.filter(p => p.status === 'Sold').length;
              const cancelCount = daySales.filter(p => p.status === 'Cancelled').length;

              return (
                <div 
                  key={idx} 
                  onClick={() => daySales.length > 0 && setSelectedDayKey(key)}
                  className={`min-h-[140px] p-4 border-l border-b border-slate-100 relative group transition-all duration-300 ${
                    dateObj.isPadding ? 'bg-slate-50/30' : 'bg-white'
                  } ${daySales.length > 0 ? 'hover:bg-slate-50/80 cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-base font-black transition-all duration-300 group-hover:scale-110 ${
                      dateObj.isPadding ? 'text-slate-200' : isToday ? 'text-white bg-red-600 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20' : 'text-slate-900'
                    }`}>
                      {dateObj.day}
                    </span>
                    
                    {daySales.length > 0 && (
                      <div className="flex flex-col gap-1 items-end">
                         {activeCount > 0 && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
                         {soldCount > 0 && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>}
                         {cancelCount > 0 && <span className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 overflow-hidden">
                    {daySales.slice(0, 3).map(p => (
                      <div key={p.id} className="text-[9px] font-black uppercase tracking-tight text-slate-500 truncate flex items-center gap-1.5">
                        <div className={`w-1 h-1 rounded-full ${p.status === 'Active' ? 'bg-emerald-500' : p.status === 'Sold' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                        {p.municipality}
                      </div>
                    ))}
                  </div>

                  {daySales.length > 0 && (
                    <div className="absolute bottom-3 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[8px] font-black text-red-600 uppercase tracking-widest">
                      View Details →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDayKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedDayKey(null)}></div>
          <div className="relative bg-[#fcfdfd] rounded-[3.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-10 bg-white border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] block mb-2">Market activity</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                  {new Date(selectedDayKey.split('-').map(Number)[0], selectedDayKey.split('-').map(Number)[1], selectedDayKey.split('-').map(Number)[2]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
              </div>
              <button onClick={() => setSelectedDayKey(null)} className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-10 custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                {selectedDaySales.map(sale => (
                  <div key={sale.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-red-500/20 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        sale.saleType === 'Auction' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {sale.saleType}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-red-600 transition-colors leading-tight">{sale.address}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">{sale.municipality}, {sale.state}</p>
                    <div className="mt-auto grid grid-cols-2 gap-6 pt-8 border-t border-slate-50">
                      <div>
                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Minimum Bid</span>
                        <span className="text-2xl font-black text-slate-900">${sale.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-end justify-end">
                        <button onClick={() => onViewDetails(sale.id)} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition shadow-lg shadow-slate-900/10 active:scale-95">Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
