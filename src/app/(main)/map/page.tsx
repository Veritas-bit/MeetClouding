
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
    // Request location only if not coming from a public link
    if (!searchParams.get('published')) {
      requestLocation();
    }
    getAllUsers().then(setAllUsers);
  }, [requestLocation, searchParams]);

  // Effect to initialize markers and view state
  useEffect(() => {
    const isPublished = searchParams.get('published') === 'true';
    const isSearch = searchParams.get('search') === 'true';
    const fromChat = searchParams.get('from') === 'chat';

    // If map already initialized, do nothing.
    if (mapLocation) return;
    
    // If not a public link or search, and location/users aren't ready, wait.
    if (!isPublished && !fromChat && (!location || allUsers.length === 0)) return;
    
    // If it is a public link but users aren't ready, wait.
    if ((isPublished || fromChat) && allUsers.length === 0) return;


    // Set that user has interacted with map to show back button on other pages
    setHasInteractedWithMap(true);


    let initialCenter: { latitude: number, longitude: number };
    let initialMarkers: MarkerInfo[] = [];

    const latParam = parseFloat(searchParams.get('lat') || '0');
    const lonParam = parseFloat(searchParams.get('lon') || '0');

    if (fromChat) {
        if (!latParam || !lonParam) return;
        initialCenter = { latitude: latParam, longitude: lonParam };
        initialMarkers.push({
            id: `user-location-${latParam}-${lonParam}`,
            userId: '0', 
            latitude: latParam,
            longitude: lonParam,
            message: 'Отправленная геопозиция',
            categoryName: 'Геопозиция',
            color: 'hsl(var(--accent))',
            isPremium: false,
            avatarUrl: avatar,
            gender: gender,
        });

    } else if (isPublished) {
        // If lat/lon are invalid, don't render the map yet.
        if (!latParam || !lonParam) return;

        initialCenter = { latitude: latParam, longitude: lonParam };

        const message = decodeURIComponent(searchParams.get('message') || '');
        const categoryName = decodeURIComponent(searchParams.get('categoryName') || 'Желание');
        const color = searchParams.get('color') || 'hsl(var(--primary))';
        
        const ownWishMarker: MarkerInfo = {
            id: `user-wish-${latParam}-${lonParam}`,
            userId: '0', // Current user's wish
            latitude: latParam,
            longitude: lonParam,
            message,
            categoryName,
            color,
            isPremium: isPremium,
            avatarUrl: avatar,
            gender: gender,
        };
        initialMarkers.push(ownWishMarker);
        // Also add random markers around the published wish
        initialMarkers.push(...generateRandomMarkers(initialCenter, null, 5, t, allUsers));

    } else if (location) { // Handles default view and search view, which require user location
        initialCenter = { latitude: location.latitude, longitude: location.longitude };
        
        if (isSearch) {
            const searchRadius = parseFloat(searchParams.get('radius') || '5');
            const searchCategory = searchParams.get('category') as WishCategoryKey | null;
            initialMarkers.push(...generateRandomMarkers(initialCenter, searchCategory, searchRadius, t, allUsers));
        } else {
            // Default view: add random markers
            initialMarkers.push(...generateRandomMarkers(initialCenter, null, 5, t, allUsers));
        }
    } else {
        // This case is hit if it's not a published link and location is not yet available.
        return;
    }
    
    setMarkers(initialMarkers);
    setMapLocation({ center: [initialCenter.longitude, initialCenter.latitude], zoom: 12 });
    
  }, [location, allUsers, searchParams, isPremium, t, avatar, gender, setHasInteractedWithMap, mapLocation]);
  
  const handleMapUpdate = useCallback((newLocation: YMapLocation) => {
    // We can use this callback to update state if needed, e.g., for saving map position
  }, []);

  if (!mapLocation) {
    const isPublished = searchParams.get('published') === 'true';
    const text = !isPublished && !location ? 'Определяем ваше местоположение...' : 'Загрузка карты...';
    return <FullScreenLoader text={text} />;
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

    
