
"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import type { ViewState } from 'react-map-gl/maplibre';
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
const generateRandomMarkers = (center: { latitude: number, longitude: number }, category: WishCategoryKey | null, radiusKm: number, t: (key: any) => string, users: User[]): MarkerInfo[] => {
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
        
        const centerLat = center.latitude;
        const centerLon = center.longitude;

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
  const [isLoading, setIsLoading] = useState(true);

  // Map view state
  const [viewState, setViewState] = useState<Partial<ViewState> | null>(null);

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

  // Effect to initialize or update map center and markers
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

        const randomMarkers = generateRandomMarkers({ latitude: lat, longitude: lon }, null, 2, t, allUsers);
        setMarkers([ownWishMarker, ...randomMarkers]);
        setViewState({ latitude: lat, longitude: lon, zoom: 13 });
        return;
    }
    
    if (location && !viewState) { // Only set initial viewState if it's not already set
        const newCenter = { latitude: location.latitude, longitude: location.longitude };
        setViewState({ ...newCenter, zoom: 13 });

        if (isSearch) {
            const searchRadius = parseFloat(searchParams.get('radius') || '1');
            const searchCategory = searchParams.get('category') as WishCategoryKey | null;
            setMarkers(generateRandomMarkers(newCenter, searchCategory, searchRadius, t, allUsers));
        } else {
            setMarkers(generateRandomMarkers(newCenter, null, 2, t, allUsers));
        }
    }
    
  }, [location, searchParams, isPremium, t, allUsers, avatar, gender, viewState]);
  
  const debouncedMarkerGeneration = useDebouncedCallback((newViewState: ViewState) => {
    if (allUsers.length === 0) return;
    
    const isSpecialView = searchParams.get('published') === 'true' || searchParams.get('search') === 'true';
    if (isSpecialView) return;

    const newMarkers = generateRandomMarkers({ latitude: newViewState.latitude, longitude: newViewState.longitude }, null, 2, t, allUsers);
    setMarkers(newMarkers);
  }, 500);

  const handleMapMove = useCallback((evt: any) => {
    const newViewState = evt.viewState;
    setViewState(newViewState);
    debouncedMarkerGeneration(newViewState);
  }, [debouncedMarkerGeneration]);

  if (!viewState) {
    return <FullScreenLoader text={!location ? 'Определяем ваше местоположение...' : 'Загрузка карты...'} />;
  }

  return (
    <div className="flex-grow w-full relative">
        <MapLoader isLoading={isLoading} />
        <div className="flex-grow w-full h-full transition-opacity duration-300" style={{ opacity: isLoading ? 0 : 1 }}>
            <MapComponent 
                initialViewState={viewState} 
                markers={markers} 
                onMove={handleMapMove}
                className="w-full h-full" 
            />
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
