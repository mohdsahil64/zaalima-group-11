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
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full px-4 py-3 bg-surface-elevated border border-border rounded-lg text-sm text-text placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60',
            'hover:border-border-light',
            'transition-all duration-150 resize-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error/50 focus:ring-error/30 focus:border-error/60',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
