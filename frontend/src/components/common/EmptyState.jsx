import { HiInbox } from 'react-icons/hi2';

const EmptyState = ({
  icon: Icon = HiInbox,
  title = 'No data found',
  description = '',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
      {description && <p className="text-sm text-text-secondary max-w-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
