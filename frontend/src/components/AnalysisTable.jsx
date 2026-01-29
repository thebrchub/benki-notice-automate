import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Download, ChevronLeft, ChevronRight, FileText, Search, 
  Filter, X, Calendar, User, Gavel, BookOpen, AlertCircle, CheckCircle, Clock, 
  Scale, Briefcase, Users
} from 'lucide-react';
import { caseService } from '../../services/caseService';
import CaseDetailModal from './CaseDetailModal';

// --- MAIN TABLE ---
const AnalysisTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Default to 'COMPLETED' instead of 'ALL' since 'ALL' is removed
  const [filterStatus, setFilterStatus] = useState('COMPLETED'); 
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // If we removed 'ALL', we always send a specific status
      const response = await caseService.getCases(filterStatus, currentPage, 10);
      setData(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / 10));
    } catch (error) {
      console.error("Failed to fetch cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analysis");
    XLSX.writeFile(wb, "ITAT_Analysis_Report.xlsx");
  };

  const getStatusBadge = (status) => {
    const styles = {
      'COMPLETED': 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400',
      'PENDING': 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
      'FAILED': 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
    };
    const style = styles[status] || 'bg-zinc-100 text-zinc-600';
    const Icon = status === 'COMPLETED' ? CheckCircle : status === 'FAILED' ? AlertCircle : Clock;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${style}`}>
        <Icon size={12} /> {status}
      </span>
    );
  };

  return (
    <>
      <div className="flex flex-col w-full bg-white dark:bg-[#121214] rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 font-sans transition-colors duration-300">
        
        {/* Table Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-5 border-b border-slate-100 dark:border-zinc-800 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Case Analysis</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Live feed from ITAT Portal</p>
          </div>
          <div className="flex flex-wrap gap-3">
              <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-lg">
                 {/* REMOVED 'ALL' FROM HERE */}
                 {['COMPLETED', 'PENDING', 'FAILED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
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
              <button onClick={handleDownloadExcel} className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all text-sm font-medium shadow-sm">
                <Download size={16} className="text-emerald-600 dark:text-emerald-500" /> Export
              </button>
          </div>
        </div>

        {/* Table Content */}
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
                 <tr>
                    <td colSpan="7" className="py-20 text-center text-zinc-400 animate-pulse">
                        Loading live analysis data...
                    </td>
                 </tr>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedCase(item)} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                    
                    {/* 1. Added By */}
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-zinc-900 dark:text-white">{item.created_by}</span>
                           <span className="text-xs text-zinc-400">{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                    </td>

                    {/* 2. Date */}
                    <td className="px-6 py-4 whitespace-nowrap align-top text-sm text-zinc-600 dark:text-zinc-300">
                        {item.date_of_pronouncement}
                    </td>

                    {/* 3. Status */}
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                        {getStatusBadge(item.status)}
                    </td>

                    {/* 4. Case/Bench */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200 font-mono bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded w-fit mb-1">
                            {item.citation_number}
                        </span>
                        <span className="text-xs text-zinc-400">{item.bench_name} | AY: {item.assessment_year}</span>
                      </div>
                    </td>

                    {/* 5. Parties */}
                    <td className="px-6 py-4 align-top max-w-[200px]">
                      <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-slate-700 dark:text-zinc-200 truncate">{item.appellant}</span>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-wider">VS</span>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-zinc-400 truncate">{item.respondent}</span>
                      </div>
                    </td>

                    {/* 6. Coram */}
                    <td className="px-6 py-4 align-top max-w-[150px]">
                        <div className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                           <p className="truncate" title={item.judicial_member}><span className="font-bold">JM:</span> {item.judicial_member?.split(' ')[0]}..</p>
                           <p className="truncate" title={item.accountant_member}><span className="font-bold">AM:</span> {item.accountant_member?.split(' ')[0]}..</p>
                        </div>
                    </td>

                    {/* 7. Outcome */}
                    <td className="px-6 py-4 align-top">
                        <span className={`text-xs font-bold uppercase ${item.appeal_in_favor_of === 'Assessee' ? 'text-emerald-600' : 'text-zinc-500'}`}>
                           {item.appeal_in_favor_of}
                        </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 dark:text-zinc-600">
                      No cases found for {filterStatus.toLowerCase()}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-500">Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 transition-all text-zinc-600 dark:text-zinc-400">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 transition-all text-zinc-600 dark:text-zinc-400">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL - Renders when row is clicked */}
      {selectedCase && (
        <CaseDetailModal 
          data={selectedCase} 
          onClose={() => setSelectedCase(null)}
          onCaseUpdated={fetchData} // Refresh table after edit
        />
      )}
    </>
  );
};

export default AnalysisTable;