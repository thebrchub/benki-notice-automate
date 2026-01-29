import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx-js-style'; // ✅ Uses styling library
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
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('COMPLETED'); 
  const [selectedCase, setSelectedCase] = useState(null);

  // --- EXPORT STATE ---
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDates, setExportDates] = useState({ start: '', end: '' });
  const [isExporting, setIsExporting] = useState(false);

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    fetchData();
  }, [currentPage, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await caseService.getCases(filterStatus, currentPage, 10);
      setData(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / 10));
    } catch (error) {
      console.error("Fetch failed", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status) => { 
      setFilterStatus(status); 
      setCurrentPage(1); 
  };

  // --- 2. EXCEL GENERATION HELPER ---
  const generateAndDownloadExcel = (dataset, filename) => {
    // A. Map Data
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
        "Appellant Representative": item.appellant_representative,
        "Departmental Representative": item.departmental_representative,
        "Appeal In Favor Of": item.appeal_in_favor_of,
        "Sections Involved": item.sections_involved,
        "Issues Involved": item.issues_involved,
        "Relevant Paragraphs": item.relevant_paragraphs,
        "Four Line Summary": item.four_line_summary,
        "Detailed Summary": item.detailed_summary,
        "Case Laws Referred": item.case_laws_referred,
        "Order PDF Link": item.order_link,
        "Created At": new Date(item.created_at).toLocaleString()
    }));

    // B. Create Sheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // C. Define Styles (Professional & Breathable)
    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11, name: "Arial" },
        fill: { fgColor: { rgb: "1F2937" } }, // Dark Grey Header
        alignment: { horizontal: "center", vertical: "center" },
        border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "medium", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        }
    };

    const bodyStyle = {
        font: { sz: 10, name: "Arial" },
        alignment: { vertical: "top", wrapText: true }, // Wrap text for breathability
        border: {
            bottom: { style: "thin", color: { rgb: "D1D5DB" } },
            left: { style: "thin", color: { rgb: "D1D5DB" } },
            right: { style: "thin", color: { rgb: "D1D5DB" } }
        }
    };

    // D. Apply Styles
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cell_address]) continue;

            // Apply Header or Body style
            ws[cell_address].s = (R === 0) ? headerStyle : bodyStyle;
        }
    }

    // E. Set Column Widths
    ws["!cols"] = [
        { wch: 6 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 20 }, 
        { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 25 },
        { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 30 },
        { wch: 40 }, { wch: 30 }, { wch: 50 }, { wch: 70 }, { wch: 40 },
        { wch: 40 }, { wch: 20 }
    ];

    // F. Save File
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ITAT Data");
    XLSX.writeFile(wb, filename);
  };

  // --- 3. EXPORT HANDLER ---
  const handleExportClick = async () => {
    setIsExporting(true);

    try {
        // CASE A: Date Range Selected (Bulk Export from API)
        if (exportDates.start && exportDates.end) {
            const rawData = await caseService.getByDateRange(exportDates.start, exportDates.end);
            
            if (!rawData || rawData.length === 0) {
                alert("No records found for this date range.");
            } else {
                generateAndDownloadExcel(rawData, `ITAT_Report_${exportDates.start}_${exportDates.end}.xlsx`);
                setShowExportModal(false);
            }
        } 
        // CASE B: No Dates (Export Current Page View)
        else {
            if (data.length === 0) {
                alert("No data on current page to export.");
            } else {
                generateAndDownloadExcel(data, `ITAT_Report_Current_Page_${currentPage}.xlsx`);
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
        {/* Header passes 'onExport' to open modal */}
        <AnalysisHeader 
          filterStatus={filterStatus}
          setFilterStatus={handleStatusChange}
          onDateFilter={null} 
          onExport={() => setShowExportModal(true)} 
          dataCount={data.length}
          onRefresh={fetchData} // ✅ Pass Refresh Function here
        />

        <AnalysisTable 
          data={data}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRowClick={setSelectedCase}
          onRefresh={fetchData} // ✅ Pass Refresh Function here too
        />
      </Card>

      {selectedCase && (
        <CaseDetailModal 
          data={selectedCase} 
          onClose={() => setSelectedCase(null)} 
          onCaseUpdated={fetchData} 
        />
      )}

      {/* --- EXPORT MODAL --- */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#18181b] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-95 duration-200">
                
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Download size={20} className="text-green-600"/> Export Data
                    </h3>
                    <button onClick={() => setShowExportModal(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Select a date range for <strong>Bulk Export</strong> (all records). 
                            <br/>
                            Leave dates empty to export <strong>Current View</strong> (visible rows).
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase">From Date (Optional)</label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black text-sm text-zinc-900 dark:text-white focus:ring-2 ring-green-500 outline-none [color-scheme:light] dark:[color-scheme:dark]"
                                    onChange={(e) => setExportDates({...exportDates, start: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase">To Date (Optional)</label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black text-sm text-zinc-900 dark:text-white focus:ring-2 ring-green-500 outline-none [color-scheme:light] dark:[color-scheme:dark]"
                                    onChange={(e) => setExportDates({...exportDates, end: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={handleExportClick}
                            disabled={isExporting}
                            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin"/> Processing...
                                </>
                            ) : (
                                <>
                                    Download Excel Report
                                </>
                            )}
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