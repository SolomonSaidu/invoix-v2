import React from 'react';
import {
  WifiOff,
  Shield,
  Coins,
  Palette,
  Calculator,
  Download,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

const features = [
  {
    icon: WifiOff,
    title: 'Offline-First Architecture',
    description:
      'Generate, edit, and view all your invoices even when your internet connection is unavailable or unstable.',
    badge: 'Reliable',
  },
  {
    icon: Shield,
    title: 'Device-Only Data Storage',
    description:
      'No registration required. Your business data stays on your device.',
    badge: 'Private',
  },
  {
    icon: Coins,
    title: 'Default NGN & Multi-Currency',
    description:
      'Built tailored for Nigerian Naira (₦), while supporting USD ($), EUR (€), GBP (£), and other international currencies.',
    badge: 'Flexible',
  },
  {
    icon: Palette,
    title: '3 Professional Templates',
    description:
      'Choose between Classic, Modern, and Minimal invoice layouts with custom accent colors and brand logo integration.',
    badge: 'Customizable',
  },
  {
    icon: Calculator,
    title: 'Precise Calculations',
    description:
      'Automated line item totals, custom discounts, and VAT/tax rates calculated with zero rounding errors.',
    badge: 'Accurate',
  },
  {
    icon: Download,
    title: 'Instant PDF & Print',
    description:
      'Generate crisp, pixel-perfect A4 invoice PDFs ready to share directly with your clients or print immediately.',
    badge: 'Fast',
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 bg-slate-100/60 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-base text-slate-600">
            Invoix eliminates bloated menus and complex accounting modules, giving you pure invoicing speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} hover className="border-slate-200">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
