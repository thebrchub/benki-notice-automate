import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, XCircle } from 'lucide-react';

const MobileRestriction = ({ children }) => {
  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      // 1. Viewport Check
      // Standard Tablets (iPad Mini) start at 768px. Anything less is a phone.
      const viewportWidth = window.innerWidth;
      
      // 2. Physical Screen Check (Catches "Desktop Mode" on phones)
      // Even if viewport is 1200px (zoomed out), a phone's physical screen width 
      // (in CSS pixels) is usually < 500px.
      const physicalWidth = window.screen.width;

      // Logic: If viewport OR physical screen is too small, block it.
      // We exclude iPads which usually have physical width >= 768.
      const isMobileSize = viewportWidth < 768;
      const isSmallDevice = physicalWidth < 768; 

      setIsRestricted(isMobileSize || isSmallDevice);
    };

    // Run on mount and resize
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (isRestricted) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        
        {/* Icon Animation */}
        <div className="relative mb-8">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 shadow-2xl">
                <Monitor size={48} className="text-zinc-600 opacity-50" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-900/90 rounded-full flex items-center justify-center border-4 border-[#09090b] animate-bounce">
                <XCircle size={20} className="text-white" />
            </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-white">
          Desktop View Only
        </h1>
        
        <p className="text-zinc-400 max-w-sm mx-auto leading-relaxed mb-8 text-sm md:text-base">
          To ensure data accuracy and maintain the integrity of our complex analysis interface, 
          <span className="text-zinc-200 font-semibold"> mobile access is restricted.</span>
        </p>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 max-w-xs mx-auto space-y-3">
            <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-green-900/20 text-green-500 rounded-lg">
                    <Monitor size={18} />
                </div>
                <div>
                    <p className="text-xs font-bold text-zinc-300">Desktop / Laptop</p>
                    <p className="text-[10px] text-zinc-500">Fully Supported</p>
                </div>
            </div>
            <div className="w-full h-px bg-zinc-800"></div>
            <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-green-900/20 text-green-500 rounded-lg">
                    <div className="border border-current rounded w-4 h-5 flex items-center justify-center text-[8px]">iPad</div>
                </div>
                <div>
                    <p className="text-xs font-bold text-zinc-300">iPad / Tablet</p>
                    <p className="text-[10px] text-zinc-500">Supported (Portrait/Landscape)</p>
                </div>
            </div>
            <div className="w-full h-px bg-zinc-800"></div>
            <div className="flex items-center gap-3 text-left opacity-50">
                <div className="p-2 bg-red-900/20 text-red-500 rounded-lg">
                    <Smartphone size={18} />
                </div>
                <div>
                    <p className="text-xs font-bold text-zinc-500 line-through">Mobile Phones</p>
                    <p className="text-[10px] text-red-500 font-medium">Restricted</p>
                </div>
            </div>
        </div>

        <p className="mt-10 text-[10px] text-zinc-600 font-mono">
            ERR_MOBILE_DEVICE_DETECTED
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileRestriction;