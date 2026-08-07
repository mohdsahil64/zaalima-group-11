import { HiMagnifyingGlass } from 'react-icons/hi2';
import { cn } from '@/utils';

const SearchBox = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <HiMagnifyingGlass className="h-5 w-5 text-text-secondary" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-border rounded-[12px] pl-10 pr-4 py-2.5 text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        {...props}
      />
    </div>
  );
};

export default SearchBox;
