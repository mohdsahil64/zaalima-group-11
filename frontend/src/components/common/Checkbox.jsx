import { forwardRef } from 'react';
import { cn } from '@/utils';

const Checkbox = forwardRef(({ label, error, className = '', id, ...props }, ref) => {
  const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      <label htmlFor={checkboxId} className={cn('flex items-center gap-3 cursor-pointer', className)}>
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={cn(
            'w-4 h-4 rounded border-border bg-surface text-primary',
            'focus:ring-2 focus:ring-primary focus:ring-offset-0',
            'cursor-pointer transition-colors duration-200',
            error && 'border-error'
          )}
          {...props}
        />
        {label && <span className="text-sm text-text-secondary">{label}</span>}
      </label>
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
