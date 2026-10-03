import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Badge({ children, variant = 'neutral', size = 'md', className = '' }) {
  const variants = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    brand: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full border',
          variants[variant] || variants.neutral,
          sizes[size] || sizes.md,
          className
        )
      )}
    >
      {children}
    </span>
  );
}

export function InvoiceStatusBadge({ status = 'DRAFT' }) {
  const normStatus = (status || '').toUpperCase();
  
  if (normStatus === 'PAID') {
    return (
      <Badge variant="success">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Paid
      </Badge>
    );
  }
  if (normStatus === 'UNPAID') {
    return (
      <Badge variant="warning">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Unpaid
      </Badge>
    );
  }
  if (normStatus === 'OVERDUE') {
    return (
      <Badge variant="danger">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        Overdue
      </Badge>
    );
  }
  return (
    <Badge variant="neutral">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      Draft
    </Badge>
  );
}
