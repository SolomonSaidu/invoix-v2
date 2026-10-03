import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { TemplateRenderer } from '../../templates/TemplateRenderer';
import { PDFDownloadButton } from '../../components/invoice/PDFDownloadButton';
import {
  ArrowLeft,
  Printer,
  Edit2,
  Trash2,
  Check,
  Palette,
  Layout,
} from 'lucide-react';
import { useInvoiceStore } from '../../stores/useInvoiceStore';
import { useBusinessStore } from '../../stores/useBusinessStore';

export function InvoiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice, removeInvoice, togglePaidStatus } = useInvoiceStore();
  const { profile } = useBusinessStore();

  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Template and Accent controls
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [accentColor, setAccentColor] = useState('#4f46e5');

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getInvoice(id);
        if (data) {
          setInvoice(data);
          if (data.template) setSelectedTemplate(data.template);
          if (data.accentColor) setAccentColor(data.accentColor);
          else if (profile?.accentColor) setAccentColor(profile.accentColor);
        } else {
          navigate('/app/invoices');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, getInvoice, navigate, profile]);

  const handleTogglePaid = async () => {
    if (!invoice) return;
    await togglePaidStatus(invoice.id, invoice.status);
    const updated = await getInvoice(invoice.id);
    setInvoice(updated);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await removeInvoice(invoice.id);
      setIsDeleting(false);
      navigate('/app/invoices');
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading invoice details...</div>;
  }

  if (!invoice) {
    return <div className="p-8 text-center text-sm text-slate-500">Invoice not found.</div>;
  }

  const isPaid = invoice.status === 'PAID';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Action Bar (Hidden in Print View) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          to="/app/invoices"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant={isPaid ? 'secondary' : 'primary'}
            size="sm"
            icon={Check}
            onClick={handleTogglePaid}
          >
            {isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
          </Button>

          {/* Download PDF via react-pdf */}
          <PDFDownloadButton
            invoice={invoice}
            template={selectedTemplate}
            accentColor={accentColor}
            size="sm"
          />

          <Button variant="secondary" size="sm" icon={Printer} onClick={handlePrint}>
            Print
          </Button>

          <Link to={`/app/invoices/edit/${invoice.id}`}>
            <Button variant="secondary" size="sm" icon={Edit2}>
              Edit
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => setDeleteConfirmOpen(true)}
            className="text-rose-600 hover:bg-rose-50"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Template & Customization Controls (Hidden in Print View) */}
      <Card className="print:hidden">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5" />
              Template:
            </span>
            <div className="flex items-center gap-1.5">
              {['modern', 'classic', 'minimal'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTemplate(t)}
                  className={`px-3 py-1 text-xs font-semibold capitalize rounded-lg border transition-all cursor-pointer ${
                    selectedTemplate === t
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Accent Color:
            </span>
            <div className="flex items-center gap-2">
              {['#4f46e5', '#0f172a', '#059669', '#2563eb', '#dc2626', '#d97706'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccentColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    accentColor === color ? 'scale-125 border-slate-900' : 'border-white'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                title="Custom color"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rendered Template View */}
      <div className="shadow-elevation rounded-2xl overflow-hidden print:shadow-none print:rounded-none">
        <TemplateRenderer
          template={selectedTemplate}
          invoice={invoice}
          accentColor={accentColor}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice "${invoice.invoiceNumber}"? This action cannot be undone.`}
        confirmText="Delete Permanently"
        isLoading={isDeleting}
      />
    </div>
  );
}
