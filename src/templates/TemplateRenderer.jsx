import React from 'react';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { MinimalTemplate } from './MinimalTemplate';

export function TemplateRenderer({
  template = 'modern',
  invoice,
  accentColor = '#4f46e5',
}) {
  if (!invoice) return null;

  switch (template?.toLowerCase()) {
    case 'classic':
      return <ClassicTemplate invoice={invoice} accentColor={accentColor} />;
    case 'minimal':
      return <MinimalTemplate invoice={invoice} accentColor={accentColor} />;
    case 'modern':
    default:
      return <ModernTemplate invoice={invoice} accentColor={accentColor} />;
  }
}
