
"use client";

import { Suspense, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocationStore } from '@/lib/location-store';
import { WISH_CATEGORIES, WishCategoryKey, WISH_CATEGORY_KEYS } from '@/lib/categories';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { useProfileStore, type Gender } from '@/lib/profile-store';
import { useInteractionStore } from '@/lib/interaction-store';
import { WISHES } from '@/lib/wishes';
import { useTranslation } from '@/hooks/use-translation';
import { getAllUsers, getConversations } from '@/lib/mock-data';
import type { User, Conversation } from '@/lib/types';
import type { YMapLocation } from 'ymap3-components';
import { Button } from '@/components/ui/button';
import { Sparkles, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BackIcon } from '@/components/icons/BackIcon';
import { useWishStore } from '@/lib/wish-store';


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

const WishHeader = ({ wishText, categoryKey, onFilterFriends, friendCount, isFilterActive, onBack }: { wishText: string, categoryKey: WishCategoryKey, onFilterFriends: () => void, friendCount: number, isFilterActive: boolean, onBack: () => void }) => {
    const category = WISH_CATEGORIES[categoryKey];
    const Icon = category ? category.icon : Sparkles;
    const t = useTranslation();

    return (
        <div className="absolute top-4 left-0 right-0 z-10 w-full px-4">
            <div className="p-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg flex items-center justify-between gap-2 w-full max-w-xl mx-auto">
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onBack} 
                    className="hover:bg-transparent active:bg-transparent group"
                >
                    <BackIcon className="h-6 w-6 text-muted-foreground group-active:text-primary" />
                    <span className="sr-only">Назад</span>
                </Button>

                <div className="flex items-center gap-2 flex-1 overflow-hidden justify-center">
                    <Icon 
                        className="h-5 w-5 shrink-0"
                        style={{ color: category?.color || 'hsl(var(--primary))' }}
                    />
                    <div className="flex-1 overflow-hidden max-w-[200px] sm:max-w-xs">
                        <p className="text-sm font-semibold text-foreground">{t('yourWishLabel')}</p>
                        <p className="text-xs text-muted-foreground truncate">{wishText}</p>
                    </div>
                </div>
                 {friendCount > 0 ? (
                    <>
                        <div className="w-px h-6 bg-border mx-1 shrink-0" />
                        <Button variant="ghost" size="icon" className="shrink-0 hover:bg-transparent active:bg-transparent" onClick={onFilterFriends}>
                            <Users className={cn("h-5 w-5", isFilterActive ? "text-accent" : "text-primary")} />
                        </Button>
                    </>
                 ) : (
                    // Placeholder to keep alignment
                    <div className="w-10 h-10 shrink-0"></div>
                 )}
            </div>
        </div>
    );
};


