import { cn } from '@/utils';

const Table = ({ columns, data, className = '', emptyMessage = 'No data found' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto rounded-[12px] border border-border', className)}>
      <table className="w-full">
        <thead>
          <tr className="bg-surface border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, rowIdx) => (
            <tr
              key={row._id || rowIdx}
              className="hover:bg-surface/50 transition-colors duration-150"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-text">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
