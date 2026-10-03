import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Plus, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { OfflineBadge } from '../common/OfflineBadge';
import { usePWAInstall } from '../../hooks/usePWAInstall';

const routeTitles = {
  '/app': { title: 'Overview', subtitle: 'Real-time performance and recent invoices' },
  '/app/invoices': { title: 'Invoices', subtitle: 'Manage, search, and track all your invoices' },
  '/app/invoices/new': { title: 'Create Invoice', subtitle: 'Generate a clean, professional invoice' },
  '/app/customers': { title: 'Customers', subtitle: 'Manage your client directory' },
  '/app/profile': { title: 'Business Profile', subtitle: 'Company details, branding, and default currency' },
  '/app/settings': { title: 'Settings', subtitle: 'Preferences, numbering, and data management' },
};

export function TopNavbar({ onOpenMobileMenu }) {
  const location = useLocation();
  const currentRoute = routeTitles[location.pathname] || {
    title: 'Invoix Studio',
    subtitle: 'Manage invoices effortlessly',
  };

  const { triggerInstall } = usePWAInstall();

  return (
    <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {currentRoute.title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 font-normal">
            {currentRoute.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Offline / Online Status Indicator */}
        <OfflineBadge showOnlineText={false} />

        {/* PWA Download App Button */}
        <button
          type="button"
          onClick={triggerInstall}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 rounded-lg transition-colors cursor-pointer"
          title="Install Invoix for offline desktop/mobile use"
        >
          <Download className="w-3.5 h-3.5 text-brand-600" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>

        {/* Quick Create Invoice Action */}
        <Link to="/app/invoices/new">
          <Button size="sm" icon={Plus} variant="primary">
            <span className="hidden sm:inline">New Invoice</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
