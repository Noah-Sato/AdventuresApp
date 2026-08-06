import { create } from 'zustand';
import { createEventsSlice, type EventsSlice } from './slices/eventsSlice';

// Single composed store. Auth intentionally lives in `contexts/AuthProvider`, not here —
// it changes rarely and everything needs it, which is what React context is for; Zustand
// is reserved for higher-churn app data (create-event draft state, friends, etc.).
export const useStore = create<EventsSlice>()((...a) => ({
  ...createEventsSlice(...a),
}));
