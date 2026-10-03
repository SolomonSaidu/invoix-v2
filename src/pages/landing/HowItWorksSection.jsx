import React from 'react';
import { Building2, FileEdit, DownloadCloud, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const steps = [
  {
    number: '01',
    icon: Building2,
    title: 'Configure Your Business',
    description:
      'Add your business name, contact info, logo, and preferred currency. This auto-fills all your future invoices.',
  },
  {
    number: '02',
    icon: FileEdit,
    title: 'Add Client & Items',
    description:
      'Enter your customer details and add line items with quantities and prices. Discounts and taxes calculate automatically.',
  },
  {
    number: '03',
    icon: DownloadCloud,
    title: 'Download & Share',
    description:
      'Select a template and color, preview the result, and download a crisp PDF or print directly in one click.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Generate an invoice in under 60 seconds
          </h2>
          <p className="text-base text-slate-600">
            No steep learning curve. If you can fill a simple form, you can create a professional invoice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50 rounded-2xl p-7 border border-slate-200/80 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-slate-300">
                      {step.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="h-1 w-12 bg-brand-500 rounded-full"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/app">
            <Button size="lg" icon={ArrowRight} iconPosition="right">
              Try Invoix Now — It's Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
