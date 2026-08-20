import { cn } from '@/utils';

const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={cn('skeleton-pulse rounded-md', className)}
      {...props}
    />
  );
};

Skeleton.Card = () => (
  <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-8 w-full mt-4" />
  </div>
);

Skeleton.Table = ({ rows = 5 }) => (
  <div className="bg-surface border border-border rounded-xl overflow-hidden">
    <div className="border-b border-border p-4">
      <Skeleton className="h-4 w-48" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
    ))}
  </div>
);

Skeleton.Stats = ({ count = 4 }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count} gap-4`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-surface border border-border rounded-xl p-5">
        <Skeleton className="h-3 w-20 mb-3" />
        <Skeleton className="h-7 w-14" />
      </div>
    ))}
  </div>
);

Skeleton.Dashboard = () => (
  <div className="space-y-6 page-enter">
    <Skeleton className="h-7 w-64 mb-1" />
    <Skeleton className="h-4 w-96" />
    <Skeleton.Stats />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      <Skeleton.Card />
      <Skeleton.Card />
    </div>
  </div>
);

export default Skeleton;
