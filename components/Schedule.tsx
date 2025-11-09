"use client";

import { motion } from "framer-motion";
import { Clock, Users, MapPin } from "lucide-react";

const schedule = [
  {
    day: "Monday",
    classes: [
      { time: "07:00", name: "Morning Yoga Flow", instructor: "Ana", duration: "60 min", spots: 12 },
      { time: "09:00", name: "Wim Hof Breathing", instructor: "Marko", duration: "45 min", spots: 15 },
      { time: "11:00", name: "Ice Bath Session", instructor: "Marko", duration: "30 min", spots: 8 },
      { time: "17:00", name: "Sunset Yoga", instructor: "Ana", duration: "60 min", spots: 12 },
    ],
  },
  {
    day: "Tuesday",
    classes: [
      { time: "07:00", name: "Meditation & Breathwork", instructor: "Ana", duration: "45 min", spots: 15 },
      { time: "09:30", name: "Power Yoga", instructor: "Luka", duration: "75 min", spots: 10 },
      { time: "14:00", name: "Nutrition Workshop", instructor: "Nina", duration: "90 min", spots: 20 },
      { time: "17:00", name: "Yin Yoga", instructor: "Ana", duration: "60 min", spots: 12 },
    ],
  },
  {
    day: "Wednesday",
    classes: [
      { time: "07:00", name: "Morning Yoga Flow", instructor: "Ana", duration: "60 min", spots: 12 },
      { time: "09:00", name: "Wim Hof Method", instructor: "Marko", duration: "90 min", spots: 12 },
      { time: "11:00", name: "Ice Bath Session", instructor: "Marko", duration: "30 min", spots: 8 },
      { time: "16:00", name: "Restorative Yoga", instructor: "Ana", duration: "75 min", spots: 12 },
    ],
  },
  {
    day: "Thursday",
    classes: [
      { time: "07:00", name: "Vinyasa Flow", instructor: "Luka", duration: "60 min", spots: 12 },
      { time: "09:00", name: "Cold Exposure Training", instructor: "Marko", duration: "60 min", spots: 10 },
      { time: "14:00", name: "Cooking Class", instructor: "Nina", duration: "120 min", spots: 15 },
      { time: "17:00", name: "Evening Meditation", instructor: "Ana", duration: "45 min", spots: 15 },
    ],
  },
  {
    day: "Friday",
    classes: [
      { time: "07:00", name: "Morning Yoga Flow", instructor: "Ana", duration: "60 min", spots: 12 },
      { time: "09:00", name: "Wim Hof Breathing", instructor: "Marko", duration: "45 min", spots: 15 },
      { time: "11:00", name: "Ice Bath Session", instructor: "Marko", duration: "30 min", spots: 8 },
      { time: "17:00", name: "Sunset Yoga", instructor: "Ana", duration: "60 min", spots: 12 },
    ],
  },
  {
    day: "Saturday",
    classes: [
      { time: "08:00", name: "Weekend Warrior Yoga", instructor: "Luka", duration: "90 min", spots: 15 },
      { time: "10:30", name: "Wim Hof Workshop", instructor: "Marko", duration: "120 min", spots: 12 },
      { time: "15:00", name: "Nature Walk & Meditation", instructor: "Ana", duration: "90 min", spots: 20 },
    ],
  },
  {
    day: "Sunday",
    classes: [
      { time: "08:00", name: "Gentle Morning Yoga", instructor: "Ana", duration: "60 min", spots: 15 },
      { time: "10:00", name: "Wellness Brunch & Talk", instructor: "Nina", duration: "120 min", spots: 25 },
      { time: "16:00", name: "Restorative Yoga", instructor: "Ana", duration: "75 min", spots: 12 },
    ],
  },
];

export function Schedule() {
  return (
    <section id="schedule" className="py-24 md:py-40 bg-white">
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
              WEEKLY SCHEDULE
            </span>
            <div className="w-16 h-1 bg-primary mt-3 mx-auto"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
            Classes & Activities
          </h2>
          <p className="text-xl text-neutral-700 font-light">
            Join our daily classes and workshops designed to support your wellness journey
          </p>
        </motion.div>

        {/* Schedule Grid */}
        <div className="space-y-8">
          {schedule.map((day, dayIndex) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                <div className="w-2 h-8 bg-primary rounded-full mr-4" />
                {day.day}
              </h3>

              <div className="grid gap-4">
                {day.classes.map((classItem, index) => (
                  <motion.div
                    key={`${day.day}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-primary/5 transition-colors group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center text-primary font-semibold">
                          <Clock size={16} className="mr-2" />
                          {classItem.time}
                        </div>
                        <span className="text-neutral-400">•</span>
                        <span className="text-neutral-600 text-sm">{classItem.duration}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-neutral-900 mb-1">
                        {classItem.name}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        with {classItem.instructor}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <div className="flex items-center text-neutral-600 text-sm">
                        <Users size={16} className="mr-2" />
                        {classItem.spots} spots
                      </div>
                      <a 
                        href="#booking"
                        className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Book
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 bg-primary/10 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <MapPin className="text-primary mr-2" size={24} />
            <h3 className="text-xl font-bold text-neutral-900">Location</h3>
          </div>
          <p className="text-neutral-700 mb-2">
            All classes take place at Healthy Corner, Camp Menina
          </p>
          <p className="text-neutral-600 text-sm">
            Please arrive 10 minutes early for your first class. Bring comfortable clothing and a water bottle.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
