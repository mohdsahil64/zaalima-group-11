import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import useReducedMotion from '@/hooks/useReducedMotion';

const variants = {
  primary: 'bg-primary hover:bg-primary-light text-white shadow-lg shadow-primary/25',
  secondary: 'bg-surface hover:bg-border text-text border border-border',
  danger: 'bg-error hover:bg-red-600 text-white shadow-lg shadow-error/25',
  ghost: 'bg-transparent hover:bg-surface text-text-secondary hover:text-text',
  outline: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      disabled = false,
      loading = false,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={disabled || loading || prefersReducedMotion ? {} : { scale: 0.97 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-[12px] transition-all duration-200 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" aria-hidden="true" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" aria-hidden="true" />}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
