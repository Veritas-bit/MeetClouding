
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
    const getDarkerColor = (hslColor: string) => {
        if (!hslColor || !hslColor.startsWith('hsl')) return hslColor;
        try {
            const parts = hslColor.match(/(\d+(\.\d+)?)/g);
            if (!parts || parts.length < 3) return hslColor;
            const [h, s, l] = parts.map(Number);
            const newL = Math.max(0, l - 15);
            return `hsl(${h}, ${s}%, ${newL}%)`;
        } catch (e) {
            return hslColor; // fallback
        }
    };
    const strokeColor = getDarkerColor(color);
    
    // Using a more specific ID for the gradient to avoid conflicts
    const gradientId = `map-marker-gradient-${marker.id.replace(/[^a-zA-Z0-9]/g, '')}`;

    const premiumGem = marker.isPremium ? `
        <g transform="translate(68, 25) scale(0.6)">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <defs>
                    <linearGradient id="gem-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:hsl(var(--primary));stop-opacity:1"></stop>
                        <stop offset="100%" style="stop-color:hsl(var(--secondary));stop-opacity:1"></stop>
                    </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="12" fill="url(#gem-gradient)" />
                <path d="M6.7,19.33,4.43,10.67,10,4,12,5.33,14,4l5.57,6.67,17.3,19.33Z" transform="translate(0, -1)" fill="white" />
            </svg>
        </g>
    ` : '';
    
    const getGenderGradient = (gender: Gender) => {
        const gradientId = `gender-gradient-${marker.id.replace(/[^a-zA-Z0-9]/g, '')}`;
        let colors = { c1: '#333', c2: '#aaa', c3: '#333' }; // Neutral default
        if (gender === 'male') {
            colors = { c1: 'black', c2: '#00BFFF', c3: 'black' }; // black-blue-black
        } else if (gender === 'female') {
            colors = { c1: 'black', c2: '#FF69B4', c3: 'black' }; // black-pink-black
        } else {
            colors = { c1: 'black', c2: '#C0C0C0', c3: 'black' }; // black-silver-black
        }
        
        return {
            gradientDef: `
                <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${colors.c1};" />
                    <stop offset="50%" style="stop-color:${colors.c2};" />
                    <stop offset="100%" style="stop-color:${colors.c3};" />
                </linearGradient>
            `,
            gradientId
        }
    }

    const { gradientDef, gradientId: genderGradientId } = getGenderGradient(marker.gender);
    const genderSticker = `<circle cx="70" cy="48" r="8" fill="url(#${genderGradientId})" stroke="black" stroke-width="1"/>`;

    const cloudSvg = `
        <svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" style="transform: translate(-40px, -60px); overflow: visible;">
            <defs>
                 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${color}" flood-opacity="1"/>
                </filter>
                ${gradientDef}
            </defs>
            <g 
                style="${marker.userId === '0' ? `filter: url(#glow);` : ''}"
                transform="${marker.userId === '0' ? 'translate(-3.75, -3.75) scale(1.1)' : ''}"
            >
              <path d="M64,15.5c-3.6-2.9-8.5-4.6-13.3-4.6c-11.8,0-22.5,5.8-28.9,15C20.9,26.1,20.2,26,19.5,26C8.7,26,0,34.7,0,45.5 S8.7,65,19.5,65h45.4c9.6,0,14.6-7.7,14.6-17.3S73.6,18.4,64,15.5z" transform="scale(0.8) translate(0, -10)" fill="${color}" stroke="${strokeColor}" stroke-width="2.5"/>
            </g>
            ${marker.userId !== '0' ? genderSticker : ''}
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
            <YMap location={location} mode="vector" theme={isDarkTheme ? 'dark' : 'light'} className="w-full h-full">
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
