
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

const getPlacemarkLayout = (color: string = '#FF7F50'): string => {
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

    const cloudSvg = `
        <svg width="40" height="30" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" style="overflow: visible; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
            <path d="M61.5,14.5c-3.2-1.2-6.6-1.7-10-1.7c-8.9,0-16.9,4.4-21.7,11.3c-0.8-0.1-1.6-0.2-2.3-0.2c-8.3,0-15,6.7-15,15s6.7,15,15,15h34c7.2,0,13-5.8,13-13S68.7,14.5,61.5,14.5z" fill="${color}" stroke="${strokeColor}" stroke-width="3" stroke-linejoin="round" stroke-miterlimit="10"/>
        </svg>
    `;

    const element = document.createElement('div');
    element.innerHTML = cloudSvg;
    return element;
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
    <div className={cn("absolute inset-0", className)}>
        <YMapComponentsProvider apiKey={mapApiKey} lang="ru_RU">
            <YMap location={location} mode="vector" theme={isDarkTheme ? 'dark' : 'light'}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                {onUpdate && <YMapListener onUpdate={({location}) => onUpdate(location)} />}

                {markers.map((marker) => (
                    <YMapMarker
                        key={marker.id}
                        coordinates={[marker.latitude, marker.longitude]}
                        onClick={() => handleMarkerClick(marker)}
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: getPlacemarkLayout(marker.color).innerHTML}}
                            style={{
                                width: '40px',
                                height: '30px',
                                position: 'relative',
                                left: '-20px',
                                top: '-15px',
                                filter: marker.isPremium || marker.userId === '0' ? 'drop-shadow(0 0 5px hsl(var(--primary)))' : 'none'
                            }}
                        />
                    </YMapMarker>
                ))}
            </YMap>
        </YMapComponentsProvider>
    </div>
  );
}
