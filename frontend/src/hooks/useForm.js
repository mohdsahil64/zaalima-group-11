import { useForm as useReactHookForm } from 'react-hook-form';

/**
 * Custom wrapper around react-hook-form with default configuration
 */
export const useAppForm = (options = {}) => {
  return useReactHookForm({
    mode: 'onBlur',
    ...options,
  });
};

export default useAppForm;
