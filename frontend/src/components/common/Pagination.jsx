import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { cn } from '@/utils';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, page - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Previous"
      >
        <HiChevronLeft className="w-4 h-4" />
      </button>
      {getPageNumbers().map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={cn(
            'w-8 h-8 rounded-md text-xs font-medium transition-colors',
            num === page ? 'bg-primary text-white' : 'text-text-muted hover:text-text hover:bg-surface-hover'
          )}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Next"
      >
        <HiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
