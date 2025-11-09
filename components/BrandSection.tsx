"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function BrandSection() {
  return (
    <section className="py-24 md:py-32 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Logo on Lime Green Background */}
          <div className="mb-12 flex justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-black rounded-full flex items-center justify-center">
                <div className="text-white font-bold text-6xl lowercase">h</div>
                <div className="absolute bottom-6 w-12 h-6 border-b-4 border-white rounded-full"></div>
              </div>
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-black mb-6 lowercase">
            healthy corner
          </h2>
          
          <p className="text-sm md:text-base text-black/80 mb-12 uppercase tracking-[0.4em] font-light">
            ALPSKI ZDRAVILIŠKI KAMP
          </p>

          <div className="max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl text-black font-light leading-relaxed mb-8">
              Experience the perfect blend of nature, wellness, and transformation in the heart of the Slovenian Alps.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-5xl font-bold text-black mb-2">100+</div>
                <div className="text-black/80 uppercase tracking-wider text-sm">Happy Guests</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-black mb-2">50+</div>
                <div className="text-black/80 uppercase tracking-wider text-sm">Weekly Classes</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-black mb-2">5+</div>
                <div className="text-black/80 uppercase tracking-wider text-sm">Years Experience</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
