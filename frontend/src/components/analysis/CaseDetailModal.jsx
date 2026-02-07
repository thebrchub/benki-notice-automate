import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, User, Gavel, BookOpen, Briefcase, Users, Scale, 
  Edit2, Save, RotateCcw, AlertCircle, Loader2, Clock, FileText, 
  Maximize2, Minimize2, Download, ChevronLeft, ChevronRight, CheckCircle,
  ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import { caseService } from '../../services/caseService';
import { generateCasePDF } from '../utils/casePdfGenerator'; 

// --- SMART TEXT FORMATTER ---
const FormattedSummary = ({ text }) => {
    if (!text) return <span className="text-zinc-400 italic">No detailed summary available.</span>;

    const paragraphs = text.split('\n').filter(p => p.trim() !== "");

    return (
        <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">
            {paragraphs.map((para, index) => {
                const keywordRegex = /^(Facts|Arguments|Observation|Conclusion|Held|Decision|Note|Issue|Observations|Ratio\/Reasoning)[:\s-]/i;
                const match = para.match(keywordRegex);

                if (match) {
                    const keyword = match[0]; 
                    const content = para.replace(keyword, "").trim();
                    return (
                        <div key={index} className="mb-2">
                            <span className="font-bold text-zinc-900 dark:text-white block mb-1 underline decoration-zinc-300 underline-offset-4">
                                {keyword}
                            </span>
                            <p>{content}</p>
                        </div>
                    );
                }
                return <p key={index}>{para}</p>;
            })}
        </div>
    );
};

// --- CUSTOM TOAST ---
const Toast = ({ message, onClose }) => (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[70] bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 border border-zinc-800">
        <CheckCircle size={18} className="text-emerald-500" />
        <span className="text-sm font-bold">{message}</span>
    </div>
);

