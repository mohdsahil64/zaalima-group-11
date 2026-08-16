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
            className="block text-[13px] font-medium text-text-secondary mb-1.5"
          >
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-4 w-4 text-text-muted" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full h-9 bg-surface border border-border rounded-lg px-3 text-sm text-text placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-elevated',
              'hover:border-text-muted',
              Icon && 'pl-9',
              error && 'border-error/50 focus:ring-error/30 focus:border-error',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
