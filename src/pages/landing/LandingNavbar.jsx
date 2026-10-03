import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BrandLogo } from '../../components/common/BrandLogo';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { triggerInstall } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <BrandLogo size="md" className="group-hover:scale-105 transition-transform" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-slate-900 tracking-tight">Invoix</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Offline App
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={triggerInstall}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 rounded-lg transition-colors cursor-pointer shadow-subtle"
            >
              <Download className="w-4 h-4 text-brand-600" />
              <span>Download App</span>
            </button>

            <Link to="/app">
              <Button size="md" icon={ArrowRight} iconPosition="right">
                Open Invoix
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={triggerInstall}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg"
              title="Download App"
            >
              <Download className="w-4 h-4 text-brand-600" />
              <span>Install</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3 bg-white animate-fadeIn">
            <div className="flex flex-col space-y-2">
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                How It Works
              </a>
              <a
                href="#faq"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                FAQ
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  triggerInstall();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg"
              >
                <Download className="w-4 h-4 text-brand-600" />
                <span>Download / Install App</span>
              </button>

              <Link to="/app" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="md">
                  Open Invoix
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
