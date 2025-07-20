
"use client";

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useLocationStore } from '@/lib/location-store';
import { WISH_CATEGORIES, WishCategoryKey, WISH_CATEGORY_KEYS } from '@/lib/categories';
import { MapLoader } from '@/components/map/MapLoader';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { useProfileStore } from '@/lib/profile-store';

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

// Function to generate random coordinates within a given radius
const generateRandomMarkers = (center: [number, number], category: WishCategoryKey | null, radiusKm: number): MarkerInfo[] => {
    const markers: MarkerInfo[] = [];
    // Adjust marker count based on radius for a more populated feel in larger areas
    const count = 5 + Math.floor(radiusKm / 2) * 3; 

    for (let i = 0; i < count; i++) {
        // If no category is specified, pick a random one for each marker
        const currentCategoryKey = category || WISH_CATEGORY_KEYS[Math.floor(Math.random() * WISH_CATEGORY_KEYS.length)];
        const categoryInfo = WISH_CATEGORIES[currentCategoryKey];

        const angle = Math.random() * 2 * Math.PI;
        // Use Math.sqrt on a random number to ensure uniform distribution across the area of the circle
        const distance = Math.sqrt(Math.random()) * radiusKm;
        
        const latOffset = (distance / 111.32) * Math.cos(angle);
        const lonOffset = (distance / (111.32 * Math.cos(center[0] * (Math.PI / 180)))) * Math.sin(angle);
        
        // Rounding to prevent potential NaN issues with very small numbers or edge cases
        const lat = parseFloat((center[0] + latOffset).toFixed(6));
        const lon = parseFloat((center[1] + lonOffset).toFixed(6));

        markers.push({
            id: `search-result-${i}-${lat}-${lon}`,
            userId: `${Math.floor(Math.random() * 10) + 1}`, // Random user ID from 1 to 10
            latitude: lat,
            longitude: lon,
            message: `Это тестовое желание для категории '${categoryInfo.name}'`,
            categoryName: categoryInfo.name,
            color: categoryInfo.color,
            isPremium: Math.random() > 0.7 // ~30% of mock users are premium
        });
    }
    return markers;
};


function MapContent() {
  const searchParams = useSearchParams();
  const { location } = useLocationStore();
  const { isPremium } = useProfileStore();
  
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isSearch = searchParams.get('search') === 'true';
    const isPublished = searchParams.get('published') === 'true';

    // Show loader on navigation from search or publish to create a smooth transition effect
    if (isSearch || isPublished) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1500); // Adjust time as needed for map to load
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

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
    }

  }, [location, searchParams, isPremium]);

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
