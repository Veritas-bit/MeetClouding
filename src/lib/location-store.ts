
import { create } from 'zustand';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationState {
  location: Location | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
  setLocation: (location: Location) => void;
  setError: (error: GeolocationPositionError) => void;
  requestLocation: () => void;
}

const MOSCOW_COORDS = { latitude: 55.7558, longitude: 37.6173 };

export const useLocationStore = create<LocationState>((set, get) => ({
  location: null,
  error: null,
  isLoading: false,
  setLocation: (location) => set({ location, error: null, isLoading: false }),
  setError: (error) => {
    console.error("Geolocation error:", error);
    set({ error, location: MOSCOW_COORDS, isLoading: false }); // Fallback to Moscow
  },
  requestLocation: () => {
    // Prevent new request only if we already have a location or an error.
    // Allow request if it's currently loading, in case the first one fails.
    if (get().location || get().error || get().isLoading) {
      return;
    }

    set({ isLoading: true });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          get().setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          get().setError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      get().setLocation(MOSCOW_COORDS); // Fallback to Moscow if API not supported
    }
  },
}));
