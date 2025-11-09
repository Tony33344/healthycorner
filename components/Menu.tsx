"use client";

import { motion } from "framer-motion";
import { Leaf, Droplet, Apple, Coffee, Utensils } from "lucide-react";
import { useState } from "react";

const menuCategories = [
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "lunch", label: "Lunch", icon: Apple },
  { id: "dinner", label: "Dinner", icon: Utensils },
  { id: "drinks", label: "Drinks", icon: Droplet },
];

const menuItems = {
  breakfast: [
    { name: "Green Smoothie Bowl", description: "Spinach, banana, spirulina, topped with fresh berries and granola", price: "€8", tags: ["Vegan", "Gluten-free"] },
    { name: "Overnight Oats", description: "Organic oats, chia seeds, almond milk, seasonal fruits", price: "€7", tags: ["Vegan"] },
    { name: "Avocado Toast", description: "Sourdough bread, smashed avocado, cherry tomatoes, hemp seeds", price: "€9", tags: ["Vegan"] },
    { name: "Protein Pancakes", description: "Buckwheat pancakes, Greek yogurt, honey, fresh berries", price: "€10", tags: ["Vegetarian"] },
  ],
  lunch: [
    { name: "Buddha Bowl", description: "Quinoa, roasted vegetables, chickpeas, tahini dressing", price: "€12", tags: ["Vegan", "Gluten-free"] },
    { name: "Mediterranean Salad", description: "Mixed greens, olives, feta, cucumber, olive oil dressing", price: "€11", tags: ["Vegetarian", "Gluten-free"] },
    { name: "Lentil Soup", description: "Red lentils, vegetables, coconut milk, fresh herbs", price: "€9", tags: ["Vegan", "Gluten-free"] },
    { name: "Grilled Salmon", description: "Wild salmon, steamed vegetables, sweet potato mash", price: "€16", tags: ["Gluten-free"] },
  ],
  dinner: [
    { name: "Vegetable Curry", description: "Seasonal vegetables, coconut curry, brown rice", price: "€13", tags: ["Vegan", "Gluten-free"] },
    { name: "Zucchini Pasta", description: "Spiralized zucchini, tomato sauce, cashew parmesan", price: "€12", tags: ["Vegan", "Gluten-free"] },
    { name: "Stuffed Bell Peppers", description: "Quinoa, vegetables, herbs, tomato sauce", price: "€11", tags: ["Vegan", "Gluten-free"] },
    { name: "Grilled Chicken", description: "Free-range chicken, roasted vegetables, herb sauce", price: "€15", tags: ["Gluten-free"] },
  ],
  drinks: [
    { name: "Green Detox Juice", description: "Celery, cucumber, apple, lemon, ginger", price: "€6", tags: ["Vegan"] },
    { name: "Golden Milk", description: "Turmeric, ginger, cinnamon, almond milk, honey", price: "€5", tags: ["Vegetarian"] },
    { name: "Fresh Kombucha", description: "Homemade fermented tea, various flavors", price: "€5", tags: ["Vegan"] },
    { name: "Herbal Tea Selection", description: "Organic herbal teas from local sources", price: "€4", tags: ["Vegan"] },
  ],
};

export function Menu() {
  const [activeCategory, setActiveCategory] = useState("breakfast");

  return (
    <section id="menu" className="py-24 md:py-40 bg-neutral-50">
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
              OUR MENU
            </span>
            <div className="w-16 h-1 bg-primary mt-3 mx-auto"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
            Nourishing & Delicious
          </h2>
          <p className="text-xl text-neutral-700 font-light">
            Every dish is crafted with organic, locally-sourced ingredients to fuel your wellness journey
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === category.id
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <category.icon size={20} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {menuItems[activeCategory as keyof typeof menuItems].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-neutral-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-neutral-900">{item.name}</h3>
                <span className="text-primary font-bold text-lg">{item.price}</span>
              </div>
              <p className="text-neutral-600 mb-4 leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                  >
                    <Leaf size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-neutral-600 italic">
            All meals can be customized to accommodate dietary restrictions and allergies. Please inform our staff of any special requirements.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
