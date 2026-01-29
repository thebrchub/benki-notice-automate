import React, { useState } from 'react';
import { Search, Download, Calendar, X } from 'lucide-react';

const AnalysisHeader = ({ 
  filterStatus, 
  setFilterStatus, 
  onDateFilter, 
  onExport, 
  dataCount 
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dates, setDates] = useState({ start: '', end: '' });

  const handleApplyDate = () => {
    if (dates.start && dates.end) {
      onDateFilter(dates.start, dates.end);
      setShowDatePicker(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-5 border-b border-slate-100 dark:border-zinc-800 gap-4">
      
      {/* Title */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Case Analysis</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
           {dataCount} Records Found
        </p>
      </div>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
          
          {/* Status Tabs - REMOVED 'ALL' */}
          <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-lg">
             {['COMPLETED', 'PENDING', 'FAILED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    filterStatus === status 
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
                  }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
             ))}
          </div>

          {/* Date Picker Button */}
          <div className="relative">
            <button 
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`flex items-center gap-2 border px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showDatePicker || (dates.start && dates.end)
                 ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                 : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Calendar size={16} />
              {dates.start ? `${dates.start} to ${dates.end}` : 'Date Range'}
            </button>

            {/* Date Popover */}
            {showDatePicker && (
              <div className="absolute top-full right-0 mt-2 p-4 bg-white dark:bg-[#18181b] rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 w-72 animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-zinc-500 uppercase">Select Range</span>
                      <button onClick={() => setShowDatePicker(false)}><X size={14} className="text-zinc-400"/></button>
                  </div>
                  <div className="space-y-3">
                     <div>
                        <label className="text-xs text-zinc-500 block mb-1">Start Date</label>
                        <input type="date" value={dates.start} onChange={e => setDates({...dates, start: e.target.value})} className="w-full text-sm p-2 rounded border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                     </div>
                     <div>
                        <label className="text-xs text-zinc-500 block mb-1">End Date</label>
                        <input type="date" value={dates.end} onChange={e => setDates({...dates, end: e.target.value})} className="w-full text-sm p-2 rounded border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                     </div>
                     <button onClick={handleApplyDate} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                        Apply Filter
                     </button>
                  </div>
              </div>
            )}
          </div>

          {/* Export */}
          <button onClick={onExport} className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all text-sm font-medium shadow-sm">
            <Download size={16} className="text-emerald-600 dark:text-emerald-500" /> Export
          </button>
      </div>
    </div>
  );
};

export default AnalysisHeader;