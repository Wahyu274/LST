import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'dark' | 'light';
  showSubtext?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({
  variant = 'dark',
  showSubtext = true,
  className = '',
  size = 'md',
}: LogoProps) {
  const badgeSize =
    size === 'sm'
      ? 'w-7 h-7 sm:w-8 sm:h-8'
      : size === 'lg'
      ? 'w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16'
      : 'w-9 h-9 sm:w-11 sm:h-11';

  const titleSize =
    size === 'sm'
      ? 'text-base sm:text-lg'
      : size === 'lg'
      ? 'text-xl sm:text-2xl lg:text-3xl'
      : 'text-lg sm:text-xl';

  const isLight = variant === 'light';

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0 ${className}`}>
      {/* Official 100% Transparent Metallic Circular Logo Emblem */}
      <img
        src="/images/logo.png"
        alt="CV. Life Solution Technology Badge"
        className={`${badgeSize} object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-md shrink-0`}
      />

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span
          className={`font-display font-extrabold ${titleSize} tracking-tight leading-none ${
            isLight ? 'text-white' : 'text-[#071426]'
          }`}
        >
          Life Solution <span className={isLight ? 'text-[#60A5FA]' : 'text-[#1769E0]'}>Technology</span>
        </span>
        {showSubtext && (
          <span
            className={`text-[8px] sm:text-[10px] font-medium uppercase tracking-widest leading-tight mt-0.5 ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            CV. Life Solution Technology
          </span>
        )}
      </div>
    </Link>
  );
}
