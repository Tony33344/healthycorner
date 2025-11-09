"use client";

import { motion } from "framer-motion";
import { Heart, Leaf, Mountain, Sparkles } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Natural Living",
    description: "Embrace a lifestyle rooted in nature and organic wellness practices",
  },
  {
    icon: Heart,
    title: "Holistic Health",
    description: "Balance mind, body, and spirit through integrated wellness programs",
  },
  {
    icon: Mountain,
    title: "Alpine Setting",
    description: "Experience the healing power of the pristine Alpine environment",
  },
  {
    icon: Sparkles,
    title: "Transformative",
    description: "Create lasting positive changes in your health and lifestyle",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 md:py-40 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <span className="text-primary font-bold text-sm uppercase tracking-[0.3em]">
                ABOUT US
              </span>
              <div className="w-16 h-1 bg-primary mt-3"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
              Your Journey to Wellness Begins Here
            </h2>
            
            <p className="text-xl text-neutral-700 mb-6 leading-relaxed font-light">
              Nestled in the breathtaking Camp Menina, Healthy Corner is more than just a wellness retreat—it's a transformative experience that reconnects you with your body, mind, and nature.
            </p>
            
            <p className="text-xl text-neutral-700 mb-10 leading-relaxed font-light">
              We combine ancient wisdom with modern wellness practices, offering a unique blend of nutritious cuisine, yoga, the powerful Wim Hof method, and invigorating ice baths. Our mission is to help you discover your optimal health and vitality in the pure Alpine air.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">5+</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Years</p>
                  <p className="text-sm text-neutral-600">Experience</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">500+</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Happy</p>
                  <p className="text-sm text-neutral-600">Guests</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-neutral-50 rounded-2xl hover:bg-primary/5 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
