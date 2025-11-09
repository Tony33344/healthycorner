"use client";

import { motion } from "framer-motion";
import { Clock, Users, MapPin } from "lucide-react";

type ClassItem = { time: string; name: string; instructor?: string; duration?: string; spots?: number };
type DayItem = { day: string; classes: ClassItem[] };
type ScheduleJSON = { days: DayItem[] };

const DEFAULT_SCHEDULE: ScheduleJSON = {
  days: [
    { day: "Monday", classes: [] },
    { day: "Tuesday", classes: [] },
    { day: "Wednesday", classes: [] },
    { day: "Thursday", classes: [] },
    { day: "Friday", classes: [] },
    { day: "Saturday", classes: [] },
    { day: "Sunday", classes: [] },
  ],
};

import { useEffect, useState } from "react";

export function Schedule() {
  const [label, setLabel] = useState("WEEKLY SCHEDULE");
  const [heading, setHeading] = useState("Classes & Activities");
  const [description, setDescription] = useState("Join our daily classes and workshops designed to support your wellness journey");
  const [data, setData] = useState<ScheduleJSON>(DEFAULT_SCHEDULE);

  useEffect(() => {
    fetch('/api/content?section=schedule', { cache: 'no-store' })
      .then(res => res.json())
      .then(payload => {
        const items = payload?.content || [];
        const byKey: Record<string, any> = {};
        items.forEach((it: any) => { byKey[it.key] = it; });
        if (byKey['label']?.value) setLabel(byKey['label'].value);
        if (byKey['heading']?.value) setHeading(byKey['heading'].value);
        if (byKey['description']?.value) setDescription(byKey['description'].value);
        const classesJson = byKey['classes']?.json;
        if (classesJson && Array.isArray(classesJson.days)) {
          // Ensure 7 days order using default map
          const map = new Map<string, DayItem>(classesJson.days.map((d: DayItem) => [d.day, d]));
          const merged: ScheduleJSON = { days: DEFAULT_SCHEDULE.days.map(d => map.get(d.day) || d) };
          setData(merged);
        }
      })
      .catch(() => {});
  }, []);
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
              {label}
            </span>
            <div className="w-16 h-1 bg-primary mt-3 mx-auto"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
            {heading}
          </h2>
          <p className="text-xl text-neutral-700 font-light">
            {description}
          </p>
        </motion.div>

        {/* Schedule Grid */}
        <div className="space-y-8">
          {data.days.map((day, dayIndex) => (
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
                        <span className="text-neutral-600 text-sm">{classItem.duration || ''}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-neutral-900 mb-1">
                        {classItem.name}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {classItem.instructor ? `with ${classItem.instructor}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <div className="flex items-center text-neutral-600 text-sm">
                        <Users size={16} className="mr-2" />
                        {classItem.spots ? `${classItem.spots} spots` : ' '}
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
