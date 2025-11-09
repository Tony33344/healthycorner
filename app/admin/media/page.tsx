"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Upload, Image as ImageIcon, Trash2, Eye, EyeOff, GripVertical, Plus, X } from 'lucide-react';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string;
  storage_path: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
}

const categories = ['icebath', 'food', 'yoga', 'nature', 'wimhof', 'retreat'];

export default function MediaManager() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'icebath',
    published: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchGalleryItems();
    }
  }, [user]);

  const fetchGalleryItems = async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching gallery items:', error);
    } else {
      setItems(data || []);
    }
    setLoadingData(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !formData.title) {
      alert('Please provide a file and title');
      return;
    }

    setUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${formData.category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // Insert into database
      const { error: dbError } = await supabase
        .from('gallery_items')
        .insert([{
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          image_url: publicUrl,
          storage_path: filePath,
          published: formData.published,
          display_order: items.length,
        }]);

      if (dbError) throw dbError;

      alert('Image uploaded successfully!');
      setShowUploadModal(false);
      resetForm();
      fetchGalleryItems();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setUploadFile(null);
    setUploadPreview('');
    setFormData({
      title: '',
      description: '',
      category: 'icebath',
      published: false,
    });
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('gallery_items')
      .update({ published: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } else {
      fetchGalleryItems();
    }
  };

  const deleteItem = async (id: string, storagePath: string | null) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      // Delete from storage if path exists
      if (storagePath) {
        await supabase.storage.from('gallery').remove([storagePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Item deleted successfully');
      fetchGalleryItems();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    }
  };

  const updateOrder = async (id: string, newOrder: number) => {
    const { error } = await supabase
      .from('gallery_items')
      .update({ display_order: newOrder })
      .eq('id', id);

    if (error) {
      console.error('Error updating order:', error);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...filteredItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    // Update orders in database
    newItems.forEach((item, idx) => {
      updateOrder(item.id, idx);
    });

    fetchGalleryItems();
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Media Manager</h1>
              <p className="text-sm text-neutral-600">Manage gallery images and media</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 mr-2">
                <button onClick={() => router.push('/admin#bookings')} className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm">Bookings</button>
                <button onClick={() => router.push('/admin#messages')} className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm">Messages</button>
                <button onClick={() => router.push('/admin#products')} className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm">Products</button>
                <button onClick={() => router.push('/admin#services')} className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm">Services</button>
                <button onClick={() => router.push('/admin#orders')} className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm">Orders</button>
                <button disabled className="px-3 py-2 rounded-lg bg-primary text-white text-sm">Media</button>
                <button onClick={() => router.push('/admin/content')} className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm">Content</button>
              </div>
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 text-neutral-700 hover:text-neutral-900"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={20} />
                <span>Upload Image</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Images</p>
                <p className="text-3xl font-bold text-neutral-900">{items.length}</p>
              </div>
              <ImageIcon className="text-primary" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Published</p>
                <p className="text-3xl font-bold text-green-600">
                  {items.filter(i => i.published).length}
                </p>
              </div>
              <Eye className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Draft</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {items.filter(i => !i.published).length}
                </p>
              </div>
              <EyeOff className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Categories</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {new Set(items.map(i => i.category)).size}
                </p>
              </div>
              <ImageIcon className="text-neutral-600" size={24} />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All ({items.length})
            </button>
            {categories.map(cat => {
              const count = items.filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {loadingData ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-neutral-600">Loading media...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto text-neutral-400 mb-4" size={48} />
              <p className="text-neutral-600">No images found</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 text-primary hover:underline"
              >
                Upload your first image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      {item.published ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Published
                        </span>
                      ) : (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-neutral-600 mb-3">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                      <span className="bg-neutral-100 px-2 py-1 rounded">{item.category}</span>
                      <span>Order: {item.display_order}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-30"
                          title="Move up"
                        >
                          <GripVertical size={16} />
                        </button>
                        <button
                          onClick={() => togglePublished(item.id, item.published)}
                          className="p-2 text-neutral-600 hover:text-neutral-900"
                          title={item.published ? 'Unpublish' : 'Publish'}
                        >
                          {item.published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <button
                        onClick={() => deleteItem(item.id, item.storage_path)}
                        className="p-2 text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Upload Image</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetForm();
                }}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Image File *
                </label>
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {uploadPreview ? (
                      <div className="relative w-full h-64">
                        <Image
                          src={uploadPreview}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto text-neutral-400 mb-4" size={48} />
                        <p className="text-neutral-600">Click to select an image</p>
                        <p className="text-sm text-neutral-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Enter image title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="Enter image description"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 text-primary border-neutral-300 rounded focus:ring-primary"
                />
                <label htmlFor="published" className="text-sm font-medium text-neutral-700">
                  Publish immediately
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetForm();
                }}
                className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadFile || !formData.title}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
