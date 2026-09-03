import { cn } from '@/utils';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
  glass = false,
  glow = false,
  shimmer = false,
  ...props
}) => {
  const paddings = {
    none: '',
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        glass
          ? 'glass'
          : 'bg-surface border-border',
        glow && 'border-glow',
        paddings[padding],
        hover &&
          'cursor-pointer hover:border-border-light hover:bg-surface-elevated hover:shadow-card-hover hover:-translate-y-px',
        shimmer && 'card-shimmer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
