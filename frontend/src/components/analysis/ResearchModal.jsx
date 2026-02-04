import React, { useEffect, useRef, useState } from 'react';
import { 
  X, ChevronLeft, ChevronRight, FileText, Gavel, Scale, 
  Bookmark, Briefcase, Users, Calendar, User, Clock, 
  Maximize2, Minimize2, BookOpen 
} from 'lucide-react';

const ResearchModal = ({ 
  isOpen, 
  onClose, 
  cases, 
  currentIndex, 
  setCurrentIndex 
}) => {
  const activeCase = cases[currentIndex];
  const scrollRef = useRef(null);
  
  // State for Fullscreen Detailed Summary
  const [isFullSummary, setIsFullSummary] = useState(false);

  // Auto-scroll the left sidebar
  useEffect(() => {
    if (scrollRef.current) {
        const activeItem = scrollRef.current.children[currentIndex];
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
  }, [currentIndex]);

  if (!isOpen || !activeCase) return null;

  const handleNext = () => {
    if (currentIndex < cases.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // --- FULL SCREEN SUMMARY SUB-COMPONENT ---
  const FullScreenSummary = () => (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-[#09090b] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-blue-500"/> Detailed Summary (Full View)
            </h2>
            <button 
                onClick={() => setIsFullSummary(false)} 
                className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-sm font-bold hover:opacity-80 transition-opacity"
            >
                <Minimize2 size={16} /> Close Fullscreen
            </button>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 leading-loose whitespace-pre-line text-lg">
                    {activeCase.detailed_summary || 'No summary available.'}
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <>
    {isFullSummary && <FullScreenSummary />}

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* FULL SCREEN CONTAINER */}
      <div className="bg-white dark:bg-[#09090b] w-[95vw] h-[90vh] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
        
        {/* --- 1. HEADER (Navigation & Close) --- */}
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-zinc-50/50 dark:bg-zinc-900/50">
           <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                 <Scale size={20} className="text-blue-600"/> 
                 Legal Analysis View
              </h2>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">
                 Case {currentIndex + 1} of {cases.length}
              </span>
           </div>

           <div className="flex items-center gap-3">
              {/* Prev/Next Buttons */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                 <button 
                    onClick={handlePrev} 
                    disabled={currentIndex === 0}
                    className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md disabled:opacity-30 transition-all"
                 >
                    <ChevronLeft size={18} />
                 </button>
                 <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                 <button 
                    onClick={handleNext} 
                    disabled={currentIndex === cases.length - 1}
                    className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md disabled:opacity-30 transition-all"
                 >
                    <ChevronRight size={18} />
                 </button>
              </div>

              <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                 <X size={20} />
              </button>
           </div>
        </div>

        {/* --- 2. MAIN BODY (Split View) --- */}
        <div className="flex-1 flex overflow-hidden">
           
           {/* LEFT PANEL: CASE LIST */}
           <div className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#121214] flex flex-col">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                 <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Filtered Cases</p>
              </div>
              
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1">
                 {cases.map((c, idx) => (
                    <button 
                       key={idx}
                       onClick={() => setCurrentIndex(idx)}
                       className={`w-full text-left p-3 rounded-xl text-sm transition-all border border-transparent ${
                          idx === currentIndex 
                          ? 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm ring-1 ring-blue-500/20' 
                          : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
                       }`}
                    >
                       <div className="font-bold text-zinc-900 dark:text-zinc-200 truncate mb-1">{c.party_name}</div>
                       <div className="flex justify-between items-center text-[10px] text-zinc-500">
                          <span>{c.citation_number}</span>
                          <span className={`px-1.5 py-0.5 rounded ${c.outcome === 'Allowed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {c.outcome}
                          </span>
                       </div>
                    </button>
                 ))}
              </div>
           </div>

           {/* RIGHT PANEL: DETAILS (Styled like CaseDetailModal) */}
           <div className="flex-1 overflow-y-auto bg-white dark:bg-[#09090b] p-8 md:p-12 space-y-8">
              
              {/* --- Top Header Info --- */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20">
                        {activeCase.bench_name} Bench
                    </span>
                    <span className="text-xs font-medium text-zinc-500">AY: {activeCase.assessment_year}</span>
                </div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white leading-tight">
                    {activeCase.citation_number}
                </h2>
              </div>

              {/* --- Meta Data Bar --- */}
              <div className="flex flex-wrap gap-6 items-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                 <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      activeCase.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      activeCase.status === 'FAILED' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-blue-100 text-blue-700 border-blue-200'
                    }`}>
                      {activeCase.status}
                    </span>
                    
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Calendar size={14}/> 
                        <span className="hidden sm:inline">Pronounced:</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{activeCase.date_of_pronouncement}</span>
                    </div>
                 </div>

                 <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700"></div>
                 <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <User size={14} /> Added by: <span className="font-bold">{activeCase.created_by}</span>
                 </div>
              </div>

              {/* --- Legal Team Grid --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Coram & Representatives */}
                 <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900/20 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                           <Gavel size={16} className="text-purple-500"/> Coram (Judges)
                        </h3>
                        <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <div><span className="font-semibold text-zinc-500 text-xs uppercase">Judicial:</span> {activeCase.judicial_member || 'N/A'}</div>
                            <div><span className="font-semibold text-zinc-500 text-xs uppercase">Accountant:</span> {activeCase.accountant_member || 'N/A'}</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/20 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                           <Briefcase size={16} className="text-blue-500"/> Representatives
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                           <div>
                              <span className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Appellant Rep</span>
                              {activeCase.appellant_representative || 'N/A'}
                           </div>
                           <div>
                              <span className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Dept Rep</span>
                              {activeCase.departmental_representative || 'N/A'}
                           </div>
                        </div>
                    </div>
                 </div>

                 {/* Parties & Outcome */}
                 <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900/20 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                           <Users size={16} className="text-orange-500"/> Parties
                        </h3>
                        <div className="space-y-4">
                           <div className="border-b border-dashed border-zinc-200 dark:border-zinc-700 pb-3">
                              <span className="text-xs text-zinc-500 uppercase font-semibold">Appellant</span>
                              <p className="text-zinc-900 dark:text-white font-medium">{activeCase.appellant}</p>
                           </div>
                           <div>
                              <span className="text-xs text-zinc-500 uppercase font-semibold">Respondent</span>
                              <p className="text-zinc-900 dark:text-white font-medium">{activeCase.respondent}</p>
                           </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800">
                        <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-400 mb-2 flex items-center gap-2">
                           <Scale size={16}/> Final Outcome
                        </h3>
                        <p className="text-lg font-normal text-emerald-800 dark:text-emerald-200">
                           Appeal in favor of: <span className="font-bold uppercase">{activeCase.appeal_in_favor_of}</span>
                        </p>
                    </div>
                 </div>
              </div>

              {/* --- Legal Details (Sections & Case Laws) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                          <BookOpen size={16}/> Sections Involved
                      </h4>
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-mono text-zinc-700 dark:text-zinc-300 flex flex-wrap gap-2">
                           {/* SAFE RENDER: Handle string or array */}
                           {(() => {
                               let sections = [];
                               if (Array.isArray(activeCase.sections_involved)) sections = activeCase.sections_involved;
                               else if (typeof activeCase.sections_involved === 'string') sections = activeCase.sections_involved.split(',');
                               
                               return sections.length > 0 ? sections.map((sec, i) => (
                                   <span key={i} className="bg-white dark:bg-black px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700">
                                       {sec.trim()}
                                   </span>
                               )) : 'N/A';
                           })()}
                      </div>
                  </div>
                  <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                          <Scale size={16}/> Case Laws Referred
                      </h4>
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm italic text-zinc-700 dark:text-zinc-300">
                          {activeCase.case_laws_referred || 'None'}
                      </div>
                  </div>
              </div>

              {/* --- Summaries Section --- */}
              <div className="space-y-6">
                 <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                        <FileText size={20} className="text-blue-500" /> Quick Summary
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed">
                        {activeCase.four_line_summary}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Issues Involved</h3>
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                        {activeCase.issues_involved}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Relevant Paragraphs</h3>
                    <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-2">
                        {activeCase.relevant_paragraphs}
                    </p>
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 relative group">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-bold text-zinc-500 uppercase">Detailed Summary</h4>
                            <button 
                                onClick={() => setIsFullSummary(true)} 
                                className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                title="Open Fullscreen"
                            >
                                <Maximize2 size={16} />
                            </button>
                        </div>
                        <div className="text-zinc-700 dark:text-zinc-300 text-sm leading-loose whitespace-pre-line">
                            {activeCase.detailed_summary}
                        </div>
                    </div>
                 </div>
              </div>

              {/* Footer PDF Link */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end">
                <a href={activeCase.order_link} target="_blank" rel="noreferrer" className="px-6 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
                    View Official Order (PDF)
                </a>
              </div>

           </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default ResearchModal;