import { forwardRef } from 'react';
import { cn } from '@/utils';

const variants = {
  primary:
    'bg-primary hover:bg-primary-light text-white shadow-sm shadow-primary/20',
  secondary:
    'bg-surface-elevated hover:bg-surface-hover text-text border border-border hover:border-border-light',
  danger:
    'bg-error/10 hover:bg-error/20 text-error border border-error/20',
  ghost:
    'bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text',
  outline:
    'bg-transparent border border-border text-text-secondary hover:text-text hover:bg-surface-elevated hover:border-border-light',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs gap-1.5',
  sm: 'px-3.5 py-2 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2',
  xl: 'px-8 py-3.5 text-base gap-2.5',
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
          'inline-flex items-center justify-center font-medium rounded-lg cursor-pointer select-none',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
