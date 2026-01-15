import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react';

const AnalysisTable = ({ data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // We can show more rows now since the page scrolls!

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
    // REMOVED: h-full, overflow-hidden. ADDED: w-full
    <div className="flex flex-col w-full bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Case Analysis</h3>
          <p className="text-xs text-slate-500 mt-1">Processed {data.length} documents</p>
        </div>
        
        <div className="flex gap-3">
            <div className="hidden md:flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md">
                <Search size={14} className="text-slate-400 mr-2"/>
                <input type="text" placeholder="Search cases..." className="bg-transparent text-sm focus:outline-none text-slate-600"/>
            </div>

            <button 
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium shadow-sm"
            >
            <Download size={16} className="text-emerald-600" /> 
            Export Excel
            </button>
        </div>
      </div>

      {/* Table Section - REMOVED internal overflow scrolling */}
      <div className="w-full">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase border-b border-slate-200">Pronounced Date</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase border-b border-slate-200">Case Details</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase border-b border-slate-200">Parties</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase border-b border-slate-200">Key Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
                            <FileText size={14}/>
                        </div>
                        <span className="text-sm font-medium text-slate-600">{item.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <span className="text-sm font-semibold text-slate-800 font-mono bg-slate-100 px-2 py-1 rounded">
                        {item.caseNo}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-700">{item.appellant}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wide">vs</span>
                        <span className="text-sm text-slate-600">{item.respondent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    {/* Allow summary to wrap naturally */}
                    <p className="text-sm text-slate-600 leading-relaxed" title={item.summary}>
                        {item.summary}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-400">
                    No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs font-medium text-slate-500">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, data.length)} of {data.length}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
          <span className="text-xs font-medium text-slate-600">Page {currentPage}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronRight size={18} className="text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTable;