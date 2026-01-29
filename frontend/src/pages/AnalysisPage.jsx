import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { caseService } from '../services/caseService';

// Import Components
import AnalysisHeader from '../components/analysis/AnalysisHeader';
import AnalysisTable from '../components/analysis/AnalysisTable';
import CaseDetailModal from '../components/analysis/CaseDetailModal';
import Card from '../components/Card'; 

const AnalysisPage = () => {
  // --- STATE MANAGEMENT ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Default status 'COMPLETED' to ensure data shows up initially
  const [filterStatus, setFilterStatus] = useState('COMPLETED'); 
  
  const [selectedCase, setSelectedCase] = useState(null);
  const [mode, setMode] = useState('STATUS'); // 'STATUS' or 'DATE'
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // --- DATA FETCHING ---
  useEffect(() => {
    fetchData();
  }, [currentPage, filterStatus, mode, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (mode === 'DATE') {
        const response = await caseService.getByDateRange(
          dateRange.start,
          dateRange.end
        );
        // Date range endpoint usually returns a raw list, not paginated object
        setData(response || []); 
        setTotalPages(1); 
      } else {
        // Status Mode
        // ✅ NOW THIS WILL WORK because caseService.getCases exists
        const response = await caseService.getCases(
          filterStatus,
          currentPage,
          10
        );
        setData(response.data || []);
        setTotalPages(Math.ceil((response.total || 0) / 10));
      }
    } catch (error) {
      console.error("Fetch failed", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleStatusChange = (status) => {
    setMode('STATUS');
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleDateFilter = (start, end) => {
    setMode('DATE');
    setDateRange({ start, end });
    setFilterStatus(''); // Clear status visual
  };

  const handleExport = () => {
    if (!data || data.length === 0) {
        alert("No data to export!");
        return;
    }

    const exportData = data.map((item, index) => ({
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

    const ws = XLSX.utils.json_to_sheet(exportData);

    // -- Excel Formatting (Header Styling) --
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1F2937" } }, // Dark header
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // -- Column Widths --
    ws["!cols"] = [
      { wch: 6 },  { wch: 15 }, { wch: 12 }, { wch: 14 }, { wch: 20 }, 
      { wch: 22 }, { wch: 16 }, { wch: 30 }, { wch: 30 }, { wch: 22 }, 
      { wch: 22 }, { wch: 25 }, { wch: 25 }, { wch: 18 }, { wch: 30 }, 
      { wch: 40 }, { wch: 25 }, { wch: 35 }, { wch: 60 }, { wch: 35 }, 
      { wch: 40 }, { wch: 22 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ITAT Analysis");
    XLSX.writeFile(wb, "ITAT_Analysis_Report.xlsx");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      <Card className="overflow-hidden">
        
        {/* Header with Filters & Export */}
        <AnalysisHeader 
          filterStatus={filterStatus}
          setFilterStatus={handleStatusChange}
          onDateFilter={handleDateFilter}
          onExport={handleExport}
          dataCount={data.length}
        />

        {/* Table Display */}
        <AnalysisTable 
          data={data}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRowClick={setSelectedCase}
        />
      
      </Card>

      {/* Detail Modal */}
      {selectedCase && (
        <CaseDetailModal 
          data={selectedCase} 
          onClose={() => setSelectedCase(null)} 
          onCaseUpdated={fetchData} 
        />
      )}
    </div>
  );
};

export default AnalysisPage;