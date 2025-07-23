
'use client';

import {
    YMap,
    YMapComponentsProvider,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapListener
} from 'ymap3-components';
import type { YMapLocation } from 'ymap3-components';
import type { MarkerInfo } from '@/app/(main)/map/page';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Gender } from '@/lib/profile-store';


interface MapProps {
    location: YMapLocation;
    markers: MarkerInfo[];
    className?: string;
    onUpdate?: (location: YMapLocation) => void;
}

const getPlacemarkLayout = (marker: MarkerInfo): string => {
    const color = marker.color || '#FF7F50';
    
    const premiumGem = marker.isPremium ? `
    <g transform="translate(68, 25) scale(0.6)">
        <svg viewBox="0 0 15 15" width="24" height="24">
            <defs>
                <linearGradient id="gem-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:hsl(var(--primary));stop-opacity:1"></stop>
                    <stop offset="100%" style="stop-color:hsl(var(--secondary));stop-opacity:1"></stop>
                </linearGradient>
            </defs>
            <circle cx="12" cy="40" r="15" fill="url(#gem-gradient)"></circle>
            <path d="M6.7,19.33,4.43,10.67,10,4,12,5.33,14,4l5.57,6.67,17.3,19.33Z" transform="translate(0, -1)" fill="white"></path>
        </svg>
    </g>
    ` : '';
    
    const getGenderGradient = (gender: Gender) => {
        const gradientId = `gender-gradient-${marker.id.replace(/[^a-zA-Z0-9]/g, '')}`;
        let color: string;
        if (gender === 'male') {
            color = '#00BFFF'; // blue
        } else if (gender === 'female') {
            color = '#FF69B4'; // pink
        } else {
            color = '#C0C0C0'; // Neutral silver
        }
        
        return {
            gradientDef: `
                 <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:black;"></stop>
                    <stop offset="50%" style="stop-color:${color};"></stop>
                    <stop offset="100%" style="stop-color:black;"></stop>
                </linearGradient>
            `,
            gradientUrl: `url(#${gradientId})`
        }
    }

    const { gradientDef, gradientUrl } = getGenderGradient(marker.gender);
    const genderSticker = `<circle cx="65" cy="35" r="15" fill="${gradientUrl}" stroke="black" stroke-width="0.5"></circle>`;

    const cloudSvg = `
        <svg width="40" height="30" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" style="transform: translate(-20px, -30px); overflow: visible;">
            <defs>
                 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${color}" flood-opacity="1"/>
                </filter>
                ${gradientDef}
            </defs>
            <g 
                style="${marker.userId === '0' ? `filter: url(#glow);` : ''}"
                transform="scale(1)"
            >
              <path d="M64,15.5c-3.6-2.9-8.5-4.6-13.3-4.6c-11.8,0-22.5,5.8-28.9,15C20.9,26.1,20.2,26,19.5,26C8.7,26,0,34.7,0,45.5 S8.7,65,19.5,65h45.4c9.6,0,14.6-7.7,14.6-17.3S73.6,18.4,64,15.5z" transform="scale(0.8) translate(0, -10)" fill="${color}"/>
            </g>
            ${genderSticker}
            ${premiumGem}
        </svg>
    `;
    
    return cloudSvg;
};

export function MapComponent({ location, markers = [], className, onUpdate }: MapProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();

  const mapApiKey = process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY || "";

  if (!mapApiKey) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-muted">
            <div className="text-center p-4">
                <p className="text-lg font-semibold text-destructive">Ключ API Яндекс.Карт отсутствует</p>
                <p className="text-sm text-muted-foreground">Пожалуйста, добавьте ваш ключ API в файл .env и перезапустите сервер.</p>
            </div>
        </div>
    )
  }

  const isDarkTheme = theme === 'dark' || theme === 'evening' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleMarkerClick = (marker: MarkerInfo) => {
    if (marker.userId === '0') {
      toast({
        title: "Это ваше желание",
        description: "Другие пользователи его уже видят!",
      });
      return;
    }
    router.push(`/chats/conv-2?from=map`);
  };

  return (
    <div className={cn("w-full h-full", className)}>
        <YMapComponentsProvider apiKey={mapApiKey} lang="ru_RU">
            <YMap 
                location={location} 
                mode="vector" 
                theme={isDarkTheme ? 'dark' : 'light'} 
                className="w-full h-full"
                behaviors={['drag', 'pinchZoom', 'pinchRotate', 'scrollZoom']}
            >
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                {onUpdate && <YMapListener onUpdate={({location}) => onUpdate(location)} />}

                {markers.map((marker) => (
                    <YMapMarker
                        key={marker.id}
                        coordinates={[marker.longitude, marker.latitude]}
                        onClick={() => handleMarkerClick(marker)}
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: getPlacemarkLayout(marker)}}
                        />
                    </YMapMarker>
                ))}
            </YMap>
        </YMapComponentsProvider>
    </div>
  );
}
