
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

        // Simple square bounding box generation to avoid complex math errors
        const latOffset = (Math.random() - 0.5) * 2 * radiusInDegrees;
        const lonOffset = (Math.random() - 0.5) * 2 * radiusInDegrees;

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
        const searchRadiusParam = searchParams.get('radius');
        // Ensure radius is a valid number before proceeding
        if (searchRadiusParam) {
            const searchRadius = parseFloat(searchRadiusParam);
            const searchCategory = searchParams.get('category') as WishKey | null;
            
            const searchCenter: [number, number] = [location.latitude, location.longitude];
            setCenter(searchCenter);
            setMarkers(generateRandomMarkers(searchCenter, searchCategory, searchRadius));
        } else {
            // Default behavior if radius is not provided
            setCenter([location.latitude, location.longitude]);
            setMarkers([]);
        }
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

// Helper type, not exported
type WishKey = WishCategoryKey;

export default function MapPage() {
    return (
        <Suspense fallback={<FullScreenLoader text="Загрузка карты..." />}>
            <MapContent />
        </Suspense>
    )
}
