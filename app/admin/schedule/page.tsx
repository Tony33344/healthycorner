"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Plus, Trash2, Save, X } from "lucide-react";

interface ClassItem {
  time: string;
  name: string;
  instructor?: string;
  duration?: string;
  spots?: number | "";
  price?: number | "";
}

interface DayItem {
  day: string;
  classes: ClassItem[];
}

interface ScheduleJSON {
  days: DayItem[];
}

type ScheduleEvent = { date: string; time: string; name: string; instructor?: string; duration?: string; spots?: number | ""; price?: number | "" };

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

export default function ScheduleManager() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classesItemId, setClassesItemId] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleJSON>(DEFAULT_SCHEDULE);
  const [eventsItemId, setEventsItemId] = useState<string | null>(null);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) loadSchedule();
  }, [user]);

  const notify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 2500);
  };

  const addEvent = () => {
    setEvents((prev) => [...prev, { date: "", time: "", name: "New Event", instructor: "", duration: "", spots: "", price: "" }]);
  };
  const updateEvent = (index: number, field: keyof ScheduleEvent, value: any) => {
    setEvents((prev) => prev.map((ev, i) => i === index ? { ...ev, [field]: field === 'spots' || field === 'price' ? (value === '' ? '' : Number(value)) : value } : ev));
  };
  const deleteEvent = (index: number) => {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  };

  const loadSchedule = async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/admin/content?section=schedule", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const items: any[] = json.content || [];
        let classesItem = items.find((i) => i.key === "classes");
        let eventsItem = items.find((i) => i.key === "events");
        if (!classesItem) {
          // create default classes item
          const createRes = await fetch("/api/admin/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: "schedule", key: "classes", json: DEFAULT_SCHEDULE, published: true }),
          });
          if (createRes.ok) {
            const created = await createRes.json();
            classesItem = created.item;
          }
        }
        if (!eventsItem) {
          const createRes2 = await fetch("/api/admin/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: "schedule", key: "events", json: [], published: true }),
          });
          if (createRes2.ok) {
            const created2 = await createRes2.json();
            eventsItem = created2.item;
          }
        }
        if (classesItem) {
          setClassesItemId(classesItem.id);
          const data: ScheduleJSON = classesItem.json || DEFAULT_SCHEDULE;
          // Ensure all 7 days exist in order
          const map = new Map<string, DayItem>(data.days?.map((d) => [d.day, d]));
          const merged: ScheduleJSON = {
            days: DEFAULT_SCHEDULE.days.map((dd) => map.get(dd.day) || dd),
          };
          setSchedule(merged);
        } else {
          setClassesItemId(null);
          setSchedule(DEFAULT_SCHEDULE);
        }
        if (eventsItem) {
          setEventsItemId(eventsItem.id);
          setEvents(Array.isArray(eventsItem.json) ? eventsItem.json : []);
        } else {
          setEventsItemId(null);
          setEvents([]);
        }
      }
    } catch (e) {
      console.error("Failed to load schedule", e);
      notify("error", "Failed to load schedule");
    } finally {
      setLoadingData(false);
    }
  };

  const save = async () => {
    if (!classesItemId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: classesItemId, json: schedule, published: true }),
      });
      if (!res.ok) {
        notify("error", "Failed to save schedule");
      } else {
        if (eventsItemId) {
          const res2 = await fetch("/api/admin/content", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: eventsItemId, json: events, published: true }),
          });
          if (!res2.ok) {
            notify("error", "Saved weekly classes, failed to save events");
          } else {
            notify("success", "Schedule saved");
          }
        } else {
          notify("success", "Schedule saved");
        }
      }
    } catch (e) {
      notify("error", "Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  const addClass = (dayIndex: number) => {
    setSchedule((prev) => {
      const next = { ...prev, days: prev.days.map((d) => ({ ...d, classes: [...d.classes] })) };
      next.days[dayIndex].classes.push({ time: "08:00", name: "New Class", instructor: "", duration: "60 min", spots: 12, price: "" });
      return next;
    });
  };

  const updateClass = (dayIndex: number, classIndex: number, field: keyof ClassItem, value: any) => {
    setSchedule((prev) => {
      const next = { ...prev, days: prev.days.map((d) => ({ ...d, classes: d.classes.map((c) => ({ ...c })) })) };
      const item = next.days[dayIndex].classes[classIndex];
      if (field === "spots") {
        item.spots = value === "" ? "" : Number(value);
      } else if (field === "price") {
        (item as any).price = value === "" ? "" : Number(value);
      } else {
        (item as any)[field] = value;
      }
      return next;
    });
  };

  const deleteClass = (dayIndex: number, classIndex: number) => {
    setSchedule((prev) => {
      const next = { ...prev, days: prev.days.map((d) => ({ ...d, classes: d.classes.map((c) => ({ ...c })) })) };
      next.days[dayIndex].classes.splice(classIndex, 1);
      return next;
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg ${notification.type === "success" ? "bg-green-600" : "bg-red-600"} text-white flex items-center gap-2`}>
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Schedule Manager</h1>
              <p className="text-sm text-neutral-600">Manage weekly classes & activities</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadSchedule}
                disabled={loadingData || saving}
                className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50"
              >
                Refresh
              </button>
              <button
                onClick={save}
                disabled={!classesItemId || saving}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} /> {saving ? "Saving..." : "Save All"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading schedule...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {schedule.days.map((day, dayIndex) => (
                <div key={day.day} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-neutral-900">{day.day}</h2>
                    <button
                      onClick={() => addClass(dayIndex)}
                      className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Plus size={16} /> Add Class
                    </button>
                  </div>
                  {day.classes.length === 0 ? (
                    <p className="text-sm text-neutral-500">No classes yet</p>
                  ) : (
                    <div className="space-y-3">
                      {day.classes.map((cls, classIndex) => (
                        <div key={classIndex} className="border border-neutral-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
                            <div className="md:col-span-1">
                              <label className="text-xs text-neutral-600">Time</label>
                              <input
                                value={cls.time}
                                onChange={(e) => updateClass(dayIndex, classIndex, "time", e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded"
                                placeholder="08:00"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-xs text-neutral-600">Name</label>
                              <input
                                value={cls.name}
                                onChange={(e) => updateClass(dayIndex, classIndex, "name", e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded"
                                placeholder="Morning Yoga"
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="text-xs text-neutral-600">Instructor</label>
                              <input
                                value={cls.instructor || ""}
                                onChange={(e) => updateClass(dayIndex, classIndex, "instructor", e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded"
                                placeholder="Ana"
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="text-xs text-neutral-600">Duration</label>
                              <input
                                value={cls.duration || ""}
                                onChange={(e) => updateClass(dayIndex, classIndex, "duration", e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded"
                                placeholder="60 min"
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="text-xs text-neutral-600">Spots</label>
                              <input
                                type="number"
                                value={cls.spots === "" || cls.spots === undefined ? "" : String(cls.spots)}
                                onChange={(e) => updateClass(dayIndex, classIndex, "spots", e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded"
                                placeholder="12"
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="text-xs text-neutral-600">Price (€)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={cls.price === "" || cls.price === undefined ? "" : String(cls.price)}
                                onChange={(e) => updateClass(dayIndex, classIndex, "price", e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded"
                                placeholder="15"
                              />
                            </div>
                            <div className="md:col-span-6 flex justify-end">
                              <button
                                onClick={() => deleteClass(dayIndex, classIndex)}
                                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2 text-sm"
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Date-specific Events / Overrides */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-neutral-900">Overrides & Events (date-specific)</h2>
                <button onClick={addEvent} className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm flex items-center gap-2"><Plus size={16} /> Add Event</button>
              </div>
              {events.length === 0 ? (
                <p className="text-sm text-neutral-500">No events yet</p>
              ) : (
                <div className="space-y-3">
                  {events.map((ev, idx) => (
                    <div key={idx} className="border border-neutral-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-8 gap-3 items-end">
                        <div className="md:col-span-2">
                          <label className="text-xs text-neutral-600">Date</label>
                          <input type="date" value={ev.date} onChange={(e) => updateEvent(idx, 'date', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded" />
                        </div>
                        <div className="md:col-span-1">
                          <label className="text-xs text-neutral-600">Time</label>
                          <input value={ev.time} onChange={(e) => updateEvent(idx, 'time', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded" placeholder="08:00" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-neutral-600">Name</label>
                          <input value={ev.name} onChange={(e) => updateEvent(idx, 'name', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded" placeholder="Workshop" />
                        </div>
                        <div className="md:col-span-1">
                          <label className="text-xs text-neutral-600">Instructor</label>
                          <input value={ev.instructor || ''} onChange={(e) => updateEvent(idx, 'instructor', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded" placeholder="Ana" />
                        </div>
                        <div className="md:col-span-1">
                          <label className="text-xs text-neutral-600">Spots</label>
                          <input type="number" value={ev.spots === '' || ev.spots === undefined ? '' : String(ev.spots)} onChange={(e) => updateEvent(idx, 'spots', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded" placeholder="12" />
                        </div>
                        <div className="md:col-span-1">
                          <label className="text-xs text-neutral-600">Price (€)</label>
                          <input type="number" step="0.01" value={ev.price === '' || ev.price === undefined ? '' : String(ev.price)} onChange={(e) => updateEvent(idx, 'price', e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded" placeholder="25" />
                        </div>
                        <div className="md:col-span-8 flex justify-end">
                          <button onClick={() => deleteEvent(idx)} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2 text-sm"><Trash2 size={16} /> Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
