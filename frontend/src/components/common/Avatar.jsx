import { cn } from '@/utils';

const sizes = {
  xs:  'w-6 h-6 text-[10px]',
  sm:  'w-8 h-8 text-xs',
  md:  'w-10 h-10 text-sm',
  lg:  'w-12 h-12 text-base',
  xl:  'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

const gradients = [
  'from-primary to-accent',
  'from-info to-primary',
  'from-success to-info',
  'from-warning to-error',
  'from-accent to-error',
];

const getGradient = (name = '') => {
  const code = (name.charCodeAt(0) || 0) % gradients.length;
  return gradients[code];
};

const Avatar = ({
  src,
  firstName = '',
  lastName = '',
  size = 'md',
  ring = false,
  online = false,
  className = '',
  ...props
}) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
  const gradient = getGradient(firstName + lastName);

  return (
    <div className={cn('relative shrink-0 inline-flex', className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={`${firstName} ${lastName}`}
          className={cn(
            'rounded-xl object-cover',
            sizes[size],
            ring && 'ring-2 ring-primary/40 ring-offset-1 ring-offset-background'
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-xl flex items-center justify-center font-bold text-white shrink-0',
            `bg-gradient-to-br ${gradient}`,
            sizes[size],
            ring && 'ring-2 ring-primary/40 ring-offset-1 ring-offset-background'
          )}
        >
          {initials}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-background rounded-full" />
      )}
    </div>
  );
};

export default Avatar;
