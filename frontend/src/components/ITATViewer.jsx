import React, { useState } from 'react';
import { Info, RefreshCw, ShieldCheck, Server } from 'lucide-react';

const ITATViewer = () => {
  // State to track if the iframe has finished loading
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      
      {/* 1. RESPONSIVE MONITOR/TABLET FRAME */}
      <div className="relative w-full h-[60vh] md:h-[75vh] min-h-[400px] md:min-h-[600px] bg-gray-900 rounded-xl md:rounded-2xl p-2 md:p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-800 ring-1 ring-white/10 transition-all duration-300">
        
        {/* 2. Top Camera Notch */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-gray-900 rounded-b-xl border-b border-x border-gray-800 z-10 justify-center items-center">
           <div className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full ring-1 ring-gray-700 shadow-inner"></div>
           <div className="w-1 h-1 bg-[#111] rounded-full ml-2 opacity-50"></div>
        </div>

        {/* 3. The Screen Area (Inner Container) */}
        <div className="w-full h-full bg-white rounded-lg overflow-hidden relative shadow-inner border border-gray-900 group">
          
          {/* --- A. LOADING OVERLAY --- */}
          <div 
            className={`absolute inset-0 z-20 bg-zinc-950 flex flex-col items-center justify-center text-center transition-opacity duration-700 ease-in-out p-4 ${
              iframeLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
             <div className="relative mb-6 md:mb-8">
                {/* Pulsing Circles Animation */}
                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center shadow-2xl">
                    <ShieldCheck size={32} className="text-emerald-500 animate-pulse md:w-10 md:h-10" />
                </div>
             </div>

             <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight mb-2">
                Establishing Secure Connection...
             </h2>
             
             {/* Responsive Badge */}
             <div className="flex flex-col md:flex-row items-center gap-2 text-xs md:text-sm text-zinc-500 font-mono bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800/50">
                <div className="flex items-center gap-2">
                    <Server size={14} className="text-blue-500"/>
                    <span>via <span className="text-white font-bold">BRC Servers</span></span>
                </div>
                <span className="hidden md:inline text-zinc-700">|</span>
                <span className="text-zinc-400">Powered by <span className="text-white font-bold">Benk-Y</span></span>
             </div>

             {/* Fake Progress Bar */}
             <div className="w-48 md:w-64 h-1 bg-zinc-800 rounded-full mt-6 md:mt-8 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 w-full animate-[progress_2s_ease-in-out_infinite] origin-left"></div>
             </div>
          </div>

          {/* --- B. THE IFRAME --- */}
          {/* ✅ SANDBOX ATTRIBUTE ADDED 
              - allow-popups IS REMOVED: This blocks 'Open in New Tab' (Middle Click).
              - allow-same-origin: Required for the site to function properly.
              - allow-scripts: Required for JS.
              - allow-forms: Required for inputs.
          */}
          <iframe 
            id="itatFrame" 
            src="https://lawwise-api.casanketmjoshi.in/api/proxy/itat/judicial/tribunalorders"
            className="w-full h-full border-none bg-white" 
            title="ITAT Website Container"
            sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-downloads"
            onLoad={() => setIframeLoaded(true)} 
          />

          {/* 4. Screen Reflection */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none mix-blend-overlay z-30"></div>
        </div>

        {/* 5. Power Light */}
        <div className="absolute bottom-1.5 right-4 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.8)] animate-pulse"></div>

      </div>

      {/* --- RESPONSIVE NOTE SECTION --- */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-start gap-3 shadow-sm">
        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-300 hidden md:block">
            <Info size={20} />
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
                <Info size={16} className="md:hidden"/> Scraping Guide
            </h4>
            <p className="text-xs md:text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                After entering details on the ITAT site, please <strong>wait 10 seconds</strong>. 
                If the extraction table appears, the scraping job has begun. 
                <span className="block mt-1 opacity-80">
                    If nothing happens after 10s, please <strong className="inline-flex items-center gap-1"><RefreshCw size={10}/> Refresh</strong> and try again.
                </span>
            </p>
        </div>
      </div>

    </div>
  );
};


export default ITATViewer;
