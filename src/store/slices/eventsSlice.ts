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
};

export const createEventsSlice: StateCreator<EventsSlice> = (set) => ({
  location: null,
  setLocation: (location) => set({ location }),
  resetLocation: () => set({ location: null }),

  dateRange: null,
  setDateRange: (dateRange) => set({ dateRange }),
  resetDateRange: () => set({ dateRange: null }),
});
