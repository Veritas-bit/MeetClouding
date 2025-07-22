
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

const getGenderIconSvg = (gender: Gender) => {
    const iconFill = 'black'; // Icons should be black as per profile avatars
    switch (gender) {
        case 'male':
            return `
                <g transform="translate(1152 1320) scale(1, -1) translate(-1440 -1200)">
                    <path d="M1398 2518 c13 -13 17 -62 5 -56 -62 32 -110 49 -147 54 -25 4 -46 4 -46 1 0 -4 14 -27 32 -52 43 -61 26 -71 -25 -14 l-42 45 -1 -45 c0 -31 -19 -93 -57 -188 -85 -212 -109 -325 -72 -340 9 -3 23 -20 32 -37 l16 -31 17 116 c10 71 26 135 40 164 l23 48 111 -6 c120 -5 447 -55 457 -69 3 -4 18 -62 34 -128 l29 -119 18 29 c10 17 24 30 32 30 20 0 26 50 16 137 -12 98 -20 127 -61 203 -56 106 -178 200 -325 250 -67 23 -105 27 -86 8z" fill="${iconFill}" />
                    <path d="M875 1111 c-220 -70 -319 -111 -399 -165 -78 -52 -118 -127 -141 -265 -19 -110 -22 -102 87 -216 176 -186 413 -321 678 -386 85 -21 117 -24 305 -23 203 1 214 2 326 32 309 83 549 241 741 487 64 82 70 93 65 127 -8 56 -46 124 -98 173 -60 56 -162 107 -384 190 -99 37 -195 75 -214 85 l-34 17 -29 -57 c-33 -67 -110 -143 -171 -170 -129 -57 -304 -34 -421 55 -39 30 -91 106 -101 148 -4 15 -12 27 -19 27 -6 -1 -92 -27 -191 -59z" fill="${iconFill}" />
                </g>`;
        case 'female':
            return `
                <g transform="translate(1200 1272) scale(1, -1) translate(-1440 -1200)">
                    <path d="M1324 2420 c-161 -17 -241 -79 -286 -223 -21 -65 -23 -92 -23 -282 l0 -210 34 -69 c21 -44 59 -95 102 -140 l68 -71 1 33 c0 20 -10 46 -24 65 -14 18 -35 57 -46 88 -17 44 -26 55 -43 55 -43 -2 -84 176 -55 239 13 29 26 32 43 9 10 -14 14 -9 25 32 25 94 75 188 134 251 56 61 58 62 85 49 111 -58 225 -183 296 -324 41 -83 95 -241 95 -278 0 -28 -31 -94 -66 -141 -13 -17 -24 -44 -24 -60 1 -27 2 -26 55 29 l54 57 6 -57 c9 -83 10 -83 43 -12 96 203 132 549 74 712 -71 200 -248 280 -548 248z" fill="${iconFill}" />
                    <path d="M882 1050 c-311 -127 -327 -145 -398 -449 l-38 -164 39 -34 c221 -192 446 -300 717 -343 118 -18 342 -14 459 10 258 53 490 170 666 336 l61 59 -33 173 c-21 108 -42 185 -54 206 -49 78 -136 138 -296 201 -38 15 -96 40 -128 56 -40 19 -59 24 -62 16 -3 -7 -20 -66 -39 -133 -85 -297 -212 -535 -306 -574 -27 -11 -34 -10 -70 14 -111 74 -257 366 -308 617 l-18 87 -192 -78z" fill="${iconFill}" />
                </g>`;
        default: // NeuterIcon
            return `
                <g transform="translate(1200 1200) scale(1, -1) translate(-1200 -1200)">
                    <path d="M1200 1740C1385.6 1740 1530 1595.6 1530 1410C1530 1224.4 1385.6 1080 1200 1080C1014.4 1080 870 1224.4 870 1410C870 1595.6 1014.4 1740 1200 1740Z" fill="${iconFill}" />
                    <path d="M1532.4 900H867.6C775.2 900 702 826.8 702 735V660H1698V735C1698 826.8 1624.8 900 1532.4 900Z" fill="${iconFill}" />
                </g>`;
    }
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
    const avatarUrl = marker.avatarUrl; 
    
    // Using a more specific ID for the gradient to avoid conflicts
    const gradientId = `map-marker-gradient-${marker.id.replace(/[^a-zA-Z0-9]/g, '')}`;

    const fallbackAvatar = `
      <svg viewBox="0 0 2400 2400" x="49" y="11" height="28" width="28" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="logo-gradient-map" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:hsl(var(--primary));stop-opacity:1" />
              <stop offset="100%" style="stop-color:hsl(var(--secondary));stop-opacity:1" />
            </linearGradient>
         </defs>
         <circle cx="1200" cy="1200" r="1200" fill="url(#logo-gradient-map)" />
         ${getGenderIconSvg(marker.gender)}
      </svg>`;

    const cloudSvg = `
        <svg width="60" height="38" viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" style="transform: translate(-22px, -30px); overflow: visible;">
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
            ${!avatarUrl ? fallbackAvatar : `<image href="${avatarUrl}" x="49" y="11" height="28" width="28" clip-path="url(#avatarClip)" />`}
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
