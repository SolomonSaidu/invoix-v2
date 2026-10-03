import React from 'react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dates';
import { InvoiceStatusBadge } from '../components/ui/Badge';

export function ModernTemplate({
  invoice,
  accentColor = '#4f46e5',
}) {
  const {
    businessSnapshot,
    customerSnapshot,
    items = [],
    currency = 'NGN',
    invoiceNumber,
    issueDate,
    dueDate,
    status,
    subtotal,
    discount,
    discountType,
    discountAmount,
    taxRate,
    taxAmount,
    total,
    paymentInstructions,
    terms,
  } = invoice;

  return (
    <div className="bg-white rounded-xl overflow-hidden text-slate-800 text-xs shadow-sm font-sans border border-slate-200">
      {/* Top Accent Strip */}
      <div className="h-2.5 w-full" style={{ backgroundColor: accentColor }} />

      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2 max-w-sm">
            {businessSnapshot?.logoData ? (
              <img
                src={businessSnapshot.logoData}
                alt="Business Logo"
                className="w-14 h-14 object-contain rounded-lg border border-slate-100 p-0.5"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                {businessSnapshot?.name ? businessSnapshot.name.charAt(0).toUpperCase() : 'I'}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {businessSnapshot?.name || 'Your Company Name'}
              </h2>
              {businessSnapshot?.registrationNumber && (
                <p className="text-[11px] text-slate-500 font-mono">
                  RC: {businessSnapshot.registrationNumber}
                </p>
              )}
            </div>
            <div className="text-slate-500 space-y-0.5 text-[11px]">
              {businessSnapshot?.address && <p>{businessSnapshot.address}</p>}
              {businessSnapshot?.email && <p>{businessSnapshot.email}</p>}
              {businessSnapshot?.phone && <p>{businessSnapshot.phone}</p>}
              {businessSnapshot?.taxId && <p className="font-mono">TIN: {businessSnapshot.taxId}</p>}
            </div>
          </div>

          <div className="sm:text-right space-y-2">
            <span
              className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded"
              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            >
              INVOICE
            </span>
            <div className="text-xl font-extrabold font-mono text-slate-900">
              {invoiceNumber}
            </div>
            <div className="inline-block">
              <InvoiceStatusBadge status={status} />
            </div>
            <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
              <p>Issue Date: <strong className="text-slate-800">{formatDate(issueDate)}</strong></p>
              <p>Due Date: <strong className="text-slate-800">{formatDate(dueDate)}</strong></p>
            </div>
          </div>
        </div>

        {/* Billed To Customer */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Billed To:
          </span>
          <div className="text-sm font-bold text-slate-900">
            {customerSnapshot?.name || 'Walk-in Customer'}
          </div>
          <div className="text-[11px] text-slate-600 space-y-0.5 mt-0.5">
            {customerSnapshot?.email && <p>{customerSnapshot.email}</p>}
            {customerSnapshot?.phone && <p>{customerSnapshot.phone}</p>}
            {customerSnapshot?.address && <p>{customerSnapshot.address}</p>}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead style={{ backgroundColor: `${accentColor}10` }}>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-2.5 font-bold" style={{ color: accentColor }}>Description</th>
                <th className="px-4 py-2.5 text-center font-bold w-16" style={{ color: accentColor }}>Qty</th>
                <th className="px-4 py-2.5 text-right font-bold w-28" style={{ color: accentColor }}>Price</th>
                <th className="px-4 py-2.5 text-right font-bold w-32" style={{ color: accentColor }}>Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.description || '—'}</td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice, currency)}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    {formatCurrency(item.amount || (item.quantity * item.unitPrice), currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
          <div className="space-y-3 max-w-sm text-xs">
            {paymentInstructions && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Payment Instructions:</span>
                <p className="whitespace-pre-line text-slate-600 text-[11px] leading-relaxed">
                  {paymentInstructions}
                </p>
              </div>
            )}
            {terms && (
              <div className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 block mb-0.5">Terms & Conditions:</span>
                <p className="whitespace-pre-line">{terms}</p>
              </div>
            )}
          </div>

          <div className="w-full sm:w-64 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal, currency)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount {discountType === 'percentage' ? `(${discount}%)` : ''}:</span>
                <span className="font-semibold">- {formatCurrency(discountAmount, currency)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>VAT / Tax ({taxRate}%):</span>
                <span className="font-semibold text-slate-900">+ {formatCurrency(taxAmount, currency)}</span>
              </div>
            )}
            <div
              className="pt-2 border-t flex justify-between items-center text-sm font-bold"
              style={{ borderTopColor: `${accentColor}40` }}
            >
              <span>Total:</span>
              <span style={{ color: accentColor }} className="text-base font-black">
                {formatCurrency(total, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
