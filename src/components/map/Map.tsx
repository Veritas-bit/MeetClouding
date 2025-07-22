
'use client';

import { YMaps, Map, Placemark, type IMapState } from '@pbe/react-yandex-maps';
import type { MarkerInfo } from '@/app/(main)/map/page';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { YANDEX_MAP_API_KEY } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';


interface MapProps {
    mapState: IMapState;
    markers: MarkerInfo[];
    className?: string;
}

const getPlacemarkLayout = (marker: MarkerInfo): string => {
    const { color = '#FF7F50', isPremium } = marker;
    const isOwn = marker.userId === '0';

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
    const glowFilter = isOwn ? 'drop-shadow(0 0 8px hsl(var(--primary)))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';

    const cloudSvg = `
        <svg width="40" height="30" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" style="overflow: visible; filter: ${glowFilter};">
            <path d="M61.5,14.5c-3.2-1.2-6.6-1.7-10-1.7c-8.9,0-16.9,4.4-21.7,11.3c-0.8-0.1-1.6-0.2-2.3-0.2c-8.3,0-15,6.7-15,15s6.7,15,15,15h34c7.2,0,13-5.8,13-13S68.7,14.5,61.5,14.5z" fill="${color}" stroke="${strokeColor}" stroke-width="3" stroke-linejoin="round" stroke-miterlimit="10"/>
        </svg>
    `;
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(cloudSvg)}`;
};

export function MapComponent({ mapState, markers = [], className }: MapProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();
  
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

  const mapApiKey = YANDEX_MAP_API_KEY;

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

  const isDarkTheme = theme === 'dark' || theme === 'evening' || theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mapOptions = {
    preset: isDarkTheme ? 'islands#dark' : undefined
  };

  return (
    <div className={cn("absolute inset-0", className)}>
        <YMaps query={{ apikey: mapApiKey, lang: 'ru_RU' }}>
            <Map 
                state={mapState} 
                width="100%" 
                height="100%"
                options={mapOptions}
            >
            {markers.map((marker) => (
                <Placemark
                    key={marker.id}
                    geometry={[marker.latitude, marker.longitude]}
                    onClick={() => handleMarkerClick(marker)}
                    options={{
                        iconLayout: 'default#image',
                        iconImageHref: getPlacemarkLayout(marker),
                        iconImageSize: [50, 38], // Base size, will be scaled by the map
                        iconImageOffset: [-25, -19],
                    }}
                />
            ))}
            </Map>
        </YMaps>
    </div>
  );
}
