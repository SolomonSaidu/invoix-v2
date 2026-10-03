import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, Users, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const mobileTabs = [
  { name: 'Overview', to: '/app', icon: LayoutDashboard, end: true },
  { name: 'Invoices', to: '/app/invoices', icon: FileText },
  { name: 'Create', to: '/app/invoices/new', icon: PlusCircle, isPrimary: true },
  { name: 'Customers', to: '/app/customers', icon: Users },
  { name: 'Settings', to: '/app/settings', icon: Settings },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-brand-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900',
                tab.isPrimary && !isActive && 'text-brand-600 font-medium'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={clsx(
                    'w-5 h-5 mb-0.5',
                    isActive ? 'text-brand-600' : 'text-slate-500',
                    tab.isPrimary && 'text-brand-600'
                  )}
                />
                <span>{tab.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
