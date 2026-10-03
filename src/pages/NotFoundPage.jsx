import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-center">
      <div className="max-w-md space-y-4">
        <div className="text-6xl font-black text-brand-600">404</div>
        <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-sm text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Link to="/">
            <Button variant="secondary" size="md" icon={Home}>
              Landing Page
            </Button>
          </Link>
          <Link to="/app">
            <Button variant="primary" size="md" icon={ArrowLeft}>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
