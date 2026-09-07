import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Height & padding rules per prompt
    const sizeClasses = {
      sm: 'h-9 px-3.5 text-xs rounded-[8px]',
      md: 'h-11 px-5 text-sm rounded-[8px]', // 44px height standard
      lg: 'h-12 px-6 text-base rounded-[8px]', // 48px height
    };

    const variantClasses = {
      // Primary: #1769E0, white text, 8-10% darker on hover (#1255B8), no gradient!
      primary:
        'bg-[#1769E0] text-white hover:bg-[#1255B8] active:bg-[#104494] border border-transparent shadow-xs font-semibold',
      // Secondary: White bg, Navy text (#071426), border #CBD5E1, hover #F8FAFC
      secondary:
        'bg-white text-[#071426] border border-[#CBD5E1] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] font-medium shadow-xs',
      // Ghost: Transparent, corporate blue / navy text
      ghost:
        'bg-transparent text-[#1769E0] hover:bg-blue-50 active:bg-blue-100 font-medium',
      // Danger: Destructive action
      danger:
        'bg-[#D64545] text-white hover:bg-[#B83535] active:bg-[#9B2A2A] border border-transparent font-semibold shadow-xs',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-[#1769E0]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
