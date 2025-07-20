"use client";

import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  requestLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  error: null,
  requestLocation: () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          set({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          set({ error: error.message });
        }
      );
    } else {
      set({ error: "Geolocation is not supported by this browser." });
    }
  },
}));
