
"use client";

import { Suspense, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useLocationStore } from '@/lib/location-store';
import { WISH_CATEGORIES, WishCategoryKey, WISH_CATEGORY_KEYS } from '@/lib/categories';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { useProfileStore, type Gender } from '@/lib/profile-store';
import { useInteractionStore } from '@/lib/interaction-store';
import { WISHES } from '@/lib/wishes';
import { useTranslation } from '@/hooks/use-translation';
import { getAllUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import type { YMapLocation } from 'ymap3-components';


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
    const count = 25 + Math.floor(radiusKm) * 10; // More markers for a larger area
    
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
  
  // Map view state
  const [mapLocation, setMapLocation] = useState<YMapLocation | null>(null);

  useEffect(() => {
    requestLocation();
    getAllUsers().then(setAllUsers);
  }, [requestLocation]);

  // Effect to initialize markers and view state, runs once after location and users are fetched.
  useEffect(() => {
    if (!location || allUsers.length === 0 || mapLocation) return;

    const isPublished = searchParams.get('published') === 'true';
    const isSearch = searchParams.get('search') === 'true';

    if (isPublished || isSearch) {
      setHasInteractedWithMap(true);
    }

    let initialCenter = { latitude: location.latitude, longitude: location.longitude };
    let initialMarkers: MarkerInfo[] = [];

    if (isPublished) {
        const lat = parseFloat(searchParams.get('lat') || `${location.latitude}`);
        const lon = parseFloat(searchParams.get('lon') || `${location.longitude}`);
        initialCenter = { latitude: lat, longitude: lon };

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
        initialMarkers.push(ownWishMarker);
    }
    
    if (isSearch) {
        const searchRadius = parseFloat(searchParams.get('radius') || '5');
        const searchCategory = searchParams.get('category') as WishCategoryKey | null;
        initialMarkers.push(...generateRandomMarkers(initialCenter, searchCategory, searchRadius, t, allUsers));
    } else {
        // Default view or published view: add random markers
        initialMarkers.push(...generateRandomMarkers(initialCenter, null, 5, t, allUsers));
    }
    
    setMarkers(initialMarkers);
    setMapLocation({ center: [initialCenter.longitude, initialCenter.latitude], zoom: 12 });
    
  }, [location, allUsers, searchParams, isPremium, t, avatar, gender, setHasInteractedWithMap, mapLocation]);
  
  const handleMapUpdate = useCallback((newLocation: YMapLocation) => {
    // We can use this callback to update state if needed, e.g., for saving map position
  }, []);

  if (!mapLocation) {
    return <FullScreenLoader text={!location ? 'Определяем ваше местоположение...' : 'Загрузка карты...'} />;
  }

  return (
    <div className="flex-grow w-full relative">
        <MapComponent 
            location={mapLocation} 
            markers={markers} 
            className="w-full h-full"
            onUpdate={handleMapUpdate}
        />
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
