import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, WifiOff } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="md" />
            <div>
              <span className="font-bold text-lg text-slate-900">Invoix</span>
              <p className="text-xs text-slate-500">Offline-first invoice studio for SMEs and freelancers</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">
              How It Works
            </a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">
              FAQ
            </a>
            <Link to="/app" className="hover:text-brand-600 transition-colors font-semibold text-brand-600">
              Open App
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 text-slate-400" />
            <span>Built for reliable offline work. No cloud dependencies required.</span>
          </div>

          <div>
            © {currentYear} Invoix. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
