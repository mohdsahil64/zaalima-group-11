import { cn } from '@/utils';
import { getInitials } from '@/utils';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const Avatar = ({ src, firstName, lastName, size = 'md', className = '' }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center',
        sizes[size],
        className
      )}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
};

export default Avatar;
