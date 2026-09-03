import { cn } from '@/utils';

const variants = {
  primary:   'bg-gradient-primary text-white shadow-glow-sm hover:opacity-90 active:scale-[0.98]',
  secondary: 'bg-surface-elevated text-text border border-border hover:bg-surface-hover hover:border-border-light',
  outline:   'bg-transparent text-text border border-border hover:bg-surface-hover hover:border-border-light',
  ghost:     'bg-transparent text-text-secondary hover:text-text hover:bg-surface-hover border border-transparent',
  danger:    'bg-error/10 text-error border border-error/20 hover:bg-error/20',
  success:   'bg-success/10 text-success border border-success/20 hover:bg-success/20',
};

const sizes = {
  xs: 'text-[11px] px-2.5 py-1.5 gap-1 rounded-lg',
  sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-xl',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
  lg: 'text-sm px-5 py-3 gap-2 rounded-xl font-semibold',
  xl: 'text-base px-6 py-3.5 gap-2.5 rounded-xl font-semibold',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin w-3.5 h-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Loading…</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children && <span>{children}</span>}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
