
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
    const avatarUrl = marker.avatarUrl || 'https://placehold.co/40x40.png'; // Fallback avatar

    const cloudSvg = `
        <svg width="80" height="50" viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" style="transform: translate(-30px, -40px); overflow: visible;">
            <defs>
                <clipPath id="avatarClip">
                    <circle cx="63" cy="25" r="14" />
                </clipPath>
                 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g style="${marker.userId === '0' ? `filter: url(#glow);` : ''}">
              <path d="M49,7C46.3,4.9,42.8,3.5,39,3.5c-8.9,0-16.9,4.4-21.7,11.3C16.5,14.7,15.8,14.5,15,14.5C6.7,14.5,0,21.2,0,29.5S6.7,44.5,15,44.5h34c7.2,0,11-5.8,11-13S56.2,7,49,7z" fill="${color}" stroke="${strokeColor}" stroke-width="2"/>
            </g>
            <image href="${avatarUrl}" x="49" y="11" height="28" width="28" clip-path="url(#avatarClip)" />
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
