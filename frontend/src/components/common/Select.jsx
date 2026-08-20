import { forwardRef } from 'react';
import { cn } from '@/utils';

const Select = forwardRef(
  ({ label, error, options = [], placeholder = 'Select...', className = '', id, required, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-lg text-sm text-text appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60',
            'hover:border-border-light',
            'transition-all duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error/50 focus:ring-error/30 focus:border-error/60',
            className
          )}
          {...props}
        >
          <option value="" className="bg-surface-elevated text-text-muted">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface-elevated text-text">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
