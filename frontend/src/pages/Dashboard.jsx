// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import ITATViewer from '../components/ITATViewer';
import AnalysisTable from '../components/AnalysisTable';
import Sidebar from '../components/Sidebar';
import { Activity } from 'lucide-react';

const DUMMY_DATA = Array.from({ length: 25 }, (_, i) => ({
    date: '2025-01-15',
    caseNo: `ITAT/BEN/2025/${100 + i}`,
    appellant: 'Tech Corp Ltd',
    respondent: 'ACIT Circle 4(1)',
    summary: 'Appeal allowed in part regarding Section 80IA deductions...'
}));

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('portal'); 
  const [progress, setProgress] = useState(45);
  const [isProcessing, setIsProcessing] = useState(true);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      
      {/* 1. Sidebar (Sticky) */}
      <div className="sticky top-0 h-screen shrink-0 z-30">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header (Sticky) */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 h-16 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
                {activeTab === 'portal' ? 'Official Tribunal Portal' : 'Analysis Workspace'}
            </h2>
            
            {isProcessing && (
                <div className="flex items-center gap-3 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                    <Activity size={14} className="text-indigo-600 animate-spin" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-indigo-700">Processing Active</span>
                    </div>
                </div>
            )}
        </header>

        {/* Content Body */}
        {/* REMOVED generic padding (p-6) from here to let Iframe go edge-to-edge */}
        <main className="flex-1 relative">
            
            {/* --- VIEW 1: PORTAL (Edge-to-Edge) --- */}
            {/* We calculate height exactly so internal scroll works perfectly */}
            <div className={`${activeTab === 'portal' ? 'block' : 'hidden'} h-[calc(100vh-4rem)] w-full`}>
                <div className="h-full w-full overflow-hidden bg-white">
                    {/* Note: Ensure ITATViewer has 'h-full w-full' on its iframe tag */}
                    <ITATViewer />
                </div>
            </div>

            {/* --- VIEW 2: ANALYSIS (Padded & Flowing) --- */}
            {/* We Add the padding (p-6) here specifically for this view */}
            <div className={`${activeTab === 'analysis' ? 'block' : 'hidden'} flex flex-col gap-6 p-6`}>
                
                {isProcessing && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-700">Batch Processing Status</span>
                            <span className="text-sm font-bold text-indigo-600">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                            <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-700 shadow-md" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Analyzing PDFs... Please wait while we generate the summaries.
                        </p>
                    </div>
                )}

                <AnalysisTable data={DUMMY_DATA} />
            </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;