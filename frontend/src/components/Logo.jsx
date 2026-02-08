import React from 'react';

const Logo = ({ className = "w-12 h-12" }) => {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="premiumGold" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#D4AF37" /> {/* Classic Gold */}
          <stop offset="100%" stopColor="#AA8C2C" /> {/* Darker Gold */}
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Background Container (Optional: Remove for transparent) */}
      <rect width="100" height="100" rx="20" fill="#0f172a" /> 

      {/* The 'L' Shape */}
      <path 
        d="M30 25 V75 H70" 
        stroke="url(#premiumGold)" 
        strokeWidth="8" 
        strokeLinecap="square"
        filter="url(#shadow)"
      />

      {/* The 'W' Shape (Interwoven) */}
      <path 
        d="M45 25 L55 75 L65 45 L75 75 L85 25" 
        stroke="white" 
        strokeWidth="6" 
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
};

export default Logo;