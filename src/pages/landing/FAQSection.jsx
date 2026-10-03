import React from 'react';
import { Accordion } from '../../components/ui/Accordion';

const faqItems = [
  {
    question: 'Does Invoix really work without an internet connection?',
    answer:
      'Yes. Invoix is built with an offline-first Progressive Web App (PWA) architecture. The entire application shell, local database, and PDF generation tools are cached on your device. You can create, edit, view, and export invoices with zero internet connection.',
  },
  {
    question: 'Where is my business data and logo stored?',
    answer:
      'All your customer lists, business profiles, uploaded logos, and invoice snapshots are stored locally inside your browser’s IndexedDB database on your device. We do not transmit or store your business data on any external servers.',
  },
  {
    question: 'Do I need to register or create an account?',
    answer:
      'No registration or sign-up is required. You can launch the app immediately and start generating professional invoices in seconds.',
  },
  {
    question: 'Can I use Nigerian Naira (NGN) and other currencies?',
    answer:
      'Invoix defaults to Nigerian Naira (₦) with full support for local payment details and tax formatting, while also providing instant switching to USD ($), EUR (€), GBP (£), GHS (GH₵), KES (KSh), and more.',
  },
  {
    question: 'How do I install Invoix on my phone or computer?',
    answer:
      'Click the "Download App" button on this page, or look for the Install icon in your browser address bar (on Chrome/Edge). On iPhone/iPad (Safari), tap the Share icon and choose "Add to Home Screen".',
  },
  {
    question: 'Can I export or backup my invoice records?',
    answer:
      'Yes. You can download individual A4 PDF copies of any invoice at any time, as well as export your complete data records directly from Settings.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600">
            Everything you need to know about Invoix and offline invoicing.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <Accordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}
