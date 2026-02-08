import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isLoading,
  mode = 'confirm' // 'confirm' (2 buttons) or 'alert' (1 button)
}) => {
  if (!isOpen) return null;

  const isAlert = mode === 'alert';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-start gap-4">
          {/* Icon Changes based on Mode */}
          <div className={`p-3 rounded-full ${isAlert ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
            {isAlert ? (
               <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            ) : (
               <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              {message}
            </p>
          </div>
          
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {/* Only show CANCEL if we are in 'confirm' mode */}
          {!isAlert && (
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}

          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all flex items-center gap-2
              ${isAlert 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
          >
            {isLoading ? "Processing..." : (isAlert ? "OK" : "Yes, Refetch")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;