const CaseDetailModal = ({ 
    data, 
    isLoading, 
    onClose, 
    onCaseUpdated, 
    onNext, 
    onPrev, 
    hasNext, 
    hasPrev,
    isFirstOnPage,
    isLastOnPage,
    hasPrevPage,
    hasNextPage
}) => {
  if (!data) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isFullSummary, setIsFullSummary] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // ✅ NEW: PDF Generation State
  const [pdfStatus, setPdfStatus] = useState('IDLE'); // 'IDLE' | 'GENERATING' | 'DONE'

  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'ADMIN';
  const canEdit = isAdmin && data.status === 'COMPLETED';

  useEffect(() => {
    setEditData(data);
    setIsEditing(false);
    setPdfStatus('IDLE'); // Reset PDF status when data changes
  }, [data]);

  // --- KEYBOARD NAVIGATION ---
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (isEditing || isLoading) return; 

        if (e.key === 'ArrowRight' && hasNext) onNext();
        if (e.key === 'ArrowLeft' && hasPrev) onPrev();
        if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, hasNext, hasPrev, onClose, isEditing, isLoading]);

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = { ...editData, order_link: data.order_link };
      await caseService.updateCase(payload);
      setIsEditing(false);
      if (onCaseUpdated) onCaseUpdated();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); 
    } catch (err) {
      setError(err.response?.data || "Failed to update case.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ NEW: Handle PDF Download with Animation
  const handleDownloadPDF = async () => {
      if (pdfStatus !== 'IDLE') return; // Prevent double click

      setPdfStatus('GENERATING');
      try {
          await generateCasePDF(data);
          setPdfStatus('DONE');
          
          // Revert to IDLE after 3 seconds
          setTimeout(() => {
              setPdfStatus('IDLE');
          }, 3000);
      } catch (error) {
          console.error("PDF Generation failed", error);
          setPdfStatus('IDLE');
      }
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
    setError('');
  };

  const renderEditableInput = (field, value, placeholder, isTextArea = false) => {
    if (!isEditing) {
        return <p className="text-zinc-800 dark:text-zinc-200 font-normal leading-relaxed whitespace-pre-line">{value || 'N/A'}</p>;
    }
    const commonClasses = "w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-2 text-sm text-zinc-900 dark:text-white focus:ring-2 ring-blue-500 outline-none transition-all";
    return isTextArea ? (
        <textarea value={value || ''} onChange={(e) => handleInputChange(field, e.target.value)} className={`${commonClasses} min-h-[100px] h-full resize-y`} placeholder={placeholder} />
    ) : (
        <input type="text" value={value || ''} onChange={(e) => handleInputChange(field, e.target.value)} className={commonClasses} placeholder={placeholder} />
    );
  };

  const FullScreenSummary = () => (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-[#09090b] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2"><FileText size={20} className="text-blue-500"/> Detailed Summary (Full View)</h2>
            <button onClick={() => setIsFullSummary(false)} className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-sm font-bold hover:opacity-80 transition-opacity"><Minimize2 size={16} /> Close</button>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto h-full">
                {isEditing ? (
                    <textarea value={editData.detailed_summary || ''} onChange={(e) => handleInputChange('detailed_summary', e.target.value)} className="w-full h-full min-h-[80vh] p-6 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-base font-mono focus:ring-2 ring-blue-500 outline-none" />
                ) : (
                    <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 leading-loose whitespace-pre-line text-lg"><FormattedSummary text={editData.detailed_summary} /></div>
                )}
            </div>
        </div>
    </div>
  );

  const showPrevPageIcon = isFirstOnPage && hasPrevPage;
  const showNextPageIcon = isLastOnPage && hasNextPage;

  return (
    <>
    {isFullSummary && <FullScreenSummary />}
    {showToast && <Toast message="Case updated successfully!" onClose={() => setShowToast(false)} />}

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#18181b] w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-95 duration-200 relative">
        
        {isLoading && (
            <div className="absolute inset-0 z-[60] bg-white/90 dark:bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                <Loader2 size={48} className="animate-spin text-blue-600 mb-4"/>
                <p className="text-base font-bold text-zinc-600 dark:text-zinc-300 animate-pulse">Fetching Next Page...</p>
            </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20">{data.bench_name} Bench</span>
               <span className="text-xs font-medium text-zinc-500">AY: {data.assessment_year}</span>
            </div>
            {isEditing ? (
                <input className="text-xl font-bold text-zinc-900 dark:text-white bg-transparent border-b border-zinc-300 focus:outline-none w-full" value={editData.citation_number} onChange={(e) => handleInputChange('citation_number', e.target.value)} />
            ) : (
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white truncate" title={data.citation_number}>{data.citation_number}</h2>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Navigation Buttons */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 mr-2 border border-zinc-200 dark:border-zinc-700">
                
                {/* PREVIOUS BUTTON */}
                <button 
                    onClick={onPrev} 
                    disabled={!hasPrev || isLoading} 
                    className="p-1.5 hover:bg-white dark:hover:bg-zinc-600 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all text-zinc-700 dark:text-zinc-300" 
                    title={showPrevPageIcon ? "Load Previous Page" : "Previous Case"}
                >
                    {showPrevPageIcon ? <ChevronsLeft size={18} className="text-blue-600 dark:text-blue-400"/> : <ChevronLeft size={18} />}
                </button>
                
                <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                
                {/* NEXT BUTTON */}
                <button 
                    onClick={onNext} 
                    disabled={!hasNext || isLoading} 
                    className="p-1.5 hover:bg-white dark:hover:bg-zinc-600 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all text-zinc-700 dark:text-zinc-300" 
                    title={showNextPageIcon ? "Load Next Page" : "Next Case"}
                >
                      {showNextPageIcon ? <ChevronsRight size={18} className="text-blue-600 dark:text-blue-400"/> : <ChevronRight size={18} />}
                </button>

            </div>

            {canEdit && !isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90"><Edit2 size={14} /> Edit</button>
            )}

            {isEditing && (
                <div className="flex gap-2">
                    <button onClick={handleCancel} disabled={saving} className="p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg"><RotateCcw size={18} /></button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700">{saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14} />} Save</button>
                </div>
            )}

            <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-700 mx-2"></div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500"><X size={24} /></button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 relative">
          
          {error && <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}

          {/* Status Bar */}
          <div className="flex flex-wrap gap-6 items-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${data.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>{data.status}</span>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Calendar size={14}/> 
                    <span className="hidden sm:inline">Pronounced:</span>
                    {isEditing ? (
                        <input type="date" value={editData.date_of_pronouncement} onChange={(e) => handleInputChange('date_of_pronouncement', e.target.value)} className="bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-900 dark:text-white outline-none focus:border-blue-500 [color-scheme:light] dark:[color-scheme:dark]" />
                    ) : (
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{data.date_of_pronouncement}</span>
                    )}
                </div>
             </div>
             <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700"></div>
             <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2"><User size={14} /> Added by: <span className="font-bold">{data.created_by}</span></div>
             <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700"></div>
             <div className="text-sm text-zinc-500 flex items-center gap-2"><Clock size={14} /> Analyzed: {new Date(data.created_at).toLocaleDateString()}</div>
          </div>

          {/* Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Left Column */}
             <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900/20 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                   <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2"><Gavel size={16} className="text-purple-500"/> Coram (Judges)</h3>
                   <div className="space-y-3">
                      <div><span className="text-xs text-zinc-500 font-semibold uppercase block mb-1">Judicial Member</span>{renderEditableInput('judicial_member', editData.judicial_member, "Name")}</div>
                      <div><span className="text-xs text-zinc-500 font-semibold uppercase block mb-1">Accountant Member</span>{renderEditableInput('accountant_member', editData.accountant_member, "Name")}</div>
                   </div>
                </div>
                <div className="bg-white dark:bg-zinc-900/20 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                   <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2"><Briefcase size={16} className="text-blue-500"/> Representatives</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-xs text-zinc-500 font-semibold uppercase block mb-1">Appellant Rep</span>{renderEditableInput('appellant_representative', editData.appellant_representative, "Name")}</div>
                      <div><span className="text-xs text-zinc-500 font-semibold uppercase block mb-1">Dept Rep</span>{renderEditableInput('departmental_representative', editData.departmental_representative, "Name")}</div>
                   </div>
                </div>
             </div>

             {/* Right Column */}
             <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900/20 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                   <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2"><Users size={16} className="text-orange-500"/> Parties</h3>
                   <div className="space-y-4">
                      <div className="border-b border-dashed border-zinc-200 dark:border-zinc-700 pb-3"><span className="text-xs text-zinc-500 font-semibold uppercase block mb-1">Appellant</span>{renderEditableInput('appellant', editData.appellant, "Name")}</div>
                      <div><span className="text-xs text-zinc-500 font-semibold uppercase block mb-1">Respondent</span>{renderEditableInput('respondent', editData.respondent, "Name")}</div>
                   </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800">
                   <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-400 mb-2 flex items-center gap-2"><Scale size={16}/> Final Outcome</h3>
                   {isEditing ? (
                       <select value={editData.appeal_in_favor_of} onChange={(e) => handleInputChange('appeal_in_favor_of', e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-black text-sm">
                           <option value="Assessee">Assessee</option><option value="Revenue">Revenue</option><option value="Remanded">Remanded</option><option value="Partly Allowed">Partly Allowed</option>
                       </select>
                   ) : (
                       <p className="text-lg font-normal text-emerald-800 dark:text-emerald-200">Appeal in favor of: <span className="font-bold uppercase">{data.appeal_in_favor_of}</span></p>
                   )}
                </div>
             </div>
          </div>

          {/* Legal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><BookOpen size={16}/> Sections Involved</h4>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-mono text-zinc-700 dark:text-zinc-300">{renderEditableInput('sections_involved', editData.sections_involved, "e.g. Section 143(3)")}</div>
              </div>
              <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><Scale size={16}/> Case Laws Referred</h4>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm italic text-zinc-700 dark:text-zinc-300">{renderEditableInput('case_laws_referred', editData.case_laws_referred, "e.g. CIT vs ABC", true)}</div>
              </div>
          </div>

          {/* Summaries */}
          <div className="space-y-6">
              <div>
                 <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Quick Summary</h3>
                 <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800">{renderEditableInput('four_line_summary', editData.four_line_summary, "Summary...", true)}</div>
              </div>
              
              <div>
                 <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Detailed Summary</h3>
                 <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 relative group">
                     <div className="flex justify-between items-center mb-3">
                         <button onClick={() => setIsFullSummary(true)} className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Maximize2 size={16} /></button>
                     </div>
                     {isEditing ? (
                         <textarea value={editData.detailed_summary || ''} onChange={(e) => handleInputChange('detailed_summary', e.target.value)} className="w-full min-h-[200px] p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black text-sm font-mono" />
                     ) : (
                         <FormattedSummary text={editData.detailed_summary} />
                     )}
                 </div>
              </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-3">
           
           {/* ✅ UPDATED: PDF BUTTON */}
           <button 
                onClick={handleDownloadPDF} 
                disabled={pdfStatus !== 'IDLE'}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                    pdfStatus === 'DONE' 
                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
                }`}
           >
                {pdfStatus === 'IDLE' && <><Download size={16} /> PDF</>}
                {pdfStatus === 'GENERATING' && <><Loader2 size={16} className="animate-spin" /> Generating...</>}
                {pdfStatus === 'DONE' && <><CheckCircle size={16} /> Done</>}
           </button>

           <a href={data.order_link} target="_blank" rel="noreferrer" className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">View Order</a>
           <button onClick={onClose} className="px-6 py-2 text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90">Close</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CaseDetailModal;