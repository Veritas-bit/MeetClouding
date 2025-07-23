
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
        <g transform="translate(28, 1) scale(0.6)">
             <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gem-gradient-${marker.id.replace(/[^a-zA-Z0-9]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:hsl(var(--primary));stop-opacity:1"></stop>
                        <stop offset="100%" style="stop-color:hsl(var(--secondary));stop-opacity:1"></stop>
                    </linearGradient>
                </defs>
                <path d="M1.38,12.21,11.5,2.1a.5.5,0,0,1,.7,0L22.32,12.21a.5.5,0,0,1-.35.85H1.73a.5.5,0,0,1-.35-.85Z" fill="url(#gem-gradient-${marker.id.replace(/[^a-zA-Z0-9]/g, '')})"/>
                <path d="M1.73,13.06h20.24l-4.7-5.45a.5.5,0,0,0-.7,0l-4.27,4.27a.5.5,0,0,1-.7,0L7.33,7.61a.5.5,0,0,0-.7,0l-4.9,5.45Z" fill="url(#gem-gradient-${marker.id.replace(/[^a-zA-Z0-9]/g, '')})" opacity="0.5"/>
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
                <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(30)">
                    <stop offset="30%" style="stop-color:black;" />
                    <stop offset="30%" style="stop-color:${color};" />
                    <stop offset="70%" style="stop-color:${color};" />
                    <stop offset="70%" style="stop-color:black;" />
                    <stop offset="85%" style="stop-color:black;" />
                    <stop offset="85%" style="stop-color:${color};" />
                </linearGradient>
            `,
            gradientUrl: `url(#${gradientId})`
        }
    }

    const { gradientDef, gradientUrl } = getGenderGradient(marker.gender);
    const genderSticker = `<circle cx="31" cy="9" r="6" fill="${gradientUrl}" stroke="black" stroke-width="0.5"/>`;

    const cloudSvg = `
        <svg width="20" height="15" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" style="transform: translate(-10px, -15px); overflow: visible;">
            <defs>
                 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${color}" flood-opacity="1"/>
                </filter>
                ${gradientDef}
            </defs>
            <g 
                style="${marker.userId === '0' ? `filter: url(#glow);` : ''}"
                transform="${marker.userId === '0' ? 'scale(1)' : 'scale(1)'}"
            >
              <path d="M64,15.5c-3.6-2.9-8.5-4.6-13.3-4.6c-11.8,0-22.5,5.8-28.9,15C20.9,26.1,20.2,26,19.5,26C8.7,26,0,34.7,0,45.5 S8.7,65,19.5,65h45.4c9.6,0,14.6-7.7,14.6-17.3S73.6,18.4,64,15.5z" transform="scale(0.8) translate(0, -10)" fill="${color}" stroke="hsl(320, 100%, 40%)" stroke-width="2.5"/>
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
