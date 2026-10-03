import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { InvoicesPage } from './pages/invoices/InvoicesPage';
import { CreateInvoicePage } from './pages/invoices/CreateInvoicePage';
import { EditInvoicePage } from './pages/invoices/EditInvoicePage';
import { InvoiceDetailsPage } from './pages/invoices/InvoiceDetailsPage';
import { CustomersPage } from './pages/customers/CustomersPage';
import { BusinessProfilePage } from './pages/business/BusinessProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      {/* SaaS Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Main Application Shell */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="invoices/new" element={<CreateInvoicePage />} />
        <Route path="invoices/edit/:id" element={<EditInvoicePage />} />
        <Route path="invoices/:id" element={<InvoiceDetailsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="profile" element={<BusinessProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
