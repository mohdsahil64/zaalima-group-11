import { forwardRef } from 'react';
import { cn } from '@/utils';

const Textarea = forwardRef(
  ({ label, error, className = '', rows = 4, id, required, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-[13px] font-medium text-text-secondary mb-1.5"
          >
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed resize-none',
            'hover:border-text-muted',
            error && 'border-error/50 focus:ring-error/30 focus:border-error',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
