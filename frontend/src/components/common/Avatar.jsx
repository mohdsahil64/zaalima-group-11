import { cn } from '@/utils';
import { getInitials } from '@/utils';

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-xs',
  lg: 'w-11 h-11 text-sm',
  xl: 'w-14 h-14 text-base',
};

const Avatar = ({ src, firstName, lastName, size = 'md', className = '' }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={cn('rounded-full object-cover ring-1 ring-border', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center ring-1 ring-primary/20',
        sizes[size],
        className
      )}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
};

export default Avatar;
