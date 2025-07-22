
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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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
    if (get().isLoading || get().location) {
      return;
    }

    set({ isLoading: true });

    const attemptToGetLocation = (retriesLeft: number) => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        get().setLocation(MOSCOW_COORDS); // Fallback to Moscow if API not supported
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          get().setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn(`Geolocation attempt failed: ${error.message}. Retries left: ${retriesLeft}`);
          if (retriesLeft > 0) {
            setTimeout(() => attemptToGetLocation(retriesLeft - 1), RETRY_DELAY);
          } else {
            get().setError(error);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout to 15 seconds
          maximumAge: 0,
        }
      );
    };

    attemptToGetLocation(MAX_RETRIES - 1);
  },
}));
