import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    'COMPLETED': 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400',
    'PENDING': 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
    'FAILED': 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
  };
  const style = styles[status] || 'bg-zinc-100 text-zinc-600 border-zinc-200';
  const Icon = status === 'COMPLETED' ? CheckCircle : status === 'FAILED' ? AlertCircle : Clock;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${style}`}>
      <Icon size={12} /> {status}
    </span>
  );
};

export default StatusBadge;