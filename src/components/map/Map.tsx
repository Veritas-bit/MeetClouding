
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
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


interface MapProps {
    location: YMapLocation;
    markers: MarkerInfo[];
    className?: string;
    onUpdate?: (location: YMapLocation) => void;
}

const getPlacemarkLayout = (marker: MarkerInfo, isCooperative: boolean): string => {
    let color = marker.color || '#FF7F50';
    let glowStdDeviation = '6';

    if (marker.userId === '0') {
        const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (hslMatch) {
            const h = hslMatch[1];
            const s = hslMatch[2];
            let l = parseInt(hslMatch[3], 10);
            l = Math.min(100, l + 30);
            color = `hsl(${h}, ${s}%, ${l}%)`;
        }
        glowStdDeviation = '10';
    }
    
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
        let genderColor: string;
        if (gender === 'male') {
            genderColor = '#00BFFF';
        } else if (gender === 'female') {
            genderColor = '#FF69B4';
        } else {
            genderColor = '#C0C0C0';
        }
        
        return {
            gradientDef: `
                 <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:black;"></stop>
                    <stop offset="50%" style="stop-color:${genderColor};"></stop>
                    <stop offset="100%" style="stop-color:black;"></stop>
                </linearGradient>
            `,
            gradientUrl: `url(#${gradientId})`
        }
    }

    const { gradientDef, gradientUrl } = getGenderGradient(marker.gender);
    const genderSticker = `<circle cx="65" cy="35" r="15" fill="${gradientUrl}" stroke="black" stroke-width="0.5"></circle>`;
    
    const getStrokeColor = (baseColor: string) => {
        const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (hslMatch) {
            const h = hslMatch[1];
            const s = hslMatch[2];
            let l = parseInt(hslMatch[3], 10);
            l = Math.max(0, l - 10);
            return `hsl(${h}, ${s}%, ${l}%)`;
        }
        return baseColor;
    };
    const strokeColor = getStrokeColor(color);

    const cooperativeIcon = isCooperative ? `
      <g transform="translate(20, 55)">
        <circle cx="0" cy="0" r="2" fill="${color}" />
        <circle cx="7" cy="0" r="2" fill="${color}" />
        <circle cx="14" cy="0" r="2" fill="${color}" />
      </g>
    ` : '';

    const cloudSvg = `
        <svg width="40" height="40" viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" style="transform: translate(-20px, -30px); overflow: visible;">
            <defs>
                 <filter id="glow-${marker.id.replace(/[^a-zA-Z0-9]/g, '')}" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="${glowStdDeviation}" flood-color="${color}" flood-opacity="1"/>
                </filter>
                ${gradientDef}
            </defs>
            <g 
                style="${marker.userId === '0' ? `filter: url(#glow-${marker.id.replace(/[^a-zA-Z0-9]/g, '')});` : ''}"
                transform="scale(1)"
            >
              <path d="M64,15.5c-3.6-2.9-8.5-4.6-13.3-4.6c-11.8,0-22.5,5.8-28.9,15C20.9,26.1,20.2,26,19.5,26C8.7,26,0,34.7,0,45.5 S8.7,65,19.5,65h45.4c9.6,0,14.6-7.7,14.6-17.3S73.6,18.4,64,15.5z" transform="scale(0.8) translate(0, -10)" fill="${color}" stroke="${strokeColor}" stroke-width="2.5"/>
            </g>
            ${genderSticker}
            ${premiumGem}
            ${cooperativeIcon}
        </svg>
    `;
    
    return cloudSvg;
};

export function MapComponent({ location, markers = [], className, onUpdate }: MapProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const [cooperativeWishes, setCooperativeWishes] = useState<Set<string>>(new Set());
  const [dialogState, setDialogState] = useState<{ open: boolean, marker: MarkerInfo | null }>({ open: false, marker: null });


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
      if (cooperativeWishes.has(marker.id)) {
          toast({ title: "Это ваше кооперативное желание" });
          return;
      }
      setDialogState({ open: true, marker });
    } else {
      router.push(`/chats/conv-2?from=map`);
    }
  };
  
  const handleMakeCooperative = () => {
    if (dialogState.marker) {
      setCooperativeWishes(prev => new Set(prev).add(dialogState.marker!.id));
      // TODO: Here would be logic to convert the chat to multi-user
      toast({
          title: "Желание стало кооперативным!",
          description: "Теперь другие могут присоединиться к вашей группе."
      });
    }
    setDialogState({ open: false, marker: null });
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
                            dangerouslySetInnerHTML={{ __html: getPlacemarkLayout(marker, cooperativeWishes.has(marker.id))}}
                        />
                    </YMapMarker>
                ))}
            </YMap>
        </YMapComponentsProvider>
        
        <AlertDialog open={dialogState.open} onOpenChange={(isOpen) => setDialogState(prev => ({ ...prev, open: isOpen }))}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Сделать желание кооперативным?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вы хотите, чтобы другие пользователи могли присоединиться к этому желанию в виде группового чата?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="!flex-row !justify-center gap-4">
                    <AlertDialogCancel className="max-w-[40%]" onClick={() => setDialogState({ open: false, marker: null })}>Нет</AlertDialogCancel>
                    <AlertDialogAction className="max-w-[40%]" onClick={handleMakeCooperative}>Да</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
