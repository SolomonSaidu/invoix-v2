import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { InvoiceStatusBadge } from '../../components/ui/Badge';
import { Mail, Phone, MapPin, Receipt, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/dates';

export function CustomerDetailsModal({ isOpen, onClose, customer, invoices = [], onEdit }) {
  if (!customer) return null;

  const customerInvoices = invoices.filter((inv) => {
    if (inv.customerId && Number(inv.customerId) === Number(customer.id)) return true;
    if (inv.customerSnapshot?.name && inv.customerSnapshot.name.toLowerCase() === customer.name.toLowerCase()) return true;
    return false;
  });

  const totalBilled = customerInvoices.reduce((acc, inv) => acc + (inv.total || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={customer.name} maxWidth="max-w-lg">
      <div className="space-y-5">
        {/* Contact Info Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
          {customer.email && (
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <a href={`mailto:${customer.email}`} className="text-brand-600 hover:underline">
                {customer.email}
              </a>
            </div>
          )}

          {customer.phone && (
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <a href={`tel:${customer.phone}`} className="text-slate-900 font-medium">
                {customer.phone}
              </a>
            </div>
          )}

          {customer.address && (
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{customer.address}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-500 font-medium">
            <span>Total Invoices: <strong>{customerInvoices.length}</strong></span>
            <span>Total Billed: <strong className="text-slate-900">{formatCurrency(totalBilled)}</strong></span>
          </div>
        </div>

        {/* Invoice History */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Invoice History
            </h4>
            <Link to={`/app/invoices/new?customerName=${encodeURIComponent(customer.name)}`}>
              <Button size="sm" variant="ghost" icon={Plus} className="text-brand-600 h-7 text-xs">
                New Invoice
              </Button>
            </Link>
          </div>

          {customerInvoices.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-500">
              No invoices generated for this customer yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              {customerInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 bg-white flex items-center justify-between text-xs hover:bg-slate-50"
                >
                  <div>
                    <Link
                      to={`/app/invoices/${inv.id}`}
                      className="font-bold text-slate-900 hover:text-brand-600"
                    >
                      {inv.invoiceNumber}
                    </Link>
                    <div className="text-[11px] text-slate-500">{formatDate(inv.issueDate)}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(inv.total, inv.currency)}
                    </span>
                    <InvoiceStatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(customer);
            }}
          >
            Edit Profile
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
