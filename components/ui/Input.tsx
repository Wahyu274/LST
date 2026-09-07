import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, required, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#111827]">
            {label} {required && <span className="text-[#D64545]">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full h-11 px-3.5 bg-white text-sm text-[#111827] placeholder:text-slate-400 border rounded-[8px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1769E0]/30 ${
            error ? 'border-[#D64545] focus:border-[#D64545]' : 'border-[#E2E8F0] focus:border-[#1769E0]'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#D64545] mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, required, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#111827]">
            {label} {required && <span className="text-[#D64545]">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full h-11 px-3.5 bg-white text-sm text-[#111827] border rounded-[8px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1769E0]/30 ${
            error ? 'border-[#D64545] focus:border-[#D64545]' : 'border-[#E2E8F0] focus:border-[#1769E0]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[#D64545] mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, required, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-[#111827]">
            {label} {required && <span className="text-[#D64545]">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`w-full p-3.5 bg-white text-sm text-[#111827] placeholder:text-slate-400 border rounded-[8px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1769E0]/30 ${
            error ? 'border-[#D64545] focus:border-[#D64545]' : 'border-[#E2E8F0] focus:border-[#1769E0]'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#D64545] mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
