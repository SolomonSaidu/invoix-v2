import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white border border-slate-200/80 rounded-xl shadow-card',
          hover && 'transition-all duration-200 hover:shadow-elevation hover:border-slate-300',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={twMerge(clsx('px-5 py-4 border-b border-slate-100', className))} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={twMerge(clsx('p-5', className))} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={twMerge(clsx('px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 rounded-b-xl', className))} {...props}>
      {children}
    </div>
  );
}
