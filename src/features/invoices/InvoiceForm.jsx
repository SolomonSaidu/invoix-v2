import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TemplateRenderer } from '../../templates/TemplateRenderer';
import {
  Building2,
  User,
  Plus,
  Trash2,
  Calendar,
  CreditCard,
  Percent,
  FileText,
  Save,
  ArrowLeft,
  DollarSign,
  Receipt,
  Eye,
  Edit3,
  Palette,
  Sparkles,
} from 'lucide-react';
import { useBusinessStore } from '../../stores/useBusinessStore';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { calculateInvoiceTotals, toMinorUnits } from '../../utils/calculations';
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY, formatCurrency, getCurrencySymbol } from '../../utils/currency';
import { getTodayISODate } from '../../utils/dates';
import { addDays, format } from 'date-fns';

export function InvoiceForm({ initialData = null, defaultInvoiceNumber = '', isEdit = false, onSubmit }) {
  const navigate = useNavigate();
  const { profile } = useBusinessStore();
  const { customers, loadCustomers } = useCustomerStore();

  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [accentColor, setAccentColor] = useState(profile?.accentColor || '#4f46e5');

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const defaultDueDate = format(addDays(new Date(), 14), 'yyyy-MM-dd');

  const [formData, setFormData] = useState({
    invoiceNumber: defaultInvoiceNumber || 'INV-0001',
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    currency: profile?.currency || DEFAULT_CURRENCY,
    status: 'UNPAID',
    issueDate: getTodayISODate(),
    dueDate: defaultDueDate,
    items: [
      { id: 'item-1', description: '', quantity: 1, unitPrice: 0 },
    ],
    discount: 0,
    discountType: 'percentage',
    taxRate: 7.5,
    notes: '',
    paymentInstructions: profile?.paymentInstructions || 'Bank: Zenith Bank\nAccount Name: Adeola & Sons Trading\nAccount Number: 1012345678',
    terms: profile?.terms || 'Payment is due within 14 days of invoice date.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        invoiceNumber: initialData.invoiceNumber || defaultInvoiceNumber,
        customerId: initialData.customerId || '',
        customerName: initialData.customerSnapshot?.name || initialData.customerName || '',
        customerEmail: initialData.customerSnapshot?.email || initialData.customerEmail || '',
        customerPhone: initialData.customerSnapshot?.phone || initialData.customerPhone || '',
        customerAddress: initialData.customerSnapshot?.address || initialData.customerAddress || '',
        currency: initialData.currency || profile?.currency || DEFAULT_CURRENCY,
        status: initialData.status || 'UNPAID',
        issueDate: initialData.issueDate || getTodayISODate(),
        dueDate: initialData.dueDate || defaultDueDate,
        items: initialData.items && initialData.items.length > 0
          ? initialData.items.map((it) => ({
              id: it.id || `item-${Date.now()}`,
              description: it.description || '',
              quantity: Number(it.quantity) || 1,
              unitPrice: Number(it.unitPrice) || 0,
            }))
          : [{ id: 'item-1', description: '', quantity: 1, unitPrice: 0 }],
        discount: initialData.discount ?? 0,
        discountType: initialData.discountType || 'percentage',
        taxRate: initialData.taxRate ?? 7.5,
        notes: initialData.notes || '',
        paymentInstructions: initialData.paymentInstructions || profile?.paymentInstructions || '',
        terms: initialData.terms || profile?.terms || '',
      });
      if (initialData.template) setSelectedTemplate(initialData.template);
      if (initialData.accentColor) setAccentColor(initialData.accentColor);
    } else if (defaultInvoiceNumber && !formData.invoiceNumber) {
      setFormData((prev) => ({ ...prev, invoiceNumber: defaultInvoiceNumber }));
    }
  }, [initialData, defaultInvoiceNumber, profile]);

  const handleSelectCustomer = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setFormData((prev) => ({ ...prev, customerId: '' }));
      return;
    }

    const found = customers.find((c) => String(c.id) === String(selectedId));
    if (found) {
      setFormData((prev) => ({
        ...prev,
        customerId: found.id,
        customerName: found.name,
        customerEmail: found.email || '',
        customerPhone: found.phone || '',
        customerAddress: found.address || '',
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index] = {
      ...updated[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? Math.max(0, Number(value) || 0) : value,
    };
    setFormData((prev) => ({ ...prev, items: updated }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `item-${Date.now()}-${prev.items.length}`, description: '', quantity: 1, unitPrice: 0 },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length <= 1) return;
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updated }));
  };

  const totals = calculateInvoiceTotals({
    items: formData.items,
    discount: formData.discount,
    discountType: formData.discountType,
    taxRate: formData.taxRate,
  });

  const currencySymbol = getCurrencySymbol(formData.currency);

  const previewInvoiceObject = {
    ...formData,
    ...totals,
    businessSnapshot: {
      name: profile?.name || 'Your Company Name',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      taxId: profile?.taxId || '',
      registrationNumber: profile?.registrationNumber || '',
      logoData: profile?.logoData || null,
    },
    customerSnapshot: {
      name: formData.customerName || 'Customer Name',
      email: formData.customerEmail || '',
      phone: formData.customerPhone || '',
      address: formData.customerAddress || '',
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName.trim()) {
      setErrorMsg('Please specify a customer or client name.');
      setActiveTab('form');
      return;
    }

    const hasValidItem = formData.items.some(
      (item) => item.description.trim().length > 0 && item.quantity > 0
    );

    if (!hasValidItem) {
      setErrorMsg('Please add at least one line item with a description and price.');
      setActiveTab('form');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        template: selectedTemplate,
        accentColor,
        businessSnapshot: {
          name: profile?.name || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          address: profile?.address || '',
          taxId: profile?.taxId || '',
          registrationNumber: profile?.registrationNumber || '',
          logoData: profile?.logoData || null,
        },
        customerSnapshot: {
          name: formData.customerName.trim(),
          email: formData.customerEmail.trim(),
          phone: formData.customerPhone.trim(),
          address: formData.customerAddress.trim(),
        },
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save invoice.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
      {/* Top action & View switch bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/app/invoices')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Form vs Preview Tabs */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'form' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Form</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'preview' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            isLoading={isSubmitting}
          >
            {isEdit ? 'Save Changes' : 'Save Invoice'}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Template & Color Selector Bar */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
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

      {/* Conditional Rendering: Form vs Live Preview */}
      {activeTab === 'preview' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Live A4 rendering with {selectedTemplate} template:</span>
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className="font-semibold text-brand-600 hover:underline cursor-pointer"
            >
              ← Return to editing form
            </button>
          </div>
          <TemplateRenderer
            template={selectedTemplate}
            invoice={previewInvoiceObject}
            accentColor={accentColor}
          />
        </div>
      ) : (
        /* Form Content */
        <div className="space-y-6">
          {/* Invoice Meta Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-brand-600" />
                  <h2 className="text-base font-bold text-slate-900">Invoice Information</h2>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-500">Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PAID">PAID</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Invoice # <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Issue Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Selection Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-600" />
                  <h2 className="text-base font-bold text-slate-900">Billed To (Customer)</h2>
                </div>
                {customers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Pick saved:</span>
                    <select
                      value={formData.customerId}
                      onChange={handleSelectCustomer}
                      className="text-xs px-2.5 py-1 bg-brand-50 border border-brand-200 rounded-lg text-brand-800 font-medium"
                    >
                      <option value="">-- Choose existing client --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Customer / Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki Retail Partners or Bola Ahmed"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    placeholder="billing@customer.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Customer Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+234 801 234 5678"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Customer Address
                  </label>
                  <input
                    type="text"
                    placeholder="Admiralty Way, Lekki Phase 1, Lagos"
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items Table Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Invoice Items</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={handleAddItem}
                >
                  Add Item
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 min-w-[200px]">Item Description</th>
                      <th className="px-4 py-3 w-24 text-center">Qty</th>
                      <th className="px-4 py-3 w-36 text-right">Unit Price ({currencySymbol})</th>
                      <th className="px-4 py-3 w-36 text-right">Amount ({currencySymbol})</th>
                      <th className="px-3 py-3 w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.items.map((item, index) => {
                      const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <input
                              type="text"
                              required
                              placeholder="e.g. Website Design or 50kg Bags of Rice"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            />
                          </td>

                          <td className="p-3">
                            <input
                              type="number"
                              min="0.01"
                              step="any"
                              required
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="w-full text-center px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            />
                          </td>

                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              required
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                              className="w-full text-right px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            />
                          </td>

                          <td className="p-3 text-right font-bold text-slate-900 text-xs">
                            {formatCurrency(lineTotal, formData.currency)}
                          </td>

                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              disabled={formData.items.length <= 1}
                              className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>

            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={Plus}
                onClick={handleAddItem}
                className="text-brand-600 hover:bg-brand-50"
              >
                Add Another Item
              </Button>
            </div>
          </Card>

          {/* Calculations & Additional Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-sm font-bold text-slate-900">Payment Details & Notes</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Payment Instructions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Bank name, account number, sort code, or online payment link..."
                    value={formData.paymentInstructions}
                    onChange={(e) => setFormData({ ...formData, paymentInstructions: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Terms & Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Thank you for your business! Payment due within 14 days."
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <h3 className="text-sm font-bold text-slate-900">Invoice Summary</h3>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatCurrency(totals.subtotal, formData.currency)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">Discount:</span>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="text-xs px-2 py-0.5 border border-slate-200 rounded bg-slate-50"
                    >
                      <option value="percentage">% Percent</option>
                      <option value="fixed">Fixed ({currencySymbol})</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Math.max(0, Number(e.target.value) || 0) })}
                      className="w-20 px-2 py-0.5 text-right border border-slate-200 rounded text-xs"
                    />
                  </div>

                  <span className="font-semibold text-emerald-600">
                    - {formatCurrency(totals.discountAmount, formData.currency)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">Tax / VAT (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.taxRate}
                      onChange={(e) => setFormData({ ...formData, taxRate: Math.max(0, Number(e.target.value) || 0) })}
                      className="w-20 px-2 py-0.5 text-right border border-slate-200 rounded text-xs"
                    />
                    <span className="text-[11px] text-slate-400">(e.g. 7.5% VAT)</span>
                  </div>

                  <span className="font-semibold text-slate-800">
                    + {formatCurrency(totals.taxAmount, formData.currency)}
                  </span>
                </div>

                <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center text-slate-900">
                  <span className="text-base font-bold">Total Amount Due:</span>
                  <span className="text-xl font-extrabold" style={{ color: accentColor }}>
                    {formatCurrency(totals.total, formData.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="pt-4 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => navigate('/app/invoices')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={Save}
          isLoading={isSubmitting}
        >
          {isEdit ? 'Save Changes' : 'Create & Save Invoice'}
        </Button>
      </div>
    </form>
  );
}