// Function to generate random coordinates within a given radius using a simple and robust method
const generateRandomMarkers = (center: { latitude: number, longitude: number }, category: WishCategoryKey | null, radiusKm: number, t: (key: any) => string, users: User[]): MarkerInfo[] => {
    const markers: MarkerInfo[] = [];
    const count = 25 + Math.floor(radiusKm) * 10; // More markers for a larger area
    
    // Convert radius from kilometers to degrees (approximate)
    const radiusInDegrees = radiusKm / 111.32;

    for (let i = 0; i < count; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        // Ensure we don't pick the current user for random markers
        if (randomUser.id === 'user-1') continue;

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslation();
  const { toast } = useToast();
  const { location, requestLocation } = useLocationStore();
  const { isPremium, avatar, gender } = useProfileStore();
  const setHasInteractedWithMap = useInteractionStore((state) => state.setHasInteractedWithMap);
  const { publishedWish } = useWishStore();
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [allMarkers, setAllMarkers] = useState<MarkerInfo[]>([]);
  const [visibleMarkers, setVisibleMarkers] = useState<MarkerInfo[]>([]);
  const [isFriendFilterActive, setIsFriendFilterActive] = useState(false);
  
  // Map view state
  const [mapLocation, setMapLocation] = useState<YMapLocation | null>(null);

  const isFromChat = searchParams.get('from') === 'chat';
  const isSearch = searchParams.get('search') === 'true';

  useEffect(() => {
    requestLocation();
    
    async function fetchInitialData() {
        const [users, convos] = await Promise.all([getAllUsers(), getConversations()]);
        setAllUsers(users);

        const currentUser = users.find(u => u.id === 'user-1');
        if (currentUser) {
            const friendConvos = convos.filter(c => c.id.startsWith('friend-'));
            const fIds = friendConvos.map(c => c.participants.find(p => p.id !== currentUser.id)?.id).filter(Boolean) as string[];
            setFriendIds(fIds);
        }
    }
    fetchInitialData();
  }, [requestLocation]);

  // Effect to initialize markers and view state
  useEffect(() => {
    // If map already initialized, do nothing.
    if (mapLocation) return;
    
    // If it is a public link but users aren't ready, wait.
    if ((publishedWish || isFromChat) && allUsers.length === 0) return;

    if (!isFromChat && !isSearch && !publishedWish && (!location || allUsers.length === 0)) return;

    // Set that user has interacted with map to show back button on other pages
    setHasInteractedWithMap(true);


    let initialCenter: { latitude: number, longitude: number };
    let initialMarkers: MarkerInfo[] = [];

    const latParam = parseFloat(searchParams.get('lat') || '0');
    const lonParam = parseFloat(searchParams.get('lon') || '0');

    if (isFromChat) {
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

    } else if (publishedWish) {
        initialCenter = { latitude: publishedWish.location.latitude, longitude: publishedWish.location.longitude };
        
        const ownWishMarker: MarkerInfo = {
            id: `user-wish-${publishedWish.location.latitude}-${publishedWish.location.longitude}`,
            userId: '0', // Current user's wish
            latitude: publishedWish.location.latitude,
            longitude: publishedWish.location.longitude,
            message: publishedWish.message,
            categoryName: publishedWish.categoryName,
            color: publishedWish.color,
            isPremium: isPremium,
            avatarUrl: avatar,
            gender: gender,
        };
        initialMarkers.push(ownWishMarker);
        initialMarkers.push(...generateRandomMarkers(initialCenter, null, 5, t, allUsers));
    
    } else if (isSearch && location) {
        initialCenter = { latitude: location.latitude, longitude: location.longitude };
        const searchRadius = parseFloat(searchParams.get('radius') || '5');
        const searchCategory = searchParams.get('category') as WishCategoryKey | null;
        initialMarkers.push(...generateRandomMarkers(initialCenter, searchCategory, searchRadius, t, allUsers));
    
    } else if (location) { // Default view
        initialCenter = { latitude: location.latitude, longitude: location.longitude };
        initialMarkers.push(...generateRandomMarkers(initialCenter, null, 5, t, allUsers));

    } else {
        return;
    }
    
    setAllMarkers(initialMarkers);
    setVisibleMarkers(initialMarkers);
    setMapLocation({ center: [initialCenter.longitude, initialCenter.latitude], zoom: 12 });
    
  }, [location, allUsers, searchParams, isPremium, t, avatar, gender, setHasInteractedWithMap, mapLocation, isFromChat, publishedWish, isSearch]);
  
  // Effect to update visible markers when filter changes
  useEffect(() => {
    if (isFriendFilterActive) {
        setVisibleMarkers(allMarkers.filter(m => friendIds.includes(m.userId) || m.userId === '0'));
    } else {
        setVisibleMarkers(allMarkers);
    }
  }, [isFriendFilterActive, allMarkers, friendIds]);


  const handleFilterFriends = () => {
    if (friendIds.length === 0 && !isFriendFilterActive) {
        toast({
            title: "У вас пока нет друзей",
            variant: "destructive"
        });
        return;
    }
    setIsFriendFilterActive(prev => !prev);
  }
  
  const handleMapUpdate = useCallback((newLocation: YMapLocation) => {
    // We can use this callback to update state if needed, e.g., for saving map position
  }, []);

  if (!mapLocation) {
    const text = !publishedWish && !location ? 'Определяем ваше местоположение...' : 'Загрузка карты...';
    return <FullScreenLoader text={text} />;
  }

  const wishText = publishedWish ? publishedWish.message : t('wish_other_1');
  const categoryKey = publishedWish ? publishedWish.categoryKey : 'other';

  return (
    <div className="h-full w-full relative">
      <WishHeader 
        wishText={wishText} 
        categoryKey={categoryKey}
        onFilterFriends={handleFilterFriends}
        friendCount={friendIds.length}
        isFilterActive={isFriendFilterActive}
        onBack={() => router.back()}
      />
       
        <MapComponent 
            location={mapLocation} 
            markers={visibleMarkers} 
            className="w-full h-full"
            onUpdate={handleMapUpdate}
        />
    </div>
  );
}


export default function MapPage() {
    return (
        <Suspense fallback={<FullScreenLoader text="Загрузка карты..." />}>
            <div className="h-full">
                <MapContent />
            </div>
        </Suspense>
    )
}

    
