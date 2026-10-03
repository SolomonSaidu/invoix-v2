import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InvoiceForm } from '../../features/invoices/InvoiceForm';
import { useInvoiceStore } from '../../stores/useInvoiceStore';

export function EditInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice, editInvoice } = useInvoiceStore();
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getInvoice(id);
        if (data) {
          setInvoice(data);
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
  }, [id, getInvoice, navigate]);

  const handleSubmit = async (formData) => {
    await editInvoice(id, formData);
    navigate(`/app/invoices/${id}`);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="p-8 text-center text-sm text-slate-500">Invoice not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Edit Invoice {invoice.invoiceNumber}</h2>
        <p className="text-xs text-slate-500">
          Modify details or line items. Changes will be updated locally.
        </p>
      </div>

      <InvoiceForm
        initialData={invoice}
        defaultInvoiceNumber={invoice.invoiceNumber}
        isEdit={true}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
