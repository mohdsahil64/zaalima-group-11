import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { cn } from '@/utils';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className={cn(
          'p-2 rounded-[8px] transition-colors duration-200',
          hasPrevPage
            ? 'text-text-secondary hover:text-text hover:bg-surface'
            : 'text-border cursor-not-allowed'
        )}
        aria-label="Previous page"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={cn(
            'w-9 h-9 rounded-[8px] text-sm font-medium transition-colors duration-200',
            pageNum === page
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text hover:bg-surface'
          )}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className={cn(
          'p-2 rounded-[8px] transition-colors duration-200',
          hasNextPage
            ? 'text-text-secondary hover:text-text hover:bg-surface'
            : 'text-border cursor-not-allowed'
        )}
        aria-label="Next page"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
