import React from 'react';
import { Download, RefreshCw } from 'lucide-react'; 

const AnalysisHeader = ({ 
  filterStatus, 
  setFilterStatus, 
  onExport, 
  dataCount, // This is the count of items on the current page (e.g., 10)
  totalCount, // ✅ NEW PROP: This is the total count from DB (e.g., 556)
  onRefresh 
}) => {

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-5 border-b border-slate-100 dark:border-zinc-800 gap-4">
      
      {/* Title */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Case Analysis</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
           {/* ✅ UPDATED LOGIC: Show Total vs Showing */}
           {totalCount !== undefined && totalCount !== null ? (
              <>
                <span className="font-bold text-slate-700 dark:text-zinc-300">{totalCount}</span> Total Cases Found
                {/* Only show "(Showing X)" if total is different from dataCount */}
                {dataCount < totalCount && (
                  <span className="opacity-70"> (Showing {dataCount})</span>
                )}
              </>
           ) : (
              `${dataCount} Records Found`
           )}
        </p>
      </div>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
          
          {/* Status Tabs */}
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

          {/* Refresh Button */}
          <button 
            onClick={onRefresh} 
            className="p-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all shadow-sm group"
            title="Refresh Data"
          >
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>

          {/* Export Button */}
          <button onClick={onExport} className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all text-sm font-medium shadow-sm">
            <Download size={16} className="text-emerald-600 dark:text-emerald-500" /> Export
          </button>
      </div>
    </div>
  );
};

export default AnalysisHeader;