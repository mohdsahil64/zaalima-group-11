import { cn } from '@/utils';

const variants = {
  default: 'bg-surface-elevated text-text-secondary border border-border',
  primary: 'bg-primary/10 text-primary-light border border-primary/20',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  error: 'bg-error/10 text-error border border-error/20',
  info: 'bg-info/10 text-info border border-info/20',
};

const sizes = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-[11px]',
  lg: 'px-2.5 py-1 text-xs',
};

const Badge = ({ children, variant = 'default', size = 'md', className = '', dot = false }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-md leading-none whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          variant === 'success' && 'bg-success',
          variant === 'warning' && 'bg-warning',
          variant === 'error' && 'bg-error',
          variant === 'info' && 'bg-info',
          variant === 'primary' && 'bg-primary',
          variant === 'default' && 'bg-text-muted',
        )} />
      )}
      {children}
    </span>
  );
};

export default Badge;
