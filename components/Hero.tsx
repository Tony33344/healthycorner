"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  background_image: string | null;
}

export function Hero() {
  const [content, setContent] = useState<HeroContent>({
    title: "healthy corner",
    subtitle: "ALPSKI ZDRAVILIŠKI KAMP",
    description: "Discover wellness through healthy nutrition, yoga, Wim Hof breathing, and ice baths in the heart of the Alps",
    background_image: null,
  });

  useEffect(() => {
    fetch('/api/content?section=hero', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          const heroData: any = {};
          data.content.forEach((item: any) => {
            if (item.key === 'title') heroData.title = item.value;
            if (item.key === 'subtitle') heroData.subtitle = item.value;
            if (item.key === 'description') heroData.description = item.value;
            if (item.key === 'background_image') heroData.background_image = item.image_url;
          });
          setContent(prev => ({ ...prev, ...heroData }));
        }
      })
      .catch(err => console.error('Failed to fetch hero content:', err));
  }, []);
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Image (optional) + soft white overlay */}
      <div className="absolute inset-0 z-0">
        {content.background_image ? (
          <Image src={content.background_image} alt="Hero background" fill className="object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-white/70" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 flex justify-center"
          >
            <div className="relative w-80 h-48">
              <Image
                src="/images/logo.png"
                alt="Healthy Corner Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold text-neutral-900 mb-3 lowercase tracking-tight"
          >
            {content.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm md:text-base text-neutral-600 mb-8 uppercase tracking-[0.4em] font-light"
          >
            {content.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-neutral-700 mb-12 max-w-2xl mx-auto"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="#booking"
              className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-xl"
            >
              Book Your Experience
            </Link>
            <Link
              href="#about"
              className="px-8 py-4 border-2 border-neutral-300 text-neutral-700 rounded-full font-semibold text-lg hover:border-neutral-500 transition-all bg-white"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-neutral-700 hover:text-neutral-900 transition-colors"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown size={24} />
        </motion.a>
      </motion.div>
    </section>
  );
}
