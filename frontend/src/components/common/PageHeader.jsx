import { cn } from '@/utils';

const PageHeader = ({
  title,
  subtitle,
  actions,
  badge,
  className = '',
}) => {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-2">
            {badge}
          </div>
        )}
        <h1 className="text-xl font-bold text-text tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
};

export default PageHeader;
