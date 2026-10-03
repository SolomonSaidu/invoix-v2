import React from 'react';

export function BrandLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dim = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative shrink-0 ${dim} ${className}`}>
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* App Background with Soft Rounded Corners */}
        <rect width="512" height="512" rx="112" fill="#4f46e5" />

        {/* Paper Document */}
        <rect x="132" y="112" width="248" height="288" rx="28" fill="#f8fafc" />

        {/* Invoice Header Line */}
        <rect x="172" y="168" width="168" height="24" rx="12" fill="#4f46e5" />

        {/* Invoice Line 2 */}
        <rect x="172" y="218" width="168" height="20" rx="10" fill="#818cf8" />

        {/* Invoice Line 3 */}
        <rect x="172" y="264" width="100" height="20" rx="10" fill="#c7d2fe" />

        {/* Cyan Status Badge */}
        <circle cx="348" cy="348" r="56" fill="#38bdf8" />
        <circle cx="348" cy="348" r="20" fill="#ffffff" />
      </svg>
    </div>
  );
}
