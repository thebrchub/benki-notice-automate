import React from 'react';

const ITATViewer = () => {
  return (
    // 1. Monitor Bezel (Outer Shell)
    <div className="relative w-full h-full bg-gray-900 rounded-2xl p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-800 ring-1 ring-white/10">
      
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
        {/* This adds a very faint shine to the top right corner to make it look like glass */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* 5. Power Light (Bottom Right Bezel) */}
      <div className="absolute bottom-1.5 right-4 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.8)] animate-pulse"></div>

    </div>
  );
};

export default ITATViewer;