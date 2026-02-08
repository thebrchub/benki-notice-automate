import React from 'react';
import { Loader2 } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isLoading,
  mode = 'confirm' // 'confirm' or 'alert'
}) => {
  if (!isOpen) return null;

  const isAlert = mode === 'alert';

  // Choose button color: Emerald for Success (Alert), Blue for Action (Confirm)
  const buttonColorClass = isAlert 
    ? "bg-emerald-600 hover:bg-emerald-700" 
    : "bg-blue-600 hover:bg-blue-700";

  return (
    // 1. Overlay: Matches Logout Modal (z-[100], backdrop-blur-sm)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* 2. Container: Matches Logout Modal (rounded-2xl, dark:bg-[#18181b], max-w-sm) */}
      <div 
        className="bg-white dark:bg-[#18181b] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* 3. Typography: Matches Logout Modal */}
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
          {message}
        </p>

        {/* 4. Buttons: Matches Logout Modal layout (flex gap-3 justify-end) */}
        <div className="flex gap-3 justify-end">
          
          {/* Cancel Button - Hidden if in 'alert' mode */}
          {!isAlert && (
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}

          {/* Primary Action Button */}
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-bold text-white rounded-lg flex items-center gap-2 transition-colors ${buttonColorClass}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing...
              </>
            ) : (
              // Dynamic text based on mode
              isAlert ? "OK" : "Yes, Refetch"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmationModal;