import { motion } from 'framer-motion';
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
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      className={cn(
        'bg-surface border border-border rounded-[12px]',
        paddings[padding],
        hover && 'cursor-pointer hover:border-primary/50 transition-colors duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
