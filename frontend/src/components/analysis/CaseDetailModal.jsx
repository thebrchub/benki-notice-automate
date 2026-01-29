// src/components/analysis/CaseDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Gavel, BookOpen, Briefcase, Users, Scale, Edit2, Save, RotateCcw, AlertCircle, Loader2, Clock, FileText } from 'lucide-react';
import { caseService } from '../../services/caseService';

const CaseDetailModal = ({ data, onClose, onCaseUpdated }) => {
  if (!data) return null;

  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'ADMIN';
  const canEdit = isAdmin && data.status === 'COMPLETED';

  useEffect(() => {
    setEditData(data);
  }, [data]);

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...editData,
        order_link: data.order_link, // Primary Key
      };
      await caseService.updateCase(payload);
      setIsEditing(false);
      if (onCaseUpdated) onCaseUpdated();
      alert("Case details updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      setError(err.response?.data || "Failed to update case.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
    setError('');
  };

  // --- HELPER FOR INPUT FIELDS ---
  const renderEditableInput = (field, value, placeholder, isTextArea = false) => {
    if (!isEditing) {
        return <p className="text-zinc-800 dark:text-zinc-200 font-medium whitespace-pre-line">{value || 'N/A'}</p>;
    }
    
    const commonClasses = "w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-2 text-sm text-zinc-900 dark:text-white focus:ring-2 ring-blue-500 outline-none transition-all";

    if (isTextArea) {
        return (
            <textarea 
                value={value || ''} 
                onChange={(e) => handleInputChange(field, e.target.value)}
                className={`${commonClasses} min-h-[100px]`}
                placeholder={placeholder}
            />
        );
    }
    return (
        <input 
            type="text" 
            value={value || ''} 
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={commonClasses}
            placeholder={placeholder}
        />
    );
  };

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
            
            {isEditing ? (
                <input 
                    className="text-xl font-bold text-zinc-900 dark:text-white bg-transparent border-b border-zinc-300 focus:outline-none focus:border-blue-500 w-full"
                    value={editData.citation_number}
                    onChange={(e) => handleInputChange('citation_number', e.target.value)}
                />
            ) : (
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{data.citation_number}</h2>
            )}
          </div>

          <div className="flex items-center gap-2">
            {canEdit && !isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90">
                    <Edit2 size={14} /> Edit Case
                </button>
            )}

            {isEditing && (
                <div className="flex gap-2">
                    <button onClick={handleCancel} disabled={saving} className="p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg">
                        <RotateCcw size={18} />
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700">
                        {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>
            )}

            <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-700 mx-2"></div>

            <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {error && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
            </div>
          )}

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
             
             {/* ✅ ADDED: Created At Timestamp */}
             <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700"></div>
             <div className="text-sm text-zinc-500 flex items-center gap-2">
                <Clock size={14} /> Analyzed: {new Date(data.created_at).toLocaleDateString()}
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
                         {renderEditableInput('judicial_member', editData.judicial_member, "Enter Judicial Member Name")}
                      </div>
                      <div>
                         <span className="text-xs text-zinc-500 uppercase font-semibold">Accountant Member</span>
                         {renderEditableInput('accountant_member', editData.accountant_member, "Enter Accountant Member Name")}
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
                         {renderEditableInput('appellant_representative', editData.appellant_representative, "Advocate Name")}
                      </div>
                      <div>
                         <span className="text-xs text-zinc-500 uppercase font-semibold">Dept Rep</span>
                         {renderEditableInput('departmental_representative', editData.departmental_representative, "Dept Rep Name")}
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
                         <div className="w-full">
                            <span className="text-xs text-zinc-500 uppercase font-semibold">Appellant</span>
                            {renderEditableInput('appellant', editData.appellant, "Appellant Name")}
                         </div>
                      </div>
                      <div className="flex justify-between items-start pt-1">
                         <div className="w-full">
                            <span className="text-xs text-zinc-500 uppercase font-semibold">Respondent</span>
                            {renderEditableInput('respondent', editData.respondent, "Respondent Name")}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800">
                   <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-400 mb-2 flex items-center gap-2">
                      <Scale size={16}/> Final Outcome
                   </h3>
                   {isEditing ? (
                       <div>
                           <label className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">In Favor Of:</label>
                           <select 
                               value={editData.appeal_in_favor_of} 
                               onChange={(e) => handleInputChange('appeal_in_favor_of', e.target.value)}
                               className="mt-1 w-full p-2 rounded border border-emerald-300 bg-white dark:bg-black dark:text-white text-sm"
                           >
                               <option value="Assessee">Assessee</option>
                               <option value="Revenue">Revenue</option>
                               <option value="Remanded">Remanded</option>
                               <option value="Partly Allowed">Partly Allowed</option>
                           </select>
                       </div>
                   ) : (
                       <p className="text-lg font-medium text-emerald-800 dark:text-emerald-200">
                          Appeal in favor of: <span className="font-bold uppercase">{data.appeal_in_favor_of}</span>
                       </p>
                   )}
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
                      {renderEditableInput('sections_involved', editData.sections_involved, "e.g. Section 143(3)")}
                  </div>
              </div>
              <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                      <Scale size={16}/> Case Laws Referred
                  </h4>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm italic text-zinc-700 dark:text-zinc-300">
                      {renderEditableInput('case_laws_referred', editData.case_laws_referred, "e.g. CIT vs ABC", true)}
                  </div>
              </div>
          </div>

          {/* Summaries Section */}
          <div className="space-y-6">
             {/* ✅ ADDED: Four Line Summary */}
             <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                    <FileText size={20} className="text-blue-500" />
                    Quick Summary
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    {renderEditableInput('four_line_summary', editData.four_line_summary, "Short 4-line summary...", true)}
                </div>
             </div>

             <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Issues Involved</h3>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    {renderEditableInput('issues_involved', editData.issues_involved, "Summary of issues...", true)}
                </div>
             </div>
             
             <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Relevant Paragraphs</h3>
                <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-2">
                    {renderEditableInput('relevant_paragraphs', editData.relevant_paragraphs, "e.g. Para 4, 5")}
                </p>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-sm font-bold text-zinc-500 uppercase mb-3">Detailed Summary</h4>
                    <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                        {renderEditableInput('detailed_summary', editData.detailed_summary, "Full Detailed Summary...", true)}
                    </div>
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

export default CaseDetailModal;