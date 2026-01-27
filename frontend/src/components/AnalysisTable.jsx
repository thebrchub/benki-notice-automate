import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Download, ChevronLeft, ChevronRight, FileText, Search, 
  Filter, X, Calendar, User, Gavel, BookOpen, AlertCircle, CheckCircle, Clock, 
  Scale, Briefcase, Users
} from 'lucide-react';
import { caseService } from '../services/caseService';

// --- DETAIL MODAL (Shows ALL Fields) ---
const CaseDetailModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#18181b] w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20">
                 {data.bench_name} Bench
               </span>
               <span className="text-xs font-medium text-zinc-500">AY: {data.assessment_year}</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{data.citation_number}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Status Bar */}
          <div className="flex flex-wrap gap-6 items-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  data.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                  data.status === 'FAILED' ? 'bg-red-100 text-red-700 border-red-200' :
                  'bg-blue-100 text-blue-700 border-blue-200'
                }`}>
                  {data.status}
                </span>
                <span className="text-sm text-zinc-500 flex items-center gap-1">
                  <Calendar size={14}/> Pronounced: {data.date_of_pronouncement}
                </span>
             </div>
             <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700"></div>
             <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <User size={14} /> Added by: <span className="font-bold">{data.created_by}</span>
             </div>
          </div>

          {/* Legal Team Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Left: Coram & Parties */}
             <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900/20 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                   <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <Gavel size={16} className="text-purple-500"/> Coram (Judges)
                   </h3>
                   <div className="space-y-3">
                      <div>
                         <span className="text-xs text-zinc-500 uppercase font-semibold">Judicial Member</span>
                         <p className="text-zinc-800 dark:text-zinc-200 font-medium">{data.judicial_member}</p>
                      </div>
                      <div>
                         <span className="text-xs text-zinc-500 uppercase font-semibold">Accountant Member</span>
                         <p className="text-zinc-800 dark:text-zinc-200 font-medium">{data.accountant_member}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white dark:bg-zinc-900/20 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                   <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <Briefcase size={16} className="text-blue-500"/> Representatives
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <span className="text-xs text-zinc-500 uppercase font-semibold">Appellant Rep</span>
                         <p className="text-zinc-800 dark:text-zinc-200 font-medium">{data.appellant_representative}</p>
                      </div>
                      <div>
                         <span className="text-xs text-zinc-500 uppercase font-semibold">Dept Rep</span>
                         <p className="text-zinc-800 dark:text-zinc-200 font-medium">{data.departmental_representative}</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right: Parties & Outcome */}
             <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900/20 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                   <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <Users size={16} className="text-orange-500"/> Parties
                   </h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-start border-b border-dashed border-zinc-200 dark:border-zinc-700 pb-3">
                         <div>
                            <span className="text-xs text-zinc-500 uppercase font-semibold">Appellant</span>
                            <p className="text-lg font-bold text-zinc-900 dark:text-white">{data.appellant}</p>
                         </div>
                      </div>
                      <div className="flex justify-between items-start pt-1">
                         <div>
                            <span className="text-xs text-zinc-500 uppercase font-semibold">Respondent</span>
                            <p className="text-lg font-bold text-zinc-900 dark:text-white">{data.respondent}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800">
                   <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-400 mb-2 flex items-center gap-2">
                      <Scale size={16}/> Final Outcome
                   </h3>
                   <p className="text-lg font-medium text-emerald-800 dark:text-emerald-200">
                      Appeal in favor of: <span className="font-bold uppercase">{data.appeal_in_favor_of}</span>
                   </p>
                </div>
             </div>
          </div>

          {/* Legal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                      <BookOpen size={16}/> Sections Involved
                  </h4>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-mono text-zinc-700 dark:text-zinc-300">
                      {data.sections_involved}
                  </div>
              </div>
              <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                      <Scale size={16}/> Case Laws Referred
                  </h4>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm italic text-zinc-700 dark:text-zinc-300">
                      {data.case_laws_referred}
                  </div>
              </div>
          </div>

          {/* Summaries */}
          <div className="space-y-6">
             <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Issues Involved</h3>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  {data.issues_involved}
                </p>
             </div>
             
             <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Relevant Paragraphs</h3>
                <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-2">{data.relevant_paragraphs}</p>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-sm font-bold text-zinc-500 uppercase mb-3">Detailed Summary</h4>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                        {data.detailed_summary}
                    </p>
                </div>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-3">
           <a href={data.order_link} target="_blank" rel="noreferrer" className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
             View Official Order (PDF)
           </a>
           <button onClick={onClose} className="px-6 py-2 text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90">
             Close Report
           </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN TABLE ---
const AnalysisTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiStatus = filterStatus === 'ALL' ? '' : filterStatus;
      const response = await caseService.getCases(apiStatus, currentPage, 10);
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
                 {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                        filterStatus === status 
                        ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm' 
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
                      }`}
                    >
                      {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
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
                {/* 1. CREATED BY (First Column as requested) */}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Added By</th>
                {/* 2. Date */}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Date</th>
                {/* 3. Status */}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Status</th>
                {/* 4. Case Details */}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Case / Bench</th>
                {/* 5. Parties */}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Parties</th>
                {/* 6. Coram (NEW) */}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">Coram</th>
                {/* 7. Outcome (NEW) */}
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

                    {/* 6. Coram (New Column) */}
                    <td className="px-6 py-4 align-top max-w-[150px]">
                       <div className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                          <p className="truncate" title={item.judicial_member}><span className="font-bold">JM:</span> {item.judicial_member?.split(' ')[0]}..</p>
                          <p className="truncate" title={item.accountant_member}><span className="font-bold">AM:</span> {item.accountant_member?.split(' ')[0]}..</p>
                       </div>
                    </td>

                    {/* 7. Outcome (New Column) */}
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
                      No cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer - Keeping original simple logic */}
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
        />
      )}
    </>
  );
};

export default AnalysisTable;