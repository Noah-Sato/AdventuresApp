import type { StateCreator } from 'zustand';

export type EventLocation = {
  name: string;
  place_id: string;
  formatted_address: string;
  lat?: number;
  lng?: number;
};

export type EventDateRange = {
  startId?: string;
  endId?: string;
};

export type EventsSlice = {
  location: EventLocation | null;
  setLocation: (location: EventLocation | null) => void;
  resetLocation: () => void;

  dateRange: EventDateRange | null;
  setDateRange: (dateRange: EventDateRange | null) => void;
  resetDateRange: () => void;
  startTime: Date;
  setStartTime: (date: Date) => void;
  endTime: Date;
  setEndTime: (date: Date) => void;
  resetTimes: () => void;
};

const defaultTime = (hours: number, minutes: number) => {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
};

export const createEventsSlice: StateCreator<EventsSlice> = (set) => ({
  location: null,
  setLocation: (location) => set({ location }),
  resetLocation: () => set({ location: null }),

  dateRange: null,
  setDateRange: (dateRange) => set({ dateRange }),
  resetDateRange: () => set({ dateRange: null }),
  startTime: defaultTime(12, 0),
  setStartTime: (date) => set({startTime: date}),
  endTime: defaultTime(23, 59),
  setEndTime: (date) => set({endTime: date}),
  resetTimes: () => set({ startTime: defaultTime(12, 0), endTime: defaultTime(23, 59)})
});
