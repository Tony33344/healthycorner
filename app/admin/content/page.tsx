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
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Content Manager</h1>
                <p className="text-sm text-neutral-600">Edit website content and images</p>
              </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hero Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b">Hero Section</h2>
              {renderField('hero', 'background_image', 'Background Image', 'image')}
              {renderField('hero', 'title', 'Main Title', 'text')}
              {renderField('hero', 'subtitle', 'Subtitle', 'text')}
              {renderField('hero', 'description', 'Description', 'textarea')}
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b">About Section</h2>
              {renderField('about', 'heading', 'Section Heading', 'text')}
              {renderField('about', 'intro1', 'Introduction Paragraph 1', 'textarea')}
              {renderField('about', 'intro2', 'Introduction Paragraph 2', 'textarea')}
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b">Services Section</h2>
              {renderField('services', 'heading', 'Section Heading', 'text')}
              {renderField('services', 'description', 'Section Description', 'textarea')}
            </div>

            {/* Gallery Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b">Gallery Section</h2>
              {renderField('gallery', 'heading', 'Section Heading', 'text')}
              {renderField('gallery', 'description', 'Section Description', 'textarea')}
            </div>

            {/* Booking Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b">Booking Section</h2>
              {renderField('booking', 'heading', 'Section Heading', 'text')}
              {renderField('booking', 'description', 'Section Description', 'textarea')}
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 pb-3 border-b">Contact Section</h2>
              {renderField('contact', 'heading', 'Section Heading', 'text')}
              {renderField('contact', 'address', 'Address', 'text')}
              {renderField('contact', 'phone', 'Phone Number', 'text')}
              {renderField('contact', 'email', 'Email Address', 'text')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
