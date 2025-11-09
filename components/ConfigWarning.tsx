"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export function ConfigWarning() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const configured = isSupabaseConfigured();
    
    // Check if user has dismissed the warning
    const wasDismissed = localStorage.getItem('config-warning-dismissed') === 'true';
    
    if (!configured && !wasDismissed) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('config-warning-dismissed', 'true');
    setDismissed(true);
    setShow(false);
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle size={24} className="flex-shrink-0" />
          <div>
            <p className="font-semibold">Supabase Not Configured</p>
            <p className="text-sm">
              Some features won't work. Please configure your Supabase credentials in <code className="bg-black/20 px-1 rounded">.env.local</code>
              {' '}— See <a href="/SETUP_GUIDE.md" className="underline font-semibold">SETUP_GUIDE.md</a>
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-2 hover:bg-black/10 rounded-lg transition-colors flex-shrink-0"
          aria-label="Dismiss warning"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
