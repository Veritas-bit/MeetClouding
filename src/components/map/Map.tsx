
'use client';

import { YMaps, Map, Placemark, type IMapState } from '@pbe/react-yandex-maps';
import type { MarkerInfo } from '@/app/(main)/map/page';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Gem } from 'lucide-react';
import { YANDEX_MAP_API_KEY } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';
import { renderToStaticMarkup } from 'react-dom/server';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MaleIcon } from '../icons/gender/MaleIcon';
import { FemaleIcon } from '../icons/gender/FemaleIcon';
import { NeuterIcon } from '../icons/gender/NeuterIcon';
import type { Gender } from '@/lib/profile-store';


interface MapProps {
    mapState: IMapState;
    markers: MarkerInfo[];
    className?: string;
}

const GenderAvatar = ({ gender }: { gender: Gender }) => {
    const iconProps = { className: "w-full h-full p-1.5" };
    switch (gender) {
        case 'male':
            return <MaleIcon {...iconProps} />;
        case 'female':
            return <FemaleIcon {...iconProps} />;
        default:
            return <NeuterIcon {...iconProps} />;
    }
};

const getPlacemarkLayout = (marker: MarkerInfo) => {
    const { color = '#FF7F50', isPremium, avatarUrl, gender } = marker;
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
    
    // Yandex Maps requires a specific string format for HTML layouts
    const layoutString = `
        <div style="display: flex; align-items: center; gap: 4px; transform: translate(-50%, -50%);">
            ${cloudSvg}
            <div style="position: relative; width: 32px; height: 32px;">
                <img src="${avatarUrl}" style="width: 100%; height: 100%; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" alt="avatar" />
                ${isPremium ? `<div style="position: absolute; bottom: -2px; right: -2px; background: linear-gradient(to top right, hsl(var(--primary)), hsl(var(--secondary))); padding: 4px; border-radius: 50%;"><svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M6 5H18L12 19Z' /></svg></div>` : ''}
            </div>
        </div>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(layoutString.replace(/(\r\n|\n|\r)/gm, ""))}`;
};

export function MapComponent({ mapState, markers = [], className }: MapProps) {
  const router = useRouter();
  const { toast } = useToast();
  
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

  return (
    <div className={cn("absolute inset-0", className)}>
        <YMaps query={{ apikey: mapApiKey, lang: 'ru_RU' }}>
            <Map 
                state={mapState} 
                width="100%" 
                height="100%"
                modules={["layout.ImageWithContent"]}
            >
            {markers.map((marker) => (
                <Placemark
                    key={marker.id}
                    geometry={[marker.latitude, marker.longitude]}
                    onClick={() => handleMarkerClick(marker)}
                    options={{
                        iconLayout: 'default#image',
                        iconImageHref: getPlacemarkLayout(marker),
                        iconImageSize: [80, 40],
                        iconImageOffset: [-20, -15],
                    }}
                />
            ))}
            </Map>
        </YMaps>
    </div>
  );
}
