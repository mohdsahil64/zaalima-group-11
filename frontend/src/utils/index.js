import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Merge class names conditionally
 */
export const cn = (...classes) => clsx(...classes);

/**
 * Format date
 */
export const formatDate = (date, format = 'MMM D, YYYY') => {
  return dayjs(date).format(format);
};

/**
 * Relative time (e.g., "2 hours ago")
 */
export const timeAgo = (date) => {
  return dayjs(date).fromNow();
};

/**
 * Truncate text
 */
export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Get initials from name
 */
export const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

/**
 * Format salary range
 */
export const formatSalary = (min, max, currency = 'USD') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;
  return 'Not specified';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    reviewing: 'bg-blue-500/20 text-blue-400',
    shortlisted: 'bg-purple-500/20 text-purple-400',
    interview: 'bg-indigo-500/20 text-indigo-400',
    offered: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
    withdrawn: 'bg-gray-500/20 text-gray-400',
    open: 'bg-green-500/20 text-green-400',
    closed: 'bg-red-500/20 text-red-400',
    draft: 'bg-gray-500/20 text-gray-400',
    paused: 'bg-yellow-500/20 text-yellow-400',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400';
};
