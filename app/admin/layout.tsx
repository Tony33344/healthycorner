import Link from 'next/link';
import { Suspense } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Operations */}
            <div className="flex items-center gap-2 mr-4">
              <span className="text-neutral-500">Operations:</span>
              <Link href="/admin?tab=bookings" className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200">Bookings</Link>
              <Link href="/admin?tab=orders" className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200">Orders</Link>
            </div>
            {/* Catalog */}
            <div className="flex items-center gap-2 mr-4">
              <span className="text-neutral-500">Catalog:</span>
              <Link href="/admin?tab=products" className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200">Products</Link>
              <Link href="/admin?tab=services" className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200">Services</Link>
            </div>
            {/* Content */}
            <div className="flex items-center gap-2 mr-4">
              <span className="text-neutral-500">Content:</span>
              <Link href="/admin/content" className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200">Content Manager</Link>
              <Link href="/admin/media" className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200">Media Manager</Link>
              <Link href="/admin/schedule" className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200">Schedule Manager</Link>
            </div>
            {/* Communication */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">Communication:</span>
              <Link href="/admin?tab=messages" className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200">Messages</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">
        <Suspense fallback={<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-neutral-600">Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
