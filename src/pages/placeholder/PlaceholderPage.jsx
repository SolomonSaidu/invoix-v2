import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

export function PlaceholderPage({ title, description, phase = 'Phase 2' }) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Link to="/app">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            Back to Overview
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-8 sm:p-12 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            Coming in {phase}
          </span>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600 max-w-md mt-2 mb-6">
            {description}
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
            Database schema & store state are initialized for this feature.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
