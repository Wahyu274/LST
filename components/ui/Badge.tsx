import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-[#16A36A] border border-emerald-200',
    warning: 'bg-amber-50 text-[#D99A16] border border-amber-200',
    danger: 'bg-red-50 text-[#D64545] border border-red-200',
    info: 'bg-blue-50 text-[#1769E0] border border-blue-200',
    primary: 'bg-blue-50 text-[#1769E0] border border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-medium rounded-[6px]',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-[6px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-sans leading-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
