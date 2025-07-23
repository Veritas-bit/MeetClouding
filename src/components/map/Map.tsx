
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
                <g transform="translate(1200, 1200) scale(0.45, -0.45) translate(-3000, -2640)">
                    <path d="M2736 4230 c171 -85 258 -173 304 -305 26 -77 18 -82 -81 -55 -46 12 -117 33 -157 46 -81 28 -232 44 -232 26 0 -6 50 -37 111 -68 124 -64 189 -117 189 -156 0 -14 -7 -45 -15 -68 -23 -64 -19 -75 29 -104 48 -35 74 -72 52 -129 -32 -84 -98 -150 -191 -192 -27 -12 -102 -35 -165 -50 -305 -74 -342 -85 -453 -141 -154 -77 -188 -109 -99 -93 91 18 288 38 457 48 195 12 239 7 420 -45 170 -49 269 -64 420 -64 116 0 136 -2 156 -19 32 -26 24 -28 -151 -35 -80 -3 -230 -10 -335 -16 -209 -11 -597 -69 -469 -70 151 -1 472 -43 625 -81 217 -55 315 -103 558 -273 248 -174 333 -241 413 -324 105 -110 218 -264 225 -307 11 -70 -31 -244 -87 -355 -54 -107 -88 -150 -181 -227 -173 -142 -309 -338 -450 -645 -117 -254 -169 -371 -166 -375 4 -3 173 186 263 294 118 142 326 264 515 303 102 21 199 26 199 10 0 -6 -42 -52 -94 -103 -92 -91 -142 -166 -160 -242 -6 -26 -3 -24 24 18 79 117 210 187 355 187 76 0 236 -26 245 -39 3 -6 -11 -46 -32 -88 -52 -107 -108 -340 -108 -455 0 -33 3 -38 23 -38 18 0 28 11 46 47 80 165 256 436 279 431 19 -4 78 -100 163 -266 37 -73 82 -151 99 -172 l32 -40 99 0 99 0 0 100 0 100 -78 157 c-93 187 -192 375 -242 458 -30 50 -47 66 -99 93 -77 42 -250 107 -531 201 -118 40 -221 79 -229 86 -11 11 -4 28 44 107 174 280 297 515 288 550 -8 28 -22 52 -189 304 -120 180 -214 294 -243 294 -21 0 -19 38 4 84 14 27 25 63 25 80 0 31 -8 46 -68 130 -18 25 -60 115 -93 198 -132 332 -206 483 -332 673 -79 120 -352 393 -452 453 -130 77 -334 150 -520 186 -72 14 -141 28 -155 31 -14 3 30 -21 96 -55z M2305 4246 c-185 -86 -355 -215 -517 -391 -73 -79 -98 -116 -147 -214 -127 -253 -431 -1073 -431 -1163 0 -10 12 -41 26 -69 24 -48 24 -52 9 -76 -9 -14 -40 -35 -68 -48 -79 -35 -139 -108 -265 -320 -76 -128 -132 -263 -132 -319 0 -39 57 -123 235 -345 63 -80 115 -148 115 -153 0 -10 -27 -21 -105 -40 -117 -30 -381 -107 -440 -128 -70 -26 -86 -39 -129 -100 -44 -64 -159 -266 -218 -384 l-51 -101 29 -52 c15 -29 26 -54 23 -57 -2 -2 -23 0 -45 6 -53 14 -94 -6 -153 -75 -41 -48 -41 -41 -41 -133 l0 -84 58 0 57 0 15 48 c13 40 22 50 60 70 52 26 102 28 219 7 47 -8 86 -13 87 -12 2 2 -6 31 -16 66 -48 153 3 364 107 442 26 20 82 63 123 95 133 103 175 134 181 134 4 0 20 -13 35 -28 16 -16 74 -67 129 -114 116 -98 202 -189 252 -265 20 -29 38 -52 40 -49 6 5 -22 121 -46 190 -22 61 -28 126 -12 126 5 0 47 -33 94 -72 106 -92 213 -169 347 -251 127 -77 300 -170 306 -164 7 6 -79 128 -175 250 -186 233 -257 338 -322 472 -46 95 -65 121 -134 190 -179 177 -320 402 -332 529 -11 115 56 272 163 382 201 207 859 462 1367 529 65 8 182 15 260 16 164 0 159 9 -23 39 -154 26 -291 25 -503 -5 -280 -39 -575 -121 -790 -219 -32 -15 -70 -26 -84 -24 -24 3 -23 6 41 74 73 80 138 126 215 153 28 10 53 20 56 23 3 3 -23 13 -59 23 -80 22 -165 16 -224 -14 -23 -12 -51 -21 -63 -21 -19 0 -21 4 -14 36 22 119 188 620 260 783 67 154 104 215 363 171 221 313 359 453 444 72 43 49 43 -42 0z" fill="black" />
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
      <svg viewBox="0 0 2600 2600" x="45" y="0" height="40" width="40" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:hsl(var(--primary));stop-opacity:1" />
              <stop offset="100%" style="stop-color:hsl(var(--secondary));stop-opacity:1" />
            </linearGradient>
         </defs>
         <circle cx="1300" cy="1300" r="1300" fill="black" />
         <g transform="translate(300 300)">
            <circle cx="1000" cy="1000" r="1000" fill="url(#${gradientId})" />
            <g transform="scale(0.833) translate(200 200)">
                ${getGenderIconSvg(marker.gender)}
            </g>
         </g>
      </svg>`;

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

    const cloudSvg = `
        <svg width="45" height="30" viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" style="transform: translate(-22px, -30px); overflow: visible;">
            <defs>
                <clipPath id="avatarClip">
                    <circle cx="63" cy="25" r="14" />
                </clipPath>
                 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${color}" flood-opacity="1"/>
                </filter>
            </defs>
            <g 
                style="${marker.userId === '0' ? `filter: url(#glow);` : ''}"
                transform="${marker.userId === '0' ? 'translate(-3.75, -3.75) scale(1.25)' : ''}"
            >
              <path d="M49,7C46.3,4.9,42.8,3.5,39,3.5c-8.9,0-16.9,4.4-21.7,11.3C16.5,14.7,15.8,14.5,15,14.5C6.7,14.5,0,21.2,0,29.5S6.7,44.5,15,44.5h34c7.2,0,11-5.8,11-13S56.2,7,49,7z" fill="${color}" stroke="${strokeColor}" stroke-width="2"/>
            </g>
            ${!avatarUrl ? fallbackAvatar : `<image href="${avatarUrl}" x="45" y="0" height="40" width="40" clip-path="url(#avatarClip)" />`}
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
