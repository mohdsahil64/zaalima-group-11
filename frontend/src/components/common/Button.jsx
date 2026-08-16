import { forwardRef } from 'react';
import { cn } from '@/utils';

const variants = {
  primary:
    'bg-primary hover:bg-primary-light text-white shadow-sm hover:shadow-md active:shadow-xs',
  secondary:
    'bg-surface-elevated hover:bg-surface-hover text-text border border-border hover:border-text-muted',
  danger:
    'bg-error/10 hover:bg-error/20 text-error border border-error/20 hover:border-error/40',
  ghost:
    'bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text',
  outline:
    'bg-transparent border border-border text-text-secondary hover:text-text hover:border-text-muted hover:bg-surface-elevated',
};

const sizes = {
  xs: 'h-7 px-2.5 text-xs gap-1',
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-sm gap-2',
  xl: 'h-11 px-6 text-base gap-2.5',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      disabled = false,
      loading = false,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
          'disabled:opacity-40 disabled:pointer-events-none',
          'active:scale-[0.98]',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{children || 'Loading...'}</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
