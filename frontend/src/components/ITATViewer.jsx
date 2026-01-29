import React from 'react';
import { Info, RefreshCw } from 'lucide-react'; // Import icons for the note

const ITATViewer = () => {
  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* 1. Monitor Bezel (Outer Shell) */}
      <div className="relative flex-1 w-full bg-gray-900 rounded-2xl p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-800 ring-1 ring-white/10">
        
        {/* 2. Top Camera Notch (Visual Detail) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-gray-900 rounded-b-xl border-b border-x border-gray-800 z-10 flex justify-center items-center">
           {/* Tiny camera lens dot */}
           <div className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full ring-1 ring-gray-700 shadow-inner"></div>
           {/* Tiny sensor dot */}
           <div className="w-1 h-1 bg-[#111] rounded-full ml-2 opacity-50"></div>
        </div>

        {/* 3. The Screen Area (Inner Container) */}
        <div className="w-full h-full bg-white rounded-xl overflow-hidden relative shadow-inner border border-gray-900">
          
          {/* The Actual Website */}
          <iframe 
            id="itatFrame" 
            src="https://benkinotice-api.brchub.me/api/proxy/itat/judicial/tribunalorders"
            className="w-full h-full border-none" 
            title="ITAT Website Container"
          />

          {/* 4. Screen Reflection (Subtle Gloss Effect) */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none mix-blend-overlay"></div>
        </div>

        {/* 5. Power Light (Bottom Right Bezel) */}
        <div className="absolute bottom-1.5 right-4 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.8)] animate-pulse"></div>

      </div>

      {/* --- ADDED NOTE SECTION --- */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3 shadow-sm">
        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-300">
            <Info size={20} />
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                Scraping Confirmation Guide
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                After entering details on the ITAT site, please <strong>wait 10 seconds</strong>. 
                If the extraction table appears, the scraping job has begun. 
                <span className="block mt-1 text-xs opacity-80">
                    If nothing happens after 10s, please <strong className="inline-flex items-center gap-1"><RefreshCw size={10}/> Refresh</strong> and try again.
                </span>
            </p>
        </div>
      </div>

    </div>
  );
};

export default ITATViewer;