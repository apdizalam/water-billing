import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300">
      <div 
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 flex-shrink-0 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
