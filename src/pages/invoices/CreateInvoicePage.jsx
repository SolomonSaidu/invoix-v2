import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InvoiceForm } from '../../features/invoices/InvoiceForm';
import { useInvoiceStore } from '../../stores/useInvoiceStore';
import { useCustomerStore } from '../../stores/useCustomerStore';

export function CreateInvoicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addInvoice, getNextNumber } = useInvoiceStore();
  const { customers, loadCustomers } = useCustomerStore();

  const [defaultInvoiceNumber, setDefaultInvoiceNumber] = useState('');
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    async function init() {
      await loadCustomers();
      const nextNum = await getNextNumber();
      setDefaultInvoiceNumber(nextNum);

      const customerId = searchParams.get('customerId');
      const customerName = searchParams.get('customerName');

      if (customerId) {
        setInitialData({ customerId });
      } else if (customerName) {
        setInitialData({ customerName });
      }
    }
    init();
  }, [loadCustomers, getNextNumber, searchParams]);

  const handleSubmit = async (invoiceData) => {
    const created = await addInvoice(invoiceData);
    navigate(`/app/invoices/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Create New Invoice</h2>
        <p className="text-xs text-slate-500">
          Fill in the client details and line items. The invoice will be saved locally on your device.
        </p>
      </div>

      <InvoiceForm
        initialData={initialData}
        defaultInvoiceNumber={defaultInvoiceNumber}
        isEdit={false}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
