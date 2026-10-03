import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  PlusCircle,
  Building2,
  Settings,
  Download,
  ArrowLeft,
} from 'lucide-react';
import { clsx } from 'clsx';
import { BrandLogo } from '../common/BrandLogo';
import { usePWAInstall } from '../../hooks/usePWAInstall';

const navItems = [
  { name: 'Overview', to: '/app', icon: LayoutDashboard, end: true },
  { name: 'Invoices', to: '/app/invoices', icon: FileText },
  { name: 'Customers', to: '/app/customers', icon: Users },
  { name: 'Create Invoice', to: '/app/invoices/new', icon: PlusCircle, isHighlight: true },
  { name: 'Business Profile', to: '/app/profile', icon: Building2 },
  { name: 'Settings', to: '/app/settings', icon: Settings },
];

export function Sidebar({ onCloseMobile }) {
  const { triggerInstall } = usePWAInstall();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandLogo size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">Invoix</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200/50">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Offline Invoice Studio</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  item.isHighlight && !isActive && 'text-brand-600 hover:bg-brand-50/50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={clsx(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600',
                      item.isHighlight && !isActive && 'text-brand-500'
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.isHighlight && (
                    <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <button
          type="button"
          onClick={triggerInstall}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-brand-600" />
            <span>Download App</span>
          </div>
          <span className="text-[10px] bg-white text-brand-800 px-1.5 py-0.5 rounded font-medium border border-brand-200/60 shadow-subtle">
            Offline
          </span>
        </button>

        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
      </div>
    </aside>
  );
}
