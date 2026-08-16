import { HiMagnifyingGlass } from 'react-icons/hi2';
import { cn } from '@/utils';

const SearchBox = ({ value, onChange, placeholder = 'Search...', className = '', ...props }) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <HiMagnifyingGlass className="h-4 w-4 text-text-muted" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 bg-surface border border-border rounded-lg pl-9 pr-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150 hover:border-text-muted"
        {...props}
      />
    </div>
  );
};

export default SearchBox;
