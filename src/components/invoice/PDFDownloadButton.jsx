import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Button } from '../ui/Button';
import { Download } from 'lucide-react';
import { InvoicePDFDocument } from '../../templates/InvoicePDFDocument';

export function PDFDownloadButton({
  invoice,
  template = 'modern',
  accentColor = '#4f46e5',
  variant = 'primary',
  size = 'sm',
  className = '',
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!invoice) return;

    try {
      setIsGenerating(true);
      const doc = (
        <InvoicePDFDocument
          invoice={invoice}
          template={template}
          accentColor={accentColor}
        />
      );

      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${invoice.invoiceNumber || 'draft'}.pdf`;
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 2000);

      setIsGenerating(false);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Could not generate PDF. Please try printing to PDF as a fallback.');
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      icon={Download}
      isLoading={isGenerating}
      onClick={handleDownload}
      className={className}
    >
      Download PDF (A4)
    </Button>
  );
}
