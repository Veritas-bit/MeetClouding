
"use client";

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useLocationStore } from '@/lib/location-store';
import { WISH_CATEGORIES, WishCategoryKey, WISH_CATEGORY_KEYS } from '@/lib/categories';
import { MapLoader } from '@/components/map/MapLoader';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { useProfileStore } from '@/lib/profile-store';
import { useInteractionStore } from '@/lib/interaction-store';

const Map = dynamic(() => import('@/components/map/Map'), {
  ssr: false,
  loading: () => <MapLoader isLoading={true} />,
});

export interface MarkerInfo {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  message: string;
  categoryName?: string;
  color?: string;
  isPremium?: boolean;
}

// Function to generate random coordinates within a given radius using a simple and robust method
const generateRandomMarkers = (center: [number, number], category: WishCategoryKey | null, radiusKm: number): MarkerInfo[] => {
    const markers: MarkerInfo[] = [];
    const count = 5 + Math.floor(radiusKm / 2) * 3;
    
    // Convert radius from kilometers to degrees (approximate)
    const radiusInDegrees = radiusKm / 111.32;

    for (let i = 0; i < count; i++) {
        const currentCategoryKey = category || WISH_CATEGORY_KEYS[Math.floor(Math.random() * WISH_CATEGORY_KEYS.length)];
        const categoryInfo = WISH_CATEGORIES[currentCategoryKey];
        
        const [centerLat, centerLon] = center;

        // Simple square bounding box generation
        const latOffset = (Math.random() - 0.5) * 2 * radiusInDegrees;
        const lonOffset = (Math.random() - 0.5) * 2 * radiusInDegrees / Math.cos(centerLat * Math.PI / 180);

        const newLat = centerLat + latOffset;
        const newLon = centerLon + lonOffset;
        
        // Final check for NaN or infinite values before pushing
        if (isNaN(newLat) || isNaN(newLon) || !isFinite(newLat) || !isFinite(newLon)) {
            console.warn("Skipping invalid marker generation due to invalid coordinates.");
            continue;
        }

        markers.push({
            id: `search-result-${i}-${newLat}-${newLon}`,
            userId: `${Math.floor(Math.random() * 10) + 1}`,
            latitude: newLat,
            longitude: newLon,
            message: `Это тестовое желание для категории '${categoryInfo.name}'`,
            categoryName: categoryInfo.name,
            color: categoryInfo.color,
            isPremium: Math.random() > 0.7
        });
    }
    return markers;
};


function MapContent() {
  const searchParams = useSearchParams();
  const { location, requestLocation } = useLocationStore();
  const { isPremium } = useProfileStore();
  const setHasInteractedWithMap = useInteractionStore((state) => state.setHasInteractedWithMap);
  
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    const isSearch = searchParams.get('search') === 'true';
    const isPublished = searchParams.get('published') === 'true';

    if (isSearch || isPublished) {
        setHasInteractedWithMap(true);
    }

    if (isSearch || isPublished) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [searchParams, setHasInteractedWithMap]);

  useEffect(() => {
    const isPublished = searchParams.get('published') === 'true';
    const isSearch = searchParams.get('search') === 'true';

    // Priority 1: A newly published wish. This does not depend on user location.
    if (isPublished) {
      const lat = parseFloat(searchParams.get('lat') || '0');
      const lon = parseFloat(searchParams.get('lon') || '0');
      const message = decodeURIComponent(searchParams.get('message') || '');
      const categoryName = decodeURIComponent(searchParams.get('categoryName') || 'Желание');
      const color = searchParams.get('color') || 'hsl(var(--primary))';

      if (lat && lon) {
        setCenter([lat, lon]);
        setMarkers([{
          id: `user-wish-${lat}-${lon}`,
          userId: '0', // Current user's wish
          latitude: lat,
          longitude: lon,
          message,
          categoryName,
          color,
          isPremium: isPremium
        }]);
      }
      return; // Exit early, as this is the highest priority
    }

    // Priority 2 & 3: Search or default view. These depend on user location.
    if (location) {
      setCenter([location.latitude, location.longitude]);

      if (isSearch) {
        const searchRadius = parseFloat(searchParams.get('radius') || '1');
        const searchCategory = searchParams.get('category') as WishCategoryKey | null;
        setMarkers(generateRandomMarkers([location.latitude, location.longitude], searchCategory, searchRadius));
      } else {
        // Default view, no markers
        setMarkers([]);
      }
    }
    // If location is not yet available, we do nothing and wait for the next re-render when it is.
    // The loading screen will be shown because `center` is still null.
    
  }, [location, searchParams, isPremium]);

  if (!center) {
    return <FullScreenLoader text={!location ? 'Определяем ваше местоположение...' : 'Загрузка карты...'} />;
  }

  return (
    <div className="flex-grow w-full relative">
        <MapLoader isLoading={isLoading} />
        <div className="flex-grow w-full h-full transition-opacity duration-300" style={{ opacity: isLoading ? 0 : 1 }}>
            <Map center={center} markers={markers} className="w-full h-full" />
        </div>
    </div>
  );
}

// Helper type, not exported
type WishKey = WishCategoryKey;

export default function MapPage() {
    return (
        <Suspense fallback={<FullScreenLoader text="Загрузка карты..." />}>
            <div className="flex flex-col flex-grow">
                <MapContent />
            </div>
        </Suspense>
    )
}
