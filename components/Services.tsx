"use client";

import { motion } from "framer-motion";
import { Utensils, Activity, Wind, Snowflake, Users, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_SERVICES = [
  {
    icon: Utensils,
    title: "Healthy Nutrition",
    description: "Organic, locally-sourced meals designed to nourish your body and delight your taste buds. Our menu focuses on whole foods, plant-based options, and balanced nutrition.",
    features: ["Organic ingredients", "Plant-based options", "Customized meal plans", "Nutritional guidance"],
    color: "from-green-400 to-primary",
  },
  {
    icon: Activity,
    title: "Yoga Classes",
    description: "Daily yoga sessions for all levels, from gentle morning flows to dynamic vinyasa. Connect with your body and find inner peace in our serene Alpine setting.",
    features: ["Morning & evening classes", "All levels welcome", "Private sessions", "Meditation included"],
    color: "from-purple-400 to-pink-400",
  },
  {
    icon: Wind,
    title: "Wim Hof Method",
    description: "Learn the powerful breathing techniques and cold exposure methods developed by Wim Hof. Boost your immune system, increase energy, and reduce stress.",
    features: ["Breathing workshops", "Cold exposure training", "Certified instructors", "Progressive programs"],
    color: "from-blue-400 to-cyan-400",
  },
  {
    icon: Snowflake,
    title: "Ice Baths",
    description: "Experience the transformative power of cold therapy. Our guided ice bath sessions help reduce inflammation, improve recovery, and enhance mental resilience.",
    features: ["Guided sessions", "Safe protocols", "Recovery support", "Mental coaching"],
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Users,
    title: "Group Programs",
    description: "Join our community wellness programs designed for groups. Perfect for team building, retreats, or connecting with like-minded individuals.",
    features: ["Team building", "Corporate retreats", "Group discounts", "Custom packages"],
    color: "from-orange-400 to-red-400",
  },
  {
    icon: Calendar,
    title: "Wellness Retreats",
    description: "Multi-day immersive experiences combining all our services. Transform your health and lifestyle in our comprehensive wellness retreats.",
    features: ["3-7 day programs", "All-inclusive", "Personal coaching", "Lasting results"],
    color: "from-primary to-yellow-400",
  },
];

export function Services() {
  const [items, setItems] = useState<Array<{ name: string; description?: string }>>([]);
  const [content, setContent] = useState({
    heading: "Comprehensive Wellness Programs",
    description: "Discover our range of services designed to support your journey to optimal health and vitality",
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/services', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json?.services) ? json.services.map((s: any) => ({ name: s?.name, description: s?.description })) : [];
        if (active && list.length > 0) setItems(list);
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    fetch('/api/content?section=services', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          const servicesData: any = {};
          data.content.forEach((item: any) => {
            if (item.key === 'heading') servicesData.heading = item.value;
            if (item.key === 'description') servicesData.description = item.value;
          });
          setContent(prev => ({ ...prev, ...servicesData }));
        }
      })
      .catch(err => console.error('Failed to fetch services content:', err));
  }, []);

  // map dynamic items onto a styled card set; fallback to defaults when empty
  const iconCycle = [Utensils, Activity, Wind, Snowflake, Users, Calendar];
  const cards = items.length > 0
    ? items.map((it, idx) => ({
        icon: iconCycle[idx % iconCycle.length],
        title: it.name,
        description: it.description || "",
        features: [],
        color: [
          "from-green-400 to-primary",
          "from-purple-400 to-pink-400",
          "from-blue-400 to-cyan-400",
          "from-cyan-400 to-blue-500",
          "from-orange-400 to-red-400",
          "from-primary to-yellow-400",
        ][idx % 6],
      }))
    : DEFAULT_SERVICES;

  return (
    <section id="services" className="py-24 md:py-40 bg-white">
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
              OUR SERVICES
            </span>
            <div className="w-16 h-1 bg-primary mt-3 mx-auto"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
            {content.heading}
          </h2>
          <p className="text-xl text-neutral-700 font-light">
            {content.description}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 h-full shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 hover:border-primary/20">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="text-white" size={32} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2">
                    {service.features.map((feature: string) => (
                      <li key={feature} className="flex items-center text-sm text-neutral-600">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA */}
                <a 
                  href="#booking"
                  className="mt-6 w-full py-3 border-2 border-neutral-200 rounded-full font-semibold text-neutral-700 hover:border-primary hover:text-primary transition-colors block text-center"
                >
                  Book Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
