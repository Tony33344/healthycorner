"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Save, Upload, X, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface ContentItem {
  id: string;
  section: string;
  key: string;
  value: string | null;
  image_url: string | null;
  published: boolean;
}

interface GalleryImage {
  id: string;
  image_url: string;
  title?: string;
}

export default function ContentManager() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Image picker state
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [currentEditingKey, setCurrentEditingKey] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchContent();
    }
  }, [user]);

  const fetchContent = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setContent(json.content || []);
      }
    } catch (e) {
      console.error('Failed to fetch content', e);
    } finally {
      setLoadingData(false);
    }
  };

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>) => {
    setSaving(id);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) {
        notify('error', 'Failed to save content');
      } else {
        notify('success', 'Content saved');
        await fetchContent();
      }
    } catch (e) {
      notify('error', 'Failed to save content');
    } finally {
      setSaving(null);
    }
  };

  const createContent = async (section: string, key: string, value: string) => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, key, value, published: true }),
      });
      if (!res.ok) {
        notify('error', 'Failed to create content');
      } else {
        notify('success', 'Content created');
        await fetchContent();
      }
    } catch (e) {
      notify('error', 'Failed to create content');
    }
  };

  const openImagePicker = async (itemId: string) => {
    setCurrentEditingKey(itemId);
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

  const selectImage = (imageUrl: string) => {
    if (currentEditingKey) {
      const item = content.find(c => c.id === currentEditingKey);
      if (item) {
        updateContent(item.id, { image_url: imageUrl });
      }
    }
    setShowImagePicker(false);
    setCurrentEditingKey(null);
  };

  const getByKey = (section: string, key: string): ContentItem | undefined => {
    return content.find(c => c.section === section && c.key === key);
  };

  const renderField = (section: string, key: string, label: string, type: 'text' | 'textarea' | 'image' = 'text') => {
    const item = getByKey(section, key);
    const value = item?.value || '';
    const imageUrl = item?.image_url || null;

    if (type === 'image') {
      return (
        <div key={`${section}-${key}`} className="mb-6">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">{label}</label>
          <div className="space-y-3">
            {imageUrl ? (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <Image src={imageUrl} alt={label} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-full h-48 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center text-neutral-400">
                <div className="text-center">
                  <ImageIcon size={48} className="mx-auto mb-2" />
                  <p className="text-sm">No image selected</p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => item && openImagePicker(item.id)}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Upload size={16} />
              {imageUrl ? 'Change Image' : 'Select Image'}
            </button>
          </div>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div key={`${section}-${key}`} className="mb-6">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">{label}</label>
          <textarea
            value={value}
            onChange={(e) => {
              if (item) {
                setContent(prev => prev.map(c => c.id === item.id ? { ...c, value: e.target.value } : c));
              }
            }}
            onBlur={() => item && updateContent(item.id, { value })}
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {saving === item?.id && <p className="text-xs text-neutral-500 mt-1">Saving...</p>}
        </div>
      );
    }

    return (
      <div key={`${section}-${key}`} className="mb-6">
        <label className="block text-sm font-semibold text-neutral-700 mb-2">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (item) {
              setContent(prev => prev.map(c => c.id === item.id ? { ...c, value: e.target.value } : c));
            }
          }}
          onBlur={() => item && updateContent(item.id, { value })}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {saving === item?.id && <p className="text-xs text-neutral-500 mt-1">Saving...</p>}
      </div>
    );
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white flex items-center gap-2`}>
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Image</h3>
              <button onClick={() => setShowImagePicker(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {loadingGallery ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-neutral-600">Loading images...</p>
                </div>
              ) : gallery.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No images in gallery. Upload via Media Manager.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map(img => (
                    <button
                      key={img.id}
                      onClick={() => selectImage(img.image_url)}
                      className="relative aspect-square border-2 border-neutral-200 rounded-lg overflow-hidden hover:border-primary transition-colors"
                    >
                      <Image src={img.image_url} alt={img.title || 'Image'} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Content Manager</h1>
              <p className="text-sm text-neutral-600">Edit website content and images</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading content...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">1.</span> Hero Section
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  {renderField('hero', 'title', 'Main Title', 'text')}
                  {renderField('hero', 'subtitle', 'Subtitle', 'text')}
                  {renderField('hero', 'description', 'Description', 'textarea')}
                </div>
                <div>
                  {renderField('hero', 'background_image', 'Background Image', 'image')}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">2.</span> About Section
              </h2>
              {renderField('about', 'heading', 'Section Heading', 'text')}
              {renderField('about', 'intro1', 'Introduction Paragraph 1', 'textarea')}
              {renderField('about', 'intro2', 'Introduction Paragraph 2', 'textarea')}
            </div>

            {/* Brand Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">3.</span> Brand Section
              </h2>
              {renderField('brand', 'heading', 'Section Heading', 'text')}
              {renderField('brand', 'tagline', 'Tagline', 'text')}
              {renderField('brand', 'description', 'Section Description', 'textarea')}
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">4.</span> Services Section
              </h2>
              {renderField('services', 'heading', 'Section Heading', 'text')}
              {renderField('services', 'description', 'Section Description', 'textarea')}
              <p className="text-sm text-neutral-500 mt-4 p-3 bg-neutral-50 rounded-lg">💡 Individual services are managed in the Services tab on the main admin dashboard</p>
            </div>

            {/* Menu Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">5.</span> Menu Section
              </h2>
              {renderField('menu', 'heading', 'Section Heading', 'text')}
              {renderField('menu', 'description', 'Section Description', 'textarea')}
            </div>

            {/* Schedule Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">6.</span> Schedule Section
              </h2>
              {renderField('schedule', 'label', 'Label (small uppercase above heading)', 'text')}
              {renderField('schedule', 'heading', 'Section Heading', 'text')}
              {renderField('schedule', 'description', 'Section Description', 'textarea')}
            </div>

            {/* Gallery Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">7.</span> Gallery Section
              </h2>
              {renderField('gallery', 'heading', 'Section Heading', 'text')}
              {renderField('gallery', 'description', 'Section Description', 'textarea')}
              <p className="text-sm text-neutral-500 mt-4 p-3 bg-neutral-50 rounded-lg">💡 Gallery images are managed in the Media Manager</p>
            </div>

            {/* Testimonials Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">8.</span> Testimonials Section
              </h2>
              {renderField('testimonials', 'heading', 'Section Heading', 'text')}
              {renderField('testimonials', 'description', 'Section Description', 'textarea')}
            </div>

            {/* Shop Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">9.</span> Shop Section
              </h2>
              {renderField('shop', 'heading', 'Section Heading', 'text')}
              {renderField('shop', 'description', 'Section Description', 'textarea')}
              <p className="text-sm text-neutral-500 mt-4 p-3 bg-neutral-50 rounded-lg">💡 Products are managed in the Products tab on the main admin dashboard</p>
            </div>

            {/* Booking Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">10.</span> Booking Section
              </h2>
              {renderField('booking', 'heading', 'Section Heading', 'text')}
              {renderField('booking', 'description', 'Section Description', 'textarea')}
              <p className="text-sm text-neutral-500 mt-4 p-3 bg-neutral-50 rounded-lg">💡 Bookings are managed in the Bookings tab on the main admin dashboard</p>
            </div>

            {/* Newsletter Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">11.</span> Newsletter Section
              </h2>
              {renderField('newsletter', 'heading', 'Section Heading', 'text')}
              {renderField('newsletter', 'description', 'Section Description', 'textarea')}
              {renderField('newsletter', 'button_text', 'Button Text', 'text')}
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b flex items-center gap-2">
                <span className="text-primary">12.</span> Contact Section
              </h2>
              {renderField('contact', 'heading', 'Section Heading', 'text')}
              {renderField('contact', 'address', 'Address', 'text')}
              {renderField('contact', 'phone', 'Phone Number', 'text')}
              {renderField('contact', 'email', 'Email Address', 'text')}
              <p className="text-sm text-neutral-500 mt-4 p-3 bg-neutral-50 rounded-lg">💡 Contact messages are managed in the Messages tab on the main admin dashboard</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
