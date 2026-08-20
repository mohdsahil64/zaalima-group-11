import { cn } from '@/utils';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
  ...props
}) => {
  const paddings = {
    none: '',
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl',
        paddings[padding],
        hover && 'cursor-pointer hover:border-text-muted hover:bg-surface-elevated transition-all duration-200',
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
