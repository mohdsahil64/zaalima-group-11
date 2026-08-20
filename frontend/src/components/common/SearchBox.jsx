import { HiMagnifyingGlass } from 'react-icons/hi2';
import { cn } from '@/utils';

const SearchBox = ({ value, onChange, placeholder = 'Search...', className = '', ...props }) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <HiMagnifyingGlass className="w-4 h-4 text-text-muted" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-surface-elevated border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 hover:border-border-light transition-all duration-150"
        {...props}
      />
    </div>
  );
};

export default SearchBox;
