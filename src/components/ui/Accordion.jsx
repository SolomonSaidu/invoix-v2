import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200/80 py-4 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left font-medium text-slate-900 transition-colors hover:text-brand-600 cursor-pointer py-1"
      >
        <span className="text-base sm:text-lg font-semibold">{title}</span>
        <ChevronDown
          className={clsx(
            'w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ml-4',
            isOpen && 'rotate-180 text-brand-600'
          )}
        />
      </button>
      {isOpen && (
        <div className="pt-3 pr-6 text-slate-600 leading-relaxed text-sm sm:text-base animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}

export function Accordion({ items = [] }) {
  return (
    <div className="divide-y divide-slate-200">
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.question} defaultOpen={index === 0}>
          {item.answer}
        </AccordionItem>
      ))}
    </div>
  );
}
