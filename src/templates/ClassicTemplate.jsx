import React from 'react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dates';
import { InvoiceStatusBadge } from '../components/ui/Badge';

export function ClassicTemplate({
  invoice,
  accentColor = '#1e293b',
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
    <div className="bg-white rounded-xl overflow-hidden text-slate-900 text-xs shadow-sm font-serif border border-slate-300">
      <div className="p-8 space-y-6">
        {/* Formal Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-5">
          <div className="space-y-1.5 max-w-sm">
            {businessSnapshot?.logoData && (
              <img
                src={businessSnapshot.logoData}
                alt="Logo"
                className="w-16 h-16 object-contain mb-2"
              />
            )}
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {businessSnapshot?.name || 'Your Company Name'}
            </h1>
            <div className="text-slate-600 font-sans text-[11px] space-y-0.5">
              {businessSnapshot?.address && <p>{businessSnapshot.address}</p>}
              {businessSnapshot?.email && <p>{businessSnapshot.email}</p>}
              {businessSnapshot?.phone && <p>{businessSnapshot.phone}</p>}
              {businessSnapshot?.taxId && <p>TIN: {businessSnapshot.taxId}</p>}
            </div>
          </div>

          <div className="sm:text-right space-y-1 font-sans">
            <h2 className="text-2xl font-black tracking-wider text-slate-900 font-serif">
              INVOICE
            </h2>
            <p className="font-mono text-xs font-bold text-slate-700">#{invoiceNumber}</p>
            <div className="pt-1">
              <InvoiceStatusBadge status={status} />
            </div>
            <div className="text-[11px] text-slate-600 space-y-0.5 pt-2">
              <p>Invoice Date: <strong>{formatDate(issueDate)}</strong></p>
              <p>Payment Due: <strong>{formatDate(dueDate)}</strong></p>
            </div>
          </div>
        </div>

        {/* Customer / Billed To Section */}
        <div className="border border-slate-200 p-4 rounded bg-slate-50/50 font-sans">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            INVOICE TO:
          </div>
          <div className="text-sm font-bold text-slate-900">
            {customerSnapshot?.name || 'Walk-in Customer'}
          </div>
          <div className="text-xs text-slate-600 mt-1 space-y-0.5">
            {customerSnapshot?.address && <p>{customerSnapshot.address}</p>}
            {customerSnapshot?.email && <p>{customerSnapshot.email}</p>}
            {customerSnapshot?.phone && <p>{customerSnapshot.phone}</p>}
          </div>
        </div>

        {/* Table */}
        <div className="font-sans">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-900 text-white uppercase text-[11px]">
              <tr>
                <th className="px-3 py-2 border-r border-slate-700">Description</th>
                <th className="px-3 py-2 text-center w-16 border-r border-slate-700">Qty</th>
                <th className="px-3 py-2 text-right w-28 border-r border-slate-700">Unit Price</th>
                <th className="px-3 py-2 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-3 py-2.5 font-medium text-slate-900 border-r border-slate-200">
                    {item.description}
                  </td>
                  <td className="px-3 py-2.5 text-center border-r border-slate-200">{item.quantity}</td>
                  <td className="px-3 py-2.5 text-right border-r border-slate-200">
                    {formatCurrency(item.unitPrice, currency)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-900">
                    {formatCurrency(item.amount || (item.quantity * item.unitPrice), currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Terms */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 font-sans">
          <div className="space-y-3 max-w-sm text-xs">
            {paymentInstructions && (
              <div className="p-3 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block mb-1">Payment Instructions:</span>
                <p className="whitespace-pre-line text-slate-600 text-[11px]">{paymentInstructions}</p>
              </div>
            )}
            {terms && (
              <div className="text-[11px] text-slate-600">
                <span className="font-bold text-slate-800 block mb-0.5">Terms:</span>
                <p className="whitespace-pre-line">{terms}</p>
              </div>
            )}
          </div>

          <div className="w-full sm:w-64 border border-slate-300 p-3.5 space-y-2 text-xs">
            <div className="flex justify-between text-slate-700">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatCurrency(subtotal, currency)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({discount}%):</span>
                <span>- {formatCurrency(discountAmount, currency)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between text-slate-700">
                <span>Tax / VAT ({taxRate}%):</span>
                <span>+ {formatCurrency(taxAmount, currency)}</span>
              </div>
            )}
            <div className="pt-2 border-t-2 border-slate-900 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Due:</span>
              <span>{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
