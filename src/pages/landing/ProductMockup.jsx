import React from 'react';
import {
  FileCheck,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Building2,
  Receipt,
  WifiOff,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export function ProductMockup() {
  return (
    <div className="relative mx-auto max-w-4xl w-full">
      {/* Decorative Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-70"></div>

      {/* Main Container Shell */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden">
        {/* Top Window Bar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block"></span>
            <span className="text-xs font-medium text-slate-400 ml-2 hidden sm:inline">
              Invoix Studio — Invoice #INV-2026-0042
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
              <WifiOff className="w-3 h-3" />
              <span>Offline Ready</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="hidden sm:inline">Template:</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-white text-[11px]">
                Modern
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Body Canvas */}
        <div className="p-6 sm:p-10 bg-slate-50/50 space-y-6">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Apex Creative & Digital Ltd
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                12 Victoria Island Boulevard, Lagos, Nigeria
              </p>
              <p className="text-xs text-slate-500">
                hello@apexstudio.ng • +234 803 123 4567
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                INVOICE
              </span>
              <div className="font-mono text-base font-bold text-slate-900">
                #INV-2026-0042
              </div>
              <div className="text-xs text-slate-500">
                Date: <span className="font-medium text-slate-700">Oct 24, 2026</span>
              </div>
              <div className="text-xs text-slate-500">
                Due: <span className="font-medium text-slate-700">Nov 07, 2026</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Billed To:
              </span>
              <div className="font-bold text-slate-900 text-sm">Lekki Retail Partners</div>
              <div className="text-slate-600">contact@lekkipartners.com</div>
              <div className="text-slate-500">Admiralty Way, Lekki Phase 1, Lagos</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Payment Status:
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PAID</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                Currency: <strong className="text-slate-700">NGN (₦)</strong>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5 text-center">Qty</th>
                  <th className="px-4 py-2.5 text-right">Unit Price</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    Full Brand Identity & UI Design System
                  </td>
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-right">₦ 450,000.00</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    ₦ 450,000.00
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    Responsive Web Development (5 Pages)
                  </td>
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-right">₦ 350,000.00</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    ₦ 350,000.00
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    High-Speed Hosting & Domain Configuration (1 Year)
                  </td>
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-right">₦ 50,000.00</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    ₦ 50,000.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div className="text-xs text-slate-500 max-w-xs">
              <span className="font-semibold text-slate-700 block mb-0.5">Payment Instructions:</span>
              <span>Zenith Bank • Account: 1012345678 • Apex Creative Ltd</span>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">₦ 850,000.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount (5%):</span>
                <span className="text-emerald-600 font-medium">- ₦ 42,500.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT (7.5%):</span>
                <span>+ ₦ 60,562.50</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total:</span>
                <span className="text-brand-600">₦ 868,062.50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-slate-100/90 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="font-medium">Calculations verified with zero rounding errors</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-600 text-white rounded-lg font-medium shadow-sm">
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF (A4)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
