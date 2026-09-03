import { forwardRef } from 'react';
import { cn } from '@/utils';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  suffix,
  className = '',
  wrapperClassName = '',
  type = 'text',
  required,
  ...props
}, ref) => {
  return (
    <div className={cn('w-full', wrapperClassName)}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'input-base',
            Icon && 'pl-10',
            suffix && 'pr-10',
            error && 'error',
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-error flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
