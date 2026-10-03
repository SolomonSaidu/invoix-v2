import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ShieldCheck, WifiOff, Sparkles, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProductMockup } from './ProductMockup';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export function HeroSection() {
  const { triggerInstall } = usePWAInstall();

  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-50/70 via-indigo-50/30 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/70 shadow-subtle animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Offline-First Invoicing for Modern Businesses</span>
        </div>

        {/* Hero Headline & Subhead */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Professional invoices. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              Without the complexity.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Create, customize, and download beautiful invoices for your business — even without an internet connection.
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link to="/app">
            <Button size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto shadow-md">
              Create Your First Invoice
            </Button>
          </Link>

          <button
            type="button"
            onClick={triggerInstall}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-base font-semibold text-slate-700 hover:text-brand-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-brand-600" />
            <span>Download App (Offline)</span>
          </button>

          <a href="#how-it-works">
            <Button variant="ghost" size="lg" icon={Play} className="w-full sm:w-auto">
              See How It Works
            </Button>
          </a>
        </div>

        {/* Value Micro-props */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 pt-2">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-4 h-4 text-brand-600" />
            <span>Works 100% Offline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>No Registration Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">₦</span>
            <span>Nigerian Naira & Multi-Currency</span>
          </div>
        </div>

        {/* Product Mockup */}
        <div className="pt-8">
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}
