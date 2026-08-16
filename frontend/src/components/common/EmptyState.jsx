import { HiInbox } from 'react-icons/hi2';

const EmptyState = ({
  icon: Icon = HiInbox,
  title = 'No data found',
  description = '',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-text-muted" />
      </div>
      <h3 className="text-sm font-medium text-text mb-1">{title}</h3>
      {description && <p className="text-xs text-text-muted max-w-xs mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
