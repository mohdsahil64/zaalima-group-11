import { cn } from '@/utils';

const variants = {
  default:  'bg-surface-elevated text-text-secondary border-border',
  primary:  'bg-primary/10 text-primary-light border-primary/20',
  info:     'bg-info/10 text-info-light border-info/20',
  success:  'bg-success/10 text-success-light border-success/20',
  warning:  'bg-warning/10 text-warning-light border-warning/20',
  error:    'bg-error/10 text-error-light border-error/20',
  outline:  'bg-transparent text-text-secondary border-border-light',
};

const sizes = {
  xs: 'text-[10px] px-2 py-0.5 gap-1',
  sm: 'text-[11px] px-2.5 py-0.5 gap-1',
  md: 'text-xs px-3 py-1 gap-1.5',
  lg: 'text-xs px-3.5 py-1.5 gap-1.5',
};

const dotColors = {
  default: 'bg-text-muted',
  primary: 'bg-primary',
  info:    'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
  outline: 'bg-text-muted',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColors[variant],
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
