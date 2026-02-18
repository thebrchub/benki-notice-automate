import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx-js-style'; 
import { caseService } from '../services/caseService';
import { Download, X, Loader2 } from 'lucide-react'; 

// Import Components
import AnalysisHeader from '../components/analysis/AnalysisHeader';
import AnalysisTable from '../components/analysis/AnalysisTable';
import CaseDetailModal from '../components/analysis/CaseDetailModal';
import Card from '../components/Card'; 

const AnalysisPage = () => {
  // --- TABLE STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // ✅ NEW: State to hold the total number of records (e.g., 556)
  const [totalRecords, setTotalRecords] = useState(0);

  // Filters
  const [filterStatus, setFilterStatus] = useState('COMPLETED'); 
  
  // --- MODAL & NAVIGATION STATE ---
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Flag to indicate we are fetching data specifically for a modal navigation event
  const [navigationQueue, setNavigationQueue] = useState(null);

  // --- EXPORT STATE ---
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDates, setExportDates] = useState({ start: '', end: '' });
  const [isExporting, setIsExporting] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await caseService.getCases(filterStatus, currentPage, 10); 
      let newData = response.data || [];

      // ✅ FIX: Ensure every item has a unique key for React
      newData = newData.map((item, index) => ({
          ...item,
          _ui_key: item.id || item._id || `temp-${currentPage}-${index}`
      }));

      setData(newData);
      
      // ✅ CAPTURE TOTALS
      // Assuming backend sends: { data: [...], total: 556, limit: 10, page: 1 }
      const total = response.total || 0;
      setTotalRecords(total); 
      setTotalPages(Math.ceil(total / 10));

      // --- HANDLE POST-PAGE-LOAD NAVIGATION ---
      if (navigationQueue && newData.length > 0) {
          if (navigationQueue === 'NEXT_PAGE_START') {
              setSelectedCase(newData[0]);
              setSelectedIndex(0);
          } else if (navigationQueue === 'PREV_PAGE_END') {
              const lastIndex = newData.length - 1;
              setSelectedCase(newData[lastIndex]);
              setSelectedIndex(lastIndex);
          }
          setNavigationQueue(null); 
      }

    } catch (error) {
      console.error("Fetch failed", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CRITICAL FIX: Robust Index Finding
  const handleCaseClick = (clickedCase) => {
    if (!clickedCase) return;
    
    // 1. Try strict object reference
    let index = data.indexOf(clickedCase);

    // 2. If reference failed, try ID or UI Key
    if (index === -1) {
        index = data.findIndex(c => 
            (c.id && c.id === clickedCase.id) || 
            (c._id && c._id === clickedCase._id) ||
            (c._ui_key && c._ui_key === clickedCase._ui_key)
        );
    }

    // 3. Safety Net
    if (index === -1) {
        console.warn("Could not find index. Defaulting to 0.");
        index = 0; 
    }

    setSelectedIndex(index);
    setSelectedCase(clickedCase);
  };

  // --- NAVIGATION LOGIC ---
  const handleNextCase = () => {
    if (selectedIndex < data.length - 1) {
        const nextIndex = selectedIndex + 1;
        setSelectedIndex(nextIndex);
        setSelectedCase(data[nextIndex]);
    } 
    else if (currentPage < totalPages) {
        setNavigationQueue('NEXT_PAGE_START');
        setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevCase = () => {
    if (selectedIndex > 0) {
        const prevIndex = selectedIndex - 1;
        setSelectedIndex(prevIndex);
        setSelectedCase(data[prevIndex]);
    }
    else if (currentPage > 1) {
        setNavigationQueue('PREV_PAGE_END');
        setCurrentPage(prev => prev - 1);
    }
  };

  const handleStatusChange = (status) => { 
      setFilterStatus(status); 
      setCurrentPage(1); 
  };

  // --- EXCEL LOGIC ---
  const generateAndDownloadExcel = (dataset, filename) => {
    const exportData = dataset.map((item, index) => ({
        "Sr No": index + 1,
        "Created By": item.created_by,
        "Status": item.status,
        "Bench Name": item.bench_name,
        "Date of Pronouncement": item.date_of_pronouncement,
        "ITA Number": item.citation_number,
        "Assessment Year": item.assessment_year,
        "Appellant": item.appellant,
        "Respondent": item.respondent,
        "Judicial Member": item.judicial_member,
        "Accountant Member": item.accountant_member,
        "Appeal In Favor Of": item.appeal_in_favor_of,
        "Sections Involved": item.sections_involved,
        "Four Line Summary": item.four_line_summary,
        "Order PDF Link": item.order_link,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const headerStyle = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "1F2937" } } };
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 0, c: C });
        if (ws[address]) ws[address].s = headerStyle;
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ITAT Data");
    XLSX.writeFile(wb, filename);
  };

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
        if (exportDates.start && exportDates.end) {
            const rawData = await caseService.getByDateRange(exportDates.start, exportDates.end);
            if (!rawData || rawData.length === 0) {
                alert("No records found.");
            } else {
                generateAndDownloadExcel(rawData, `ITAT_Report_${exportDates.start}_${exportDates.end}.xlsx`);
                setShowExportModal(false);
            }
        } else {
            if (data.length === 0) {
                alert("No data to export.");
            } else {
                generateAndDownloadExcel(data, `ITAT_Report_Page_${currentPage}.xlsx`);
                setShowExportModal(false);
            }
        }
    } catch (error) {
        console.error("Export Error:", error);
        alert("Failed to export data.");
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      <Card className="overflow-hidden">
        <AnalysisHeader 
          filterStatus={filterStatus}
          setFilterStatus={handleStatusChange}
          onDateFilter={null} 
          onExport={() => setShowExportModal(true)} 
          dataCount={data.length}
          
          // ✅ PASSING THE TOTAL COUNT HERE
          totalCount={totalRecords} 
          
          onRefresh={fetchData} 
        />

        <AnalysisTable 
          data={data}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRowClick={handleCaseClick}
          onRefresh={fetchData} 
        />
      </Card>

      {/* ✅ MODAL WITH NAVIGATION PROPS */}
      {selectedCase && (
        <CaseDetailModal 
          data={selectedCase} 
          isLoading={loading && navigationQueue !== null}
          onClose={() => setSelectedCase(null)} 
          onCaseUpdated={fetchData} 
          onNext={handleNextCase}
          onPrev={handlePrevCase}
          
          isFirstOnPage={selectedIndex === 0}
          isLastOnPage={selectedIndex === data.length - 1}
          hasPrevPage={currentPage > 1}
          hasNextPage={currentPage < totalPages}

          hasNext={(selectedIndex < data.length - 1) || (currentPage < totalPages)}
          hasPrev={(selectedIndex > 0) || (currentPage > 1)}
        />
      )}

      {/* --- EXPORT MODAL --- */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#18181b] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Download size={20} className="text-green-600"/> Export Data
                    </h3>
                    <button onClick={() => setShowExportModal(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <p className="text-sm text-zinc-500">Select dates for Bulk Export or leave empty for Current Page.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">From</label>
                            <input type="date" className="w-full h-10 px-3 rounded-lg border dark:border-zinc-700 bg-white dark:bg-black text-sm text-zinc-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]" onChange={(e) => setExportDates({...exportDates, start: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">To</label>
                            <input type="date" className="w-full h-10 px-3 rounded-lg border dark:border-zinc-700 bg-white dark:bg-black text-sm text-zinc-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]" onChange={(e) => setExportDates({...exportDates, end: e.target.value})} />
                        </div>
                    </div>
                    <div className="pt-4">
                        <button onClick={handleExportClick} disabled={isExporting} className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            {isExporting ? <Loader2 size={18} className="animate-spin"/> : "Download Excel"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;