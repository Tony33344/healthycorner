"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

const galleryImages = [
  {
    id: 1,
    category: "icebath",
    title: "Ice Bath Ceremony",
    description: "Embrace the cold for ultimate wellness",
    image: "/images/gallery/DSC_4910.JPG",
  },
  {
    id: 2,
    category: "icebath",
    title: "Breathing Preparation",
    description: "Master the Wim Hof breathing technique",
    image: "/images/gallery/DSC_4915.JPG",
  },
  {
    id: 3,
    category: "icebath",
    title: "Cold Immersion",
    description: "Experience the transformative power of cold",
    image: "/images/gallery/DSC_4934.JPG",
  },
  {
    id: 4,
    category: "icebath",
    title: "Mindful Practice",
    description: "Connect mind and body through breath",
    image: "/images/gallery/DSC_4986.JPG",
  },
  {
    id: 5,
    category: "icebath",
    title: "Group Session",
    description: "Share the journey with others",
    image: "/images/gallery/DSC_5027.JPG",
  },
  {
    id: 6,
    category: "icebath",
    title: "Recovery & Reflection",
    description: "Integrate the experience",
    image: "/images/gallery/DSC_5148.JPG",
  },
  {
    id: 7,
    category: "icebath",
    title: "Alpine Ice Bath",
    description: "Natural cold therapy in the mountains",
    image: "/images/gallery/DSC_5157.JPG",
  },
  {
    id: 8,
    category: "food",
    title: "Healthy Breakfast Bowl",
    description: "Nutritious and delicious organic meals",
    image: "/images/gallery/DSC_4866.JPG",
  },
  {
    id: 9,
    category: "food",
    title: "Fresh Ingredients",
    description: "Farm-to-table quality",
    image: "/images/gallery/DSC_4870.JPG",
  },
  {
    id: 10,
    category: "food",
    title: "Nourishing Meals",
    description: "Fuel your wellness journey",
    image: "/images/gallery/DSC_4872.JPG",
  },
  {
    id: 11,
    category: "food",
    title: "Organic Selection",
    description: "Carefully curated ingredients",
    image: "/images/gallery/DSC_4886.JPG",
  },
  {
    id: 12,
    category: "food",
    title: "Wholesome Nutrition",
    description: "Balanced and delicious",
    image: "/images/gallery/DSC_4890.JPG",
  },
  {
    id: 13,
    category: "food",
    title: "Culinary Excellence",
    description: "Taste meets nutrition",
    image: "/images/gallery/DSC_4906.JPG",
  },
];

const defaultCategories = [
  { id: "all", label: "All" },
  { id: "icebath", label: "Ice Bath & Breathing" },
  { id: "food", label: "Healthy Food" },
];

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [items, setItems] = useState<typeof galleryImages>(galleryImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/gallery', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const arr = Array.isArray(json?.items) ? json.items : [];
          if (alive && arr.length > 0) {
            const mapped = arr.map((it: any, idx: number) => ({
              id: idx + 1,
              category: it.category,
              title: it.title,
              description: it.description || '',
              image: it.image_url,
            }));
            setItems(mapped);
          }
        }
      } catch {}
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(items.map(i => i.category)));
    const mapped = dynamic.map(id => ({ id, label: id.charAt(0).toUpperCase() + id.slice(1) }));
    return [{ id: 'all', label: 'All' }, ...(mapped.length ? mapped : defaultCategories.slice(1))];
  }, [items]);

  const filteredImages = activeCategory === "all" 
    ? items 
    : items.filter(img => img.category === activeCategory);

  return (
    <section id="gallery" className="py-24 md:py-40 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="mb-8">
            <span className="text-primary font-bold text-sm uppercase tracking-[0.3em]">
              GALLERY
            </span>
            <div className="w-16 h-1 bg-primary mt-3 mx-auto"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
            Experience Healthy Corner
          </h2>
          <p className="text-xl text-neutral-700 font-light">
            Explore our facilities, classes, and the beautiful Alpine environment
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="col-span-full text-center text-neutral-500 py-12">No images found</div>
          ) : filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image.id)}
            >
              {/* Actual Image */}
              <Image
                src={image.image}
                alt={image.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-end p-6">
                <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {image.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {image.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-w-5xl w-full h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const image = galleryImages.find(img => img.id === selectedImage);
                return image ? (
                  <>
                    <Image
                      src={image.image}
                      alt={image.title}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <h3 className="text-white font-bold text-2xl mb-2">{image.title}</h3>
                      <p className="text-white/90">{image.description}</p>
                    </div>
                  </>
                ) : null;
              })()}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
