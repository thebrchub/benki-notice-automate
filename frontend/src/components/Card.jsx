import React from 'react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-none ${className}`}>
    {children}
  </div>
);

export default Card;