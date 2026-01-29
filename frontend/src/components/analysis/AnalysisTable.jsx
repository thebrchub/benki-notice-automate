import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import { ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import { caseService } from '../../services/caseService'; 

const AnalysisTable = ({ 
  data, 
  loading, 
  onRowClick,
  currentPage,
  totalPages,
  onPageChange,
  onRefresh 
}) => {
  
  const [refetchingId, setRefetchingId] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("Loading data...");

  useEffect(() => {
    let timer;
    if (loading) {
      setLoadingMsg("Loading data...");
      timer = setTimeout(() => {
        setLoadingMsg("Hold on for a minute, it is taking more time than usual...");
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const handleRefetch = async (e, item) => {
    e.stopPropagation(); 
    if (!window.confirm(`Are you sure you want to refetch case ${item.citation_number}?`)) return;

    setRefetchingId(item.id || item.order_link); 

    try {
        await caseService.refetchCase(item.order_link);
        alert("Case queued for re-analysis!");
        if (onRefresh) onRefresh(); 
    } catch (error) {
        console.error("Refetch failed", error);
        alert("Failed to queue case.");
    } finally {
        setRefetchingId(null); 
    }
  };

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          {/* ✅ FIXED: Removed all comments/spaces between <th> tags */}
          <thead className="bg-slate-50 dark:bg-zinc-900/50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Added By</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Case / Bench</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Parties</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Coram</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Outcome</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {loading ? (
               <tr>
                  <td colSpan="8" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                          <Loader2 size={32} className="animate-spin text-zinc-400" />
                          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 animate-pulse transition-all duration-500">
                              {loadingMsg}
                          </p>
                      </div>
                  </td>
               </tr>
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} onClick={() => onRowClick(item)} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                  {/* ✅ FIXED: Ensure no spaces between <td> tags */}
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-zinc-900 dark:text-white">{item.created_by}</span>
                         <span className="text-xs text-zinc-400">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-top text-sm text-zinc-600 dark:text-zinc-300">
                      {item.date_of_pronouncement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                      <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200 font-mono bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded w-fit mb-1">
                          {item.citation_number}
                      </span>
                      <span className="text-xs text-zinc-400">{item.bench_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top max-w-[200px]">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-700 dark:text-zinc-200 truncate">{item.appellant}</span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-wider">VS</span>
                        <span className="text-sm text-slate-600 dark:text-zinc-400 truncate">{item.respondent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top max-w-[150px]">
                     <div className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                        <p className="truncate" title={item.judicial_member}><span className="font-bold">JM:</span> {item.judicial_member?.split(' ')[0]}..</p>
                        <p className="truncate" title={item.accountant_member}><span className="font-bold">AM:</span> {item.accountant_member?.split(' ')[0]}..</p>
                     </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                     <span className={`text-xs font-bold uppercase ${item.appeal_in_favor_of === 'Assessee' ? 'text-emerald-600' : 'text-zinc-500'}`}>
                        {item.appeal_in_favor_of}
                     </span>
                  </td>
                  <td className="px-6 py-4 align-top text-center">
                    {item.status === 'COMPLETED' && (
                        <button
                            onClick={(e) => handleRefetch(e, item)}
                            disabled={(refetchingId === item.id || refetchingId === item.order_link)}
                            className="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group/btn"
                            title="Refetch & Re-analyze"
                        >
                            <RefreshCw 
                                size={16} 
                                className={(refetchingId === item.id || refetchingId === item.order_link) ? "animate-spin text-blue-500" : "group-hover/btn:rotate-180 transition-transform duration-500"} 
                            />
                        </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="text-center py-12 text-slate-400 dark:text-zinc-600">No cases found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-500">Page {currentPage} of {totalPages}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onPageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 transition-all text-zinc-600 dark:text-zinc-400">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 transition-all text-zinc-600 dark:text-zinc-400">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTable;