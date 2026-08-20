import { useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { cn } from '@/utils';

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

const Modal = ({ isOpen, onClose, title, children, size = 'md', className = '' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full bg-surface border border-border rounded-xl shadow-xl',
          'animate-in fade-in zoom-in-95 duration-200',
          sizes[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
              aria-label="Close"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
