"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Calendar, Mail, Phone, User, Clock, Users, LogOut, MessageSquare, Trash2, Save, CheckCircle, XCircle, PlusCircle, X } from 'lucide-react';
import Image from 'next/image';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  guests: number;
  message: string | null;
  status: string;
  created_at: string;
}

function ServiceRow({ service, onSaved, notify }: { service: any; onSaved: () => void; notify: (type: 'success' | 'error', message: string) => void }) {
  const [name, setName] = useState(service.name || '');
  const [description, setDescription] = useState<string>(service.description || '');
  const [duration, setDuration] = useState<number | ''>(service.duration_minutes ?? '');
  const [price, setPrice] = useState<number | ''>(service.price_eur ?? '');
  const [maxGuests, setMaxGuests] = useState<number | ''>(service.max_guests ?? '');
  const [active, setActive] = useState<boolean>(!!service.active);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || null,
          duration_minutes: duration === '' ? null : Number(duration),
          price_eur: price === '' ? null : Number(price),
          max_guests: maxGuests === '' ? null : Number(maxGuests),
          active,
        }),
      });
      if (!res.ok) notify('error', 'Failed to save service');
      else { notify('success', 'Service saved'); onSaved(); }
    } catch (e) {
      notify('error', 'Failed to save service');
    } finally { setSaving(false); }
  };

  const del = async () => {
    if (!confirm('Delete this service?')) return;
    const res = await fetch(`/api/admin/services/${service.id}`, { method: 'DELETE' });
    if (!res.ok) notify('error', 'Failed to delete service');
    else { notify('success', 'Service deleted'); onSaved(); }
  };

  return (
    <tr className="border-b align-top" data-testid="service-row" data-service-id={service.id}>
      <td className="py-2 pr-4 w-64">
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded" />
      </td>
      <td className="py-2 pr-4">
        <textarea value={description || ''} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-neutral-300 rounded" />
      </td>
      <td className="py-2 pr-4 w-28">
        <input type="number" value={duration === '' ? '' : String(duration)} onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-300 rounded" />
      </td>
      <td className="py-2 pr-4 w-28">
        <input type="number" step="0.01" value={price === '' ? '' : String(price)} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-300 rounded" />
      </td>
      <td className="py-2 pr-4 w-28">
        <input type="number" value={maxGuests === '' ? '' : String(maxGuests)} onChange={(e) => setMaxGuests(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-300 rounded" />
      </td>
      <td className="py-2 pr-4">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
      </td>
      <td className="py-2 pr-4">
        <div className="flex items-center gap-2">
          <button onClick={save} disabled={saving} className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={del} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function ServiceCreate({ onCreated, notify }: { onCreated: () => void; notify: (type: 'success' | 'error', message: string) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [maxGuests, setMaxGuests] = useState('1');
  const [active, setActive] = useState(true);
  const [creating, setCreating] = useState(false);

  const create = async () => {
    if (!name) { notify('error', 'Name is required'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || null,
          duration_minutes: duration === '' ? null : Number(duration),
          price_eur: price === '' ? null : Number(price),
          max_guests: maxGuests === '' ? null : Number(maxGuests),
          active,
        }),
      });
      if (!res.ok) notify('error', 'Failed to create service');
      else {
        notify('success', 'Service created');
        setName(''); setDescription(''); setDuration(''); setPrice(''); setMaxGuests('1'); setActive(true);
        onCreated();
      }
    } catch {
      notify('error', 'Failed to create service');
    } finally { setCreating(false); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
      <input placeholder="Name" className="px-3 py-2 border border-neutral-300 rounded md:col-span-2" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="Description" rows={2} className="px-3 py-2 border border-neutral-300 rounded md:col-span-2" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="number" placeholder="Duration (min)" className="px-3 py-2 border border-neutral-300 rounded" value={duration} onChange={(e) => setDuration(e.target.value)} />
      <input type="number" step="0.01" placeholder="Price (€)" className="px-3 py-2 border border-neutral-300 rounded" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="number" placeholder="Max Guests" className="px-3 py-2 border border-neutral-300 rounded" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        <span>Active</span>
      </label>
      <div className="md:col-span-6 flex justify-end">
        <button onClick={create} disabled={creating} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
          <PlusCircle size={16} /> {creating ? 'Creating...' : 'Create Service'}
        </button>
      </div>
    </div>
  );
}


function ProductRow({ product, onSaved, notify }: { product: any; onSaved: () => void; notify: (type: 'success' | 'error', message: string) => void }) {
  const [name, setName] = useState(product.name || '');
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState<number>(product.price || 0);
  const [compareAt, setCompareAt] = useState<number | null>(product.compare_at_price);
  const [published, setPublished] = useState<boolean>(!!product.published);
  const [featured, setFeatured] = useState<boolean>(!!product.featured);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(product?.metadata?.image_url ?? null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [gallery, setGallery] = useState<Array<{ id: string; image_url: string; title?: string }>>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          compare_at_price: compareAt == null ? null : Number(compareAt),
          published,
          featured,
          metadata: { ...(product?.metadata ?? {}), image_url: imageUrl ?? null },
        }),
      });
      if (!res.ok) {
        notify('error', 'Failed to save product');
      } else {
        notify('success', 'Product saved');
        onSaved();
      }
    } catch (e) {
      console.error('Save product error', e);
      notify('error', 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };
  
  const openImagePicker = async () => {
    setShowImagePicker(true);
    if (gallery.length === 0) {
      setLoadingGallery(true);
      try {
        const res = await fetch('/api/admin/gallery', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setGallery(Array.isArray(json?.items) ? json.items : []);
        }
      } catch (e) {
        console.error('Load gallery error', e);
      } finally {
        setLoadingGallery(false);
      }
    }
  };
  
  const delProduct = async () => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      if (!res.ok) {
        notify('error', 'Failed to delete product');
      } else {
        notify('success', 'Product deleted');
        onSaved();
      }
    } catch (e) {
      notify('error', 'Failed to delete product');
    }
  };
  
  return (
    <>
    <tr className="border-b align-top" data-testid="product-row" data-product-id={product.id} data-product-name={name}>
      <td className="py-2 pr-4 w-64">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded"
        />
        <div className="mt-2 space-y-2">
          {imageUrl ? (
            <div className="relative w-24 h-16 border rounded overflow-hidden">
              <Image src={imageUrl} alt="Product" fill className="object-cover" />
            </div>
          ) : (
            <div className="text-xs text-neutral-500">No image selected</div>
          )}
          <button
            type="button"
            onClick={openImagePicker}
            className="px-2 py-1 text-xs border border-neutral-300 rounded hover:bg-neutral-50"
          >
            Select Image
          </button>
        </div>
      </td>
      <td className="py-2 pr-4">
        <textarea
          value={description || ''}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-neutral-300 rounded"
        />
      </td>
      <td className="py-2 pr-4 w-28">
        <input
          type="number"
          value={String(price)}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full px-3 py-2 border border-neutral-300 rounded"
        />
      </td>
      <td className="py-2 pr-4 w-28">
        <input
          type="number"
          value={compareAt === null || compareAt === undefined ? '' : String(compareAt)}
          onChange={(e) => setCompareAt(e.target.value === '' ? null : Number(e.target.value))}
          className="w-full px-3 py-2 border border-neutral-300 rounded"
        />
      </td>
      <td className="py-2 pr-4">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
      </td>
      <td className="py-2 pr-4">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
      </td>
      <td className="py-2 pr-4">
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={delProduct} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </td>
    </tr>
    {showImagePicker && (
      <tr>
        <td colSpan={7} className="py-4">
          <div className="p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Select Image</h4>
              <button onClick={() => setShowImagePicker(false)} className="text-neutral-600 hover:text-neutral-900"><X size={16} /></button>
            </div>
            {loadingGallery ? (
              <div className="text-sm text-neutral-500">Loading images...</div>
            ) : gallery.length === 0 ? (
              <div className="text-sm text-neutral-500">No images in gallery. Upload via Media Manager.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {gallery.map(g => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => { setImageUrl(g.image_url); setShowImagePicker(false); }}
                    className="border rounded hover:shadow focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <div className="relative w-full pt-[56%]">
                      <Image src={g.image_url} alt={g.title || 'Image'} fill className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </td>
      </tr>
    )}
    </>
  );
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, any[]>>({});
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'messages' | 'products' | 'orders' | 'services'>('bookings');
  const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'error'; message: string }[]>([]);
  const toastId = useRef(0);
  const notify = (type: 'success' | 'error', message: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // New product creation state
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCompare, setNewCompare] = useState('');
  const [newPublished, setNewPublished] = useState(false);
  const [newFeatured, setNewFeatured] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);

  // Pagination & sorting state
  const PAGE_SIZE = 10;
  const [bookingsSort, setBookingsSort] = useState<'desc' | 'asc'>('desc');
  const [messagesSort, setMessagesSort] = useState<'desc' | 'asc'>('desc');
  const [ordersSort, setOrdersSort] = useState<'desc' | 'asc'>('desc');
  const [bookingsPage, setBookingsPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);

  // Initialize tab from URL hash (e.g., /admin#orders)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'bookings' || hash === 'messages' || hash === 'products' || hash === 'orders' || hash === 'services') {
        setActiveTab(hash as any);
      }
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for hash changes from global admin layout links
  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'bookings' || hash === 'messages' || hash === 'products' || hash === 'orders' || hash === 'services') {
        setActiveTab(hash as any);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('hashchange', handler);
      }
    };
  }, []);

  // Listen for query param changes (?tab=...)
  useEffect(() => {
    const t = (searchParams?.get('tab') || '').toLowerCase();
    if (t === 'bookings' || t === 'messages' || t === 'products' || t === 'orders' || t === 'services') {
      setActiveTab(t as any);
    }
  }, [searchParams]);

  // Derived, sorted & paginated arrays
  const sortedBookings = useMemo(() => {
    const arr = [...bookings];
    return arr.sort((a, b) => (bookingsSort === 'desc' ? (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())));
  }, [bookings, bookingsSort]);
  const totalBookingsPages = Math.max(1, Math.ceil(sortedBookings.length / PAGE_SIZE));
  const pagedBookings = useMemo(() => {
    const page = Math.min(bookingsPage, totalBookingsPages);
    const start = (page - 1) * PAGE_SIZE;
    return sortedBookings.slice(start, start + PAGE_SIZE);
  }, [sortedBookings, bookingsPage, totalBookingsPages]);

  const sortedMessages = useMemo(() => {
    const arr = [...messages];
    return arr.sort((a, b) => (messagesSort === 'desc' ? (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())));
  }, [messages, messagesSort]);
  const totalMessagesPages = Math.max(1, Math.ceil(sortedMessages.length / PAGE_SIZE));
  const pagedMessages = useMemo(() => {
    const page = Math.min(messagesPage, totalMessagesPages);
    const start = (page - 1) * PAGE_SIZE;
    return sortedMessages.slice(start, start + PAGE_SIZE);
  }, [sortedMessages, messagesPage, totalMessagesPages]);

  const sortedOrders = useMemo(() => {
    const arr = [...orders];
    return arr.sort((a, b) => (ordersSort === 'desc' ? (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())));
  }, [orders, ordersSort]);
  const totalOrdersPages = Math.max(1, Math.ceil(sortedOrders.length / PAGE_SIZE));
  const pagedOrders = useMemo(() => {
    const page = Math.min(ordersPage, totalOrdersPages);
    const start = (page - 1) * PAGE_SIZE;
    return sortedOrders.slice(start, start + PAGE_SIZE);
  }, [sortedOrders, ordersPage, totalOrdersPages]);

  // Immediately redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
 
  // Fetch data when user becomes available
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);
 
  // Refresh when switching tabs
  useEffect(() => {
    if (user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
 
  // Reset pagination when switching tabs
  useEffect(() => {
    setBookingsPage(1);
    setMessagesPage(1);
    setOrdersPage(1);
  }, [activeTab]);
  
  // Show loading state while checking auth OR redirect to login immediately
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  // If no user after loading, render a placeholder while useEffect redirects
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [bRes, mRes, oRes, pRes, sRes] = await Promise.all([
        fetch('/api/admin/bookings', { cache: 'no-store' }),
        fetch('/api/admin/messages', { cache: 'no-store' }),
        fetch('/api/admin/orders', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' }).catch(() => null),
        fetch('/api/admin/services', { cache: 'no-store' }).catch(() => null),
      ]);

      if (bRes.ok) {
        const bJson = await bRes.json();
        setBookings(bJson.bookings || []);
      }
      if (mRes.ok) {
        const mJson = await mRes.json();
        setMessages(mJson.messages || []);
      }
      if (oRes.ok) {
        const oJson = await oRes.json();
        setOrders(oJson.orders || []);
      }
      if (pRes && pRes.ok) {
        const pJson = await pRes.json();
        setProducts(pJson.products || []);
      }
      if (sRes && sRes.ok) {
        const sJson = await sRes.json();
        setServices(sJson.services || []);
      }
    } catch (e) {
      console.error('Admin fetch error', e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      console.error('Error updating booking status');
      notify('error', 'Failed to update booking status');
    } else {
      notify('success', 'Booking status updated');
      fetchData();
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Delete this booking?')) return;
    const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      notify('error', 'Failed to delete booking');
    } else {
      setBookings(prev => prev.filter(b => b.id !== id));
      notify('success', 'Booking deleted');
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      console.error('Error updating message');
      notify('error', 'Failed to update message status');
    } else {
      notify('success', 'Message status updated');
      fetchData();
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      notify('error', 'Failed to delete message');
    } else {
      setMessages(prev => prev.filter(m => m.id !== id));
      notify('success', 'Message deleted');
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this order?')) return;
    const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      notify('error', 'Failed to delete order');
    } else {
      setOrders(prev => prev.filter(o => o.id !== id));
      notify('success', 'Order deleted');
    }
  };

  const createProduct = async () => {
    if (!newName || newPrice === '') {
      notify('error', 'Name and price are required');
      return;
    }
    setCreatingProduct(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          description: newDescription || null,
          price: Number(newPrice),
          compare_at_price: newCompare === '' ? null : Number(newCompare),
          published: newPublished,
          featured: newFeatured,
        }),
      });
      if (!res.ok) {
        notify('error', 'Failed to create product');
      } else {
        notify('success', 'Product created');
        setNewName('');
        setNewDescription('');
        setNewPrice('');
        setNewCompare('');
        setNewPublished(false);
        setNewFeatured(false);
        await fetchData();
      }
    } catch (e) {
      notify('error', 'Failed to create product');
    } finally {
      setCreatingProduct(false);
    }
  };

  const toggleOrderExpand = async (orderId: string) => {
    const willExpand = !expandedOrders[orderId];
    setExpandedOrders((prev: Record<string, boolean>) => ({ ...prev, [orderId]: willExpand }));
    if (willExpand && !orderItems[orderId]) {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}/items`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setOrderItems((prev: Record<string, any[]>) => ({ ...prev, [orderId]: json.items || [] }));
        }
      } catch (e) {
        console.error('Failed to fetch order items', e);
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            data-testid="toast"
            data-type={t.type}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow ${t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
          >
            {t.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            <span className="text-sm">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-2 hover:opacity-80">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
              <p className="text-sm text-neutral-600">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Bookings</p>
                <p className="text-3xl font-bold text-neutral-900">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pending Bookings</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Unread Messages</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {messages.filter(m => m.status === 'unread').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">

          <div className="p-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={fetchData}
                disabled={loadingData}
                className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
            {loadingData ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-neutral-600">Loading data...</p>
              </div>
            ) : activeTab === 'bookings' ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600">Sort:</span>
                    <select
                      data-testid="sort-bookings"
                      value={bookingsSort}
                      onChange={(e) => setBookingsSort(e.target.value as 'desc' | 'asc')}
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                    >
                      <option value="desc">Newest</option>
                      <option value="asc">Oldest</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      data-testid="prev-bookings"
                      onClick={() => setBookingsPage((p) => Math.max(1, p - 1))}
                      disabled={bookingsPage <= 1}
                      className="px-3 py-2 bg-neutral-100 rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span data-testid="page-bookings" className="text-sm text-neutral-600">
                      Page {Math.min(bookingsPage, totalBookingsPages)} of {totalBookingsPages}
                    </span>
                    <button
                      data-testid="next-bookings"
                      onClick={() => setBookingsPage((p) => Math.min(totalBookingsPages, p + 1))}
                      disabled={bookingsPage >= totalBookingsPages}
                      className="px-3 py-2 bg-neutral-100 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
                {bookings.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">No bookings yet</p>
                ) : (
                  pagedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      data-testid="booking-card"
                      data-email={booking.email}
                      className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <User className="text-neutral-400" size={20} />
                            <span className="font-semibold text-neutral-900">{booking.name}</span>
                            <span data-testid="booking-status-pill" data-status={booking.status} className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-600">
                            <div className="flex items-center space-x-2">
                              <Mail size={16} />
                              <span>{booking.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone size={16} />
                              <span>{booking.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar size={16} />
                              <span>{booking.date} at {booking.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users size={16} />
                              <span>{booking.guests} guest(s)</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm font-medium text-neutral-700">Service: {booking.service}</p>
                            {booking.message && (
                              <p className="text-sm text-neutral-600 mt-2">Message: {booking.message}</p>
                            )}
                          </div>

                          <p className="text-xs text-neutral-400 mt-2">
                            Created: {new Date(booking.created_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center justify-center gap-2"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'messages' ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600">Sort:</span>
                    <select
                      data-testid="sort-messages"
                      value={messagesSort}
                      onChange={(e) => setMessagesSort(e.target.value as 'desc' | 'asc')}
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                    >
                      <option value="desc">Newest</option>
                      <option value="asc">Oldest</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      data-testid="prev-messages"
                      onClick={() => setMessagesPage((p) => Math.max(1, p - 1))}
                      disabled={messagesPage <= 1}
                      className="px-3 py-2 bg-neutral-100 rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span data-testid="page-messages" className="text-sm text-neutral-600">
                      Page {Math.min(messagesPage, totalMessagesPages)} of {totalMessagesPages}
                    </span>
                    <button
                      data-testid="next-messages"
                      onClick={() => setMessagesPage((p) => Math.min(totalMessagesPages, p + 1))}
                      disabled={messagesPage >= totalMessagesPages}
                      className="px-3 py-2 bg-neutral-100 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
                {messages.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">No messages yet</p>
                ) : (
                  pagedMessages.map((message) => (
                    <div
                      key={message.id}
                      data-testid="message-card"
                      data-email={message.email}
                      className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <User className="text-neutral-400" size={20} />
                            <span className="font-semibold text-neutral-900">{message.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.status === 'unread' ? 'bg-blue-100 text-blue-800' :
                              message.status === 'read' ? 'bg-gray-100 text-gray-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {message.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2 text-neutral-600">
                              <Mail size={16} />
                              <span>{message.email}</span>
                            </div>
                            <p className="font-medium text-neutral-700">Subject: {message.subject}</p>
                            <p className="text-neutral-600">{message.message}</p>
                          </div>

                          <p className="text-xs text-neutral-400 mt-2">
                            Created: {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          <select
                            value={message.status}
                            onChange={(e) => updateMessageStatus(message.id, e.target.value)}
                            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center justify-center gap-2"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'products' ? (
              <div className="space-y-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-neutral-900">Create Product</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <input
                      data-testid="new-product-name"
                      placeholder="Name"
                      className="px-3 py-2 border border-neutral-300 rounded md:col-span-2"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <textarea
                      data-testid="new-product-description"
                      placeholder="Description"
                      rows={2}
                      className="px-3 py-2 border border-neutral-300 rounded md:col-span-2"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <input
                      data-testid="new-product-price"
                      type="number"
                      placeholder="Price"
                      className="px-3 py-2 border border-neutral-300 rounded"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                    <input
                      data-testid="new-product-compare"
                      type="number"
                      placeholder="Compare at"
                      className="px-3 py-2 border border-neutral-300 rounded"
                      value={newCompare}
                      onChange={(e) => setNewCompare(e.target.value)}
                    />
                    <label className="flex items-center gap-2">
                      <input
                        data-testid="new-product-published"
                        type="checkbox"
                        checked={newPublished}
                        onChange={(e) => setNewPublished(e.target.checked)}
                      />
                      <span>Published</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        data-testid="new-product-featured"
                        type="checkbox"
                        checked={newFeatured}
                        onChange={(e) => setNewFeatured(e.target.checked)}
                      />
                      <span>Featured</span>
                    </label>
                    <div className="md:col-span-6 flex justify-end">
                      <button
                        data-testid="create-product"
                        onClick={createProduct}
                        disabled={creatingProduct}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                      >
                        <PlusCircle size={16} /> {creatingProduct ? 'Creating...' : 'Create Product'}
                      </button>
                    </div>
                  </div>
                </div>
                {products.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">No products found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-2 pr-4">Name</th>
                          <th className="py-2 pr-4">Description</th>
                          <th className="py-2 pr-4">Price</th>
                          <th className="py-2 pr-4">Compare</th>
                          <th className="py-2 pr-4">Published</th>
                          <th className="py-2 pr-4">Featured</th>
                          <th className="py-2 pr-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <ProductRow key={p.id} product={p} onSaved={fetchData} notify={notify} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : activeTab === 'services' ? (
              <div className="space-y-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-neutral-900">Create Service</h3>
                  </div>
                  <ServiceCreate onCreated={fetchData} notify={notify} />
                </div>
                {services.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">No services found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-2 pr-4">Name</th>
                          <th className="py-2 pr-4">Description</th>
                          <th className="py-2 pr-4 w-28">Duration (min)</th>
                          <th className="py-2 pr-4 w-28">Price (€)</th>
                          <th className="py-2 pr-4 w-28">Max Guests</th>
                          <th className="py-2 pr-4">Active</th>
                          <th className="py-2 pr-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((s) => (
                          <ServiceRow key={s.id} service={s} onSaved={fetchData} notify={notify} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : activeTab === 'orders' ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600">Sort:</span>
                    <select
                      data-testid="sort-orders"
                      value={ordersSort}
                      onChange={(e) => setOrdersSort(e.target.value as 'desc' | 'asc')}
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                    >
                      <option value="desc">Newest</option>
                      <option value="asc">Oldest</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      data-testid="prev-orders"
                      onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                      disabled={ordersPage <= 1}
                      className="px-3 py-2 bg-neutral-100 rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span data-testid="page-orders" className="text-sm text-neutral-600">
                      Page {Math.min(ordersPage, totalOrdersPages)} of {totalOrdersPages}
                    </span>
                    <button
                      data-testid="next-orders"
                      onClick={() => setOrdersPage((p) => Math.min(totalOrdersPages, p + 1))}
                      disabled={ordersPage >= totalOrdersPages}
                      className="px-3 py-2 bg-neutral-100 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
                {orders.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">No orders yet</p>
                ) : (
                  pagedOrders.map((o) => (
                    <div key={o.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-neutral-900">Order {o.order_number}</p>
                          <p className="text-sm text-neutral-600">{o.customer_name} ({o.customer_email})</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-neutral-900">€{o.total?.toFixed?.(2) ?? o.total}</p>
                          <p className="text-xs text-neutral-500">{new Date(o.created_at).toLocaleString()}</p>
                          <p className="text-xs">Status: {o.payment_status}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          data-testid="toggle-order-items"
                          onClick={() => toggleOrderExpand(o.id)}
                          className="px-3 py-2 bg-neutral-100 rounded hover:bg-neutral-200 text-sm"
                        >
                          {expandedOrders[o.id] ? 'Hide items' : 'View items'}
                        </button>
                        <button
                          onClick={() => deleteOrder(o.id)}
                          className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      {expandedOrders[o.id] && (
                        <div className="mt-3">
                          {Array.isArray(orderItems[o.id]) ? (
                            orderItems[o.id].length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                  <thead>
                                    <tr className="text-left border-b">
                                      <th className="py-2 pr-4">Product</th>
                                      <th className="py-2 pr-4">Qty</th>
                                      <th className="py-2 pr-4">Unit</th>
                                      <th className="py-2 pr-4">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {orderItems[o.id].map((it) => (
                                      <tr key={it.id} className="border-b">
                                        <td className="py-2 pr-4">{it.product_name}</td>
                                        <td className="py-2 pr-4">{it.quantity}</td>
                                        <td className="py-2 pr-4">€{Number(it.unit_price).toFixed(2)}</td>
                                        <td className="py-2 pr-4">€{Number(it.total_price).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-neutral-500">No items for this order.</p>
                            )
                          ) : (
                            <p className="text-sm text-neutral-500">Loading items...</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
