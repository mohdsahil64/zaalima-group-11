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
            className="block text-[13px] font-medium text-text-secondary mb-1.5"
          >
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full h-9 bg-surface border border-border rounded-lg px-3 text-sm text-text appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:border-text-muted',
            error && 'border-error/50 focus:ring-error/30 focus:border-error',
            className
          )}
          {...props}
        >
          <option value="" className="bg-surface text-text-muted">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface text-text">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
