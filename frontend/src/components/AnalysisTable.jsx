import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react';

const AnalysisTable = ({ data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analysis");
    XLSX.writeFile(wb, "ITAT_Analysis_Report.xlsx");
  };

  return (
    // CONTAINER: Supports White (Light) and Zinc-900 (Dark)
    <div className="flex flex-col w-full bg-white dark:bg-[#121214] rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 font-sans transition-colors duration-300">
      
      {/* Header Section */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Case Analysis</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Processed {data.length} documents</p>
        </div>
        
        <div className="flex gap-3">
            {/* Search Input */}
            <div className="hidden md:flex items-center px-3 py-1.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-md transition-colors">
                <Search size={14} className="text-slate-400 dark:text-zinc-500 mr-2"/>
                <input 
                  type="text" 
                  placeholder="Search cases..." 
                  className="bg-transparent text-sm focus:outline-none text-slate-600 dark:text-zinc-300 placeholder-slate-400 dark:placeholder-zinc-600"
                />
            </div>

            {/* Export Button */}
            <button 
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all text-sm font-medium shadow-sm"
            >
            <Download size={16} className="text-emerald-600 dark:text-emerald-500" /> 
            Export Excel
            </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-zinc-900/50">
            <tr>
              {['Pronounced Date', 'Case Details', 'Parties', 'Key Summary'].map((header) => (
                <th key={header} className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 dark:text-zinc-500 uppercase border-b border-slate-200 dark:border-zinc-800">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                  
                  {/* Date Column */}
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <FileText size={14}/>
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-zinc-300">{item.date}</span>
                    </div>
                  </td>

                  {/* Case No Column */}
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200 font-mono bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded">
                        {item.caseNo}
                    </span>
                  </td>

                  {/* Parties Column */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">{item.appellant}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-wider border border-slate-200 dark:border-zinc-700 px-1 rounded">VS</span>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-zinc-400">{item.respondent}</span>
                    </div>
                  </td>

                  {/* Summary Column */}
                  <td className="px-6 py-4 align-top">
                    <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-2" title={item.summary}>
                        {item.summary}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-400 dark:text-zinc-600">
                    No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-500">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, data.length)} of {data.length}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all text-slate-600 dark:text-zinc-400"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">Page {currentPage}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-md hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all text-slate-600 dark:text-zinc-400"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTable;