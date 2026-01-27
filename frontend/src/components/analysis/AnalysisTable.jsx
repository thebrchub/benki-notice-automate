import React from 'react';
import StatusBadge from './StatusBadge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AnalysisTable = ({ 
  data, 
  loading, 
  onRowClick,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-zinc-900/50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Added By</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Case / Bench</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Parties</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Coram</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {loading ? (
               <tr><td colSpan="7" className="py-20 text-center text-zinc-400 animate-pulse">Loading data...</td></tr>
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} onClick={() => onRowClick(item)} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                  
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

                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="text-center py-12 text-slate-400 dark:text-zinc-600">No cases found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-500">Page {currentPage} of {totalPages}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 transition-all text-zinc-600 dark:text-zinc-400">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 transition-all text-zinc-600 dark:text-zinc-400">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTable;