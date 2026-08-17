import { forwardRef } from 'react';
import { cn } from '@/utils';

const Input = forwardRef(
  ({ label, error, icon: Icon, className = '', type = 'text', id, required, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon className="w-4 h-4 text-text-muted" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-lg text-sm text-text placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60',
              'hover:border-border-light',
              'transition-all duration-150',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              Icon && 'pl-10',
              error && 'border-error/50 focus:ring-error/30 focus:border-error/60',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
