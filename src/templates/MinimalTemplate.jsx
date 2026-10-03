import React from 'react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dates';
import { InvoiceStatusBadge } from '../components/ui/Badge';

export function MinimalTemplate({
  invoice,
  accentColor = '#0f172a',
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
    <div className="bg-white rounded-xl overflow-hidden text-slate-800 text-xs shadow-sm font-sans p-8 sm:p-10 space-y-10 border border-slate-100">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
        <div className="space-y-3">
          {businessSnapshot?.logoData ? (
            <img
              src={businessSnapshot.logoData}
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          ) : (
            <div className="text-xl font-black tracking-tight text-slate-900">
              {businessSnapshot?.name || 'Invoix'}
            </div>
          )}
          <div className="text-slate-500 text-[11px] space-y-0.5">
            {businessSnapshot?.name && <p className="font-semibold text-slate-800">{businessSnapshot.name}</p>}
            {businessSnapshot?.address && <p>{businessSnapshot.address}</p>}
            {businessSnapshot?.email && <p>{businessSnapshot.email}</p>}
            {businessSnapshot?.phone && <p>{businessSnapshot.phone}</p>}
          </div>
        </div>

        <div className="sm:text-right space-y-2">
          <div className="text-2xl font-light text-slate-400 tracking-wider">
            INVOICE
          </div>
          <div className="text-sm font-bold font-mono text-slate-900">
            {invoiceNumber}
          </div>
          <InvoiceStatusBadge status={status} />
          <div className="text-[11px] text-slate-400 space-y-0.5 pt-2">
            <p>Issued: <span className="text-slate-700 font-medium">{formatDate(issueDate)}</span></p>
            <p>Due: <span className="text-slate-700 font-medium">{formatDate(dueDate)}</span></p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Billed To
          </span>
          <p className="font-bold text-slate-900 text-sm">{customerSnapshot?.name || 'Client'}</p>
          <div className="text-[11px] text-slate-500 space-y-0.5 mt-1">
            {customerSnapshot?.email && <p>{customerSnapshot.email}</p>}
            {customerSnapshot?.phone && <p>{customerSnapshot.phone}</p>}
            {customerSnapshot?.address && <p>{customerSnapshot.address}</p>}
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="pt-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] text-slate-400 uppercase font-semibold">
              <th className="pb-2">Description</th>
              <th className="pb-2 text-center w-16">Qty</th>
              <th className="pb-2 text-right w-28">Price</th>
              <th className="pb-2 text-right w-32">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-3 font-medium text-slate-900">{item.description}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">{formatCurrency(item.unitPrice, currency)}</td>
                <td className="py-3 text-right font-semibold text-slate-900">
                  {formatCurrency(item.amount || (item.quantity * item.unitPrice), currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-slate-100">
        <div className="space-y-3 max-w-sm text-[11px] text-slate-500">
          {paymentInstructions && (
            <div>
              <span className="font-bold text-slate-700 block mb-0.5">Payment Details:</span>
              <p className="whitespace-pre-line leading-relaxed">{paymentInstructions}</p>
            </div>
          )}
          {terms && (
            <div>
              <span className="font-semibold text-slate-700 block mb-0.5">Notes:</span>
              <p className="whitespace-pre-line">{terms}</p>
            </div>
          )}
        </div>

        <div className="w-full sm:w-60 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">{formatCurrency(subtotal, currency)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span>
              <span>- {formatCurrency(discountAmount, currency)}</span>
            </div>
          )}
          {taxAmount > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Tax ({taxRate}%)</span>
              <span className="font-semibold text-slate-900">+ {formatCurrency(taxAmount, currency)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-900 flex justify-between font-bold text-sm text-slate-900">
            <span>Total</span>
            <span className="text-base">{formatCurrency(total, currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
