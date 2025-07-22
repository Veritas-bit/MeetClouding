
"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useLocationStore } from '@/lib/location-store';
import { WISH_CATEGORIES, WishCategoryKey, WISH_CATEGORY_KEYS } from '@/lib/categories';
import { MapLoader } from '@/components/map/MapLoader';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { useProfileStore, type Gender } from '@/lib/profile-store';
import { useInteractionStore } from '@/lib/interaction-store';
import { WISHES } from '@/lib/wishes';
import { useTranslation } from '@/hooks/use-translation';
import { getAllUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { useDebouncedCallback } from 'use-debounce';

// Lazy load the MapComponent
const MapComponent = dynamic(() => import('@/components/map/Map').then(mod => mod.MapComponent), {
    ssr: false,
    loading: () => <FullScreenLoader text="Загрузка карты..." />
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
  avatarUrl: string;
  gender: Gender;
}

// Function to generate random coordinates within a given radius using a simple and robust method
const generateRandomMarkers = (center: [number, number], category: WishCategoryKey | null, radiusKm: number, t: (key: any) => string, users: User[]): MarkerInfo[] => {
    const markers: MarkerInfo[] = [];
    const count = 5 + Math.floor(radiusKm / 2) * 3;
    
    // Convert radius from kilometers to degrees (approximate)
    const radiusInDegrees = radiusKm / 111.32;

    for (let i = 0; i < count; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const currentCategoryKey = category || WISH_CATEGORY_KEYS[Math.floor(Math.random() * WISH_CATEGORY_KEYS.length)];
        const categoryInfo = WISH_CATEGORIES[currentCategoryKey];
        const wishesForCategory = WISHES[currentCategoryKey];
        const randomWishKey = wishesForCategory[Math.floor(Math.random() * wishesForCategory.length)];
        const wishText = t(randomWishKey as any);
        
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
            userId: randomUser.id,
            latitude: newLat,
            longitude: newLon,
            message: `${t('iWant')} ${wishText}`,
            categoryName: categoryInfo.name,
            color: categoryInfo.color,
            isPremium: Math.random() > 0.7,
            avatarUrl: randomUser.avatarUrl,
            gender: randomUser.gender,
        });
    }
    return markers;
};


function MapContent() {
  const searchParams = useSearchParams();
  const t = useTranslation();
  const { location, requestLocation } = useLocationStore();
  const { isPremium, avatar, gender } = useProfileStore();
  const setHasInteractedWithMap = useInteractionStore((state) => state.setHasInteractedWithMap);
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapCenterRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    requestLocation();
    getAllUsers().then(setAllUsers);
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
    if (allUsers.length === 0) return; // Wait for users to be loaded
    
    const isPublished = searchParams.get('published') === 'true';
    const isSearch = searchParams.get('search') === 'true';
    
    const locationToUse = location || { latitude: 55.7558, longitude: 37.6173 }; // Use Moscow as fallback

    if (isPublished) {
      const lat = parseFloat(searchParams.get('lat') || `${locationToUse.latitude}`);
      const lon = parseFloat(searchParams.get('lon') || `${locationToUse.longitude}`);
      const message = decodeURIComponent(searchParams.get('message') || '');
      const categoryName = decodeURIComponent(searchParams.get('categoryName') || 'Желание');
      const color = searchParams.get('color') || 'hsl(var(--primary))';
      
      const ownWishMarker: MarkerInfo = {
        id: `user-wish-${lat}-${lon}`,
        userId: '0', // Current user's wish
        latitude: lat,
        longitude: lon,
        message,
        categoryName,
        color,
        isPremium: isPremium,
        avatarUrl: avatar,
        gender: gender,
      };

      const randomMarkers = generateRandomMarkers([lat, lon], null, 2, t, allUsers);
      setCenter([lat, lon]);
      setMarkers([ownWishMarker, ...randomMarkers]);
      mapCenterRef.current = [lat, lon];
      return;
    }
    
    if (location) {
      const newCenter: [number, number] = [location.latitude, location.longitude];
      setCenter(newCenter);
      mapCenterRef.current = newCenter;


      if (isSearch) {
        const searchRadius = parseFloat(searchParams.get('radius') || '1');
        const searchCategory = searchParams.get('category') as WishCategoryKey | null;
        setMarkers(generateRandomMarkers([location.latitude, location.longitude], searchCategory, searchRadius, t, allUsers));
      } else {
        // Default view: show random markers to make the world feel alive
        setMarkers(generateRandomMarkers([location.latitude, location.longitude], null, 2, t, allUsers));
      }
    }
    // If location is not yet available, we do nothing and wait for the next re-render when it is.
    // The loading screen will be shown because `center` is still null.
    
  }, [location, searchParams, isPremium, t, allUsers, avatar, gender]);
  
  const handleMapChange = useDebouncedCallback((newCenter: [number, number]) => {
    if (allUsers.length === 0) return;

    // Don't regenerate markers if the user is in a "published" or "search" state
    const isSpecialView = searchParams.get('published') === 'true' || searchParams.get('search') === 'true';
    if (isSpecialView) return;
    
    // Simple check to avoid re-generating for tiny movements
    if (mapCenterRef.current) {
      const [lastLat, lastLon] = mapCenterRef.current;
      const dist = Math.sqrt(Math.pow(newCenter[0] - lastLat, 2) + Math.pow(newCenter[1] - lastLon, 2));
      if (dist < 0.005) { // ~500m threshold, adjust as needed
        return;
      }
    }

    const newMarkers = generateRandomMarkers(newCenter, null, 2, t, allUsers);
    setMarkers(newMarkers);
    mapCenterRef.current = newCenter;
  }, 500); // Debounce to avoid excessive calls during fast panning

  if (!center) {
    return <FullScreenLoader text={!location ? 'Определяем ваше местоположение...' : 'Загрузка карты...'} />;
  }

  return (
    <div className="flex-grow w-full relative">
        <MapLoader isLoading={isLoading} />
        <div className="flex-grow w-full h-full transition-opacity duration-300" style={{ opacity: isLoading ? 0 : 1 }}>
            <MapComponent center={center} markers={markers} onMapChange={handleMapChange} className="w-full h-full" />
        </div>
    </div>
  );
}


export default function MapPage() {
    return (
        <Suspense fallback={<FullScreenLoader text="Загрузка карты..." />}>
            <div className="flex flex-col flex-grow">
                <MapContent />
            </div>
        </Suspense>
    )
}
