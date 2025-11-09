"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "London, UK",
    rating: 5,
    text: "The 7-day retreat was life-changing! The combination of yoga, ice baths, and healthy food in such a beautiful setting helped me reset completely. The instructors were knowledgeable and caring.",
    image: "SJ",
  },
  {
    name: "Marco Rossi",
    location: "Milan, Italy",
    rating: 5,
    text: "I came for the Wim Hof workshop and stayed for the whole experience. The ice bath sessions were challenging but incredibly rewarding. I left feeling stronger both mentally and physically.",
    image: "MR",
  },
  {
    name: "Anna Müller",
    location: "Munich, Germany",
    rating: 5,
    text: "Healthy Corner exceeded all my expectations. The food was delicious and nutritious, the yoga classes were perfect for all levels, and the Alpine setting is simply breathtaking. Highly recommend!",
    image: "AM",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-neutral-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Real experiences from people who transformed their health at Healthy Corner
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              <div className="absolute top-6 right-6 text-primary/20">
                <Quote size={48} />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.image}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">{testimonial.name}</h3>
                  <p className="text-sm text-neutral-600">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-neutral-700 leading-relaxed">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-neutral-600 mb-6">
            Join hundreds of satisfied guests who have transformed their health
          </p>
          <a
            href="#booking"
            className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Book Your Retreat
          </a>
        </motion.div>
      </div>
    </section>
  );
}
