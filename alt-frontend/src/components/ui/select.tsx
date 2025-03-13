import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    const selectId = id || Math.random().toString(36).substr(2, 9);
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            'block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm',
            'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
