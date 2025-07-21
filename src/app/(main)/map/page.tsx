
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

// Function to generate random coordinates within a given radius using a more robust method
const generateRandomMarkers = (center: [number, number], category: WishCategoryKey | null, radiusKm: number): MarkerInfo[] => {
    const markers: MarkerInfo[] = [];
    const count = 5 + Math.floor(radiusKm / 2) * 3; 

    for (let i = 0; i < count; i++) {
        const currentCategoryKey = category || WISH_CATEGORY_KEYS[Math.floor(Math.random() * WISH_CATEGORY_KEYS.length)];
        const categoryInfo = WISH_CATEGORIES[currentCategoryKey];
        
        const y0 = center[0];
        const x0 = center[1];
        // Convert radius from kilometers to degrees
        const rd = radiusKm / 111.32;

        const u = Math.random();
        const v = Math.random();

        const w = rd * Math.sqrt(u);
        const t = 2 * Math.PI * v;
        const x = w * Math.cos(t);
        const y = w * Math.sin(t);
        
        // Adjust the x-coordinate for the shrinking of the east-west distances
        const new_x = x / Math.cos(y0 * Math.PI / 180);

        let newLat = y + y0;
        let newLon = new_x + x0;

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
  const { location } = useLocationStore();
  const { isPremium } = useProfileStore();
  const setHasInteractedWithMap = useInteractionStore((state) => state.setHasInteractedWithMap);
  
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isSearch = searchParams.get('search') === 'true';
    const isPublished = searchParams.get('published') === 'true';

    if (isSearch || isPublished) {
        setHasInteractedWithMap(true);
    }

    // Show loader on navigation from search or publish to create a smooth transition effect
    if (isSearch || isPublished) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1500); // Adjust time as needed for map to load
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [searchParams, setHasInteractedWithMap]);

  useEffect(() => {
    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');
    const isPublished = searchParams.get('published') === 'true';
    const isSearch = searchParams.get('search') === 'true';

    // Wait for user location to be determined first
    if (!location) return;

    // Priority 1: Search results
    if (isSearch) {
        const searchRadius = parseFloat(searchParams.get('radius') || '5');
        const searchCategory = searchParams.get('category') as WishCategoryKey | null;
        
        const searchCenter: [number, number] = [location.latitude, location.longitude];
        setCenter(searchCenter);
        // Pass category (or null if not provided) to the generator function
        setMarkers(generateRandomMarkers(searchCenter, searchCategory, searchRadius));
    }
    // Priority 2: Center on the published wish from URL
    else if (isPublished && latParam && lonParam) {
        const lat = parseFloat(latParam);
        const lon = parseFloat(lonParam);
        const message = decodeURIComponent(searchParams.get('message') || '');
        const categoryName = decodeURIComponent(searchParams.get('categoryName') || 'Желание');
        const color = searchParams.get('color') || 'hsl(var(--primary))';

        setCenter([lat, lon]);
        setMarkers([{
            id: `user-wish-${lat}-${lon}`,
            userId: '0', // Current user's wish
            latitude: lat,
            longitude: lon,
            message: message,
            categoryName: categoryName,
            color: color,
            isPremium: isPremium
        }]);
    } 
    // Priority 3: Default to user's current location
    else {
      setCenter([location.latitude, location.longitude]);
      setMarkers([]); // No markers by default
      setHasInteractedWithMap(false); // Reset on default map view
    }

  }, [location, searchParams, isPremium, setHasInteractedWithMap]);

  if (!center) {
    return <FullScreenLoader text={!location ? 'Определяем ваше местоположение...' : 'Загрузка карты...'} />;
  }

  return (
    <div className="flex-grow w-full h-full relative">
        <MapLoader isLoading={isLoading} />
        <div className="flex-grow w-full h-full transition-opacity duration-300" style={{ opacity: isLoading ? 0 : 1 }}>
            <Map center={center} markers={markers} className="w-full h-full" />
        </div>
    </div>
  );
}

export default function MapPage() {
    return (
        <Suspense fallback={<FullScreenLoader text="Загрузка карты..." />}>
            <MapContent />
        </Suspense>
    )
}
