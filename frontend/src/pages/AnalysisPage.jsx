import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { caseService } from '../services/caseService';

// Import Components
import AnalysisHeader from '../components/analysis/AnalysisHeader';
import AnalysisTable from '../components/analysis/AnalysisTable';
import CaseDetailModal from '../components/analysis/CaseDetailModal';
import Card from '../components/Card'; // <--- FIXED IMPORT

const AnalysisPage = () => {
  // ... (keep all your existing state and functions: data, loading, fetchData, handlers etc.) ...
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState(null);
  const [mode, setMode] = useState('STATUS');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchData();
  }, [currentPage, filterStatus, mode, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (mode === 'DATE') {
        const response = await caseService.getByDateRange(dateRange.start, dateRange.end);
        setData(response || []);
        setTotalPages(1);
      } else {
        const apiStatus = filterStatus === 'ALL' ? '' : filterStatus;
        const response = await caseService.getCases(apiStatus, currentPage, 10);
        setData(response.data || []);
        setTotalPages(Math.ceil((response.total || 0) / 10));
      }
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status) => {
    setMode('STATUS');
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleDateFilter = (start, end) => {
    setMode('DATE');
    setDateRange({ start, end });
    setFilterStatus(''); 
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analysis");
    XLSX.writeFile(wb, "ITAT_Analysis_Report.xlsx");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* UPDATED: Using the shared Card component */}
      <Card className="overflow-hidden">
        
        <AnalysisHeader 
          filterStatus={filterStatus}
          setFilterStatus={handleStatusChange}
          onDateFilter={handleDateFilter}
          onExport={handleExport}
          dataCount={data.length}
        />

        <AnalysisTable 
          data={data}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRowClick={setSelectedCase}
        />
      
      </Card>

      {selectedCase && (
        <CaseDetailModal 
          data={selectedCase} 
          onClose={() => setSelectedCase(null)} 
        />
      )}
    </div>
  );
};

export default AnalysisPage;