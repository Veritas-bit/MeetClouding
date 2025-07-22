
'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import type { MarkerInfo } from '@/app/(main)/map/page';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Gem } from 'lucide-react';
import { MAPTILER_KEY } from '@/lib/config';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MaleIcon } from '../icons/gender/MaleIcon';
import { FemaleIcon } from '../icons/gender/FemaleIcon';
import { NeuterIcon } from '../icons/gender/NeuterIcon';
import type { Gender } from '@/lib/profile-store';


interface MapProps {
    center: [number, number];
    markers: MarkerInfo[];
    className?: string;
    onMapChange: (center: [number, number]) => void;
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


function CloudMarker({ marker }: { marker: MarkerInfo }) {
  const { color = '#FF7F50', isPremium, avatarUrl, gender } = marker;
  // This is a new prop that we'll derive in the main component.
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
  const glowStyle = isOwn ? { filter: 'drop-shadow(0 0 0.5rem hsl(var(--primary)))' } : {};


  return (
    <div className="flex items-center gap-1 cursor-pointer group">
        <div className="relative transition-transform duration-200 group-hover:scale-110" style={{ ...glowStyle, filter: `${glowStyle.filter || ''} drop-shadow(0px 2px 4px rgba(0,0,0,0.2))` }}>
            <svg
                width="40"
                height="30"
                viewBox="0 0 80 60"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
            >
            <path
                d="M61.5,14.5c-3.2-1.2-6.6-1.7-10-1.7c-8.9,0-16.9,4.4-21.7,11.3c-0.8-0.1-1.6-0.2-2.3-0.2c-8.3,0-15,6.7-15,15s6.7,15,15,15h34c7.2,0,13-5.8,13-13S68.7,14.5,61.5,14.5z"
                fill={color}
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinejoin="round"
                strokeMiterlimit="10"
            />
            </svg>
        </div>
        <div className="relative transition-transform duration-200 group-hover:scale-110">
            <Avatar className="h-8 w-8 bg-muted/80 border-2 border-background shadow-md">
                {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt="User Avatar" />
                ) : null}
                <AvatarFallback>
                    <GenderAvatar gender={gender} />
                </AvatarFallback>
            </Avatar>
            {isPremium && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-primary to-secondary p-1 rounded-full">
                    <Gem className="h-2 w-2 text-primary-foreground" />
                </div>
            )}
        </div>
    </div>
  );
}

export default function MapComponent({ center, markers = [], className, onMapChange }: MapProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, systemTheme } = useTheme();
  const { toast } = useToast();
  const mapRef = useRef<MapRef>(null);
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleMarkerClick = (marker: MarkerInfo) => {
    if (marker.userId === '0') {
      toast({
        title: "Это ваше желание",
        description: "Другие пользователи его уже видят!",
      });
      return;
    }
    // This is a mock navigation. In a real app, you would navigate to the specific chat.
    router.push(`/chats/conv-2?from=map`);
  };

  const mapApiKey = MAPTILER_KEY;

  if (!mapApiKey) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-muted">
            <div className="text-center p-4">
                <p className="text-lg font-semibold text-destructive">Ключ API MapTiler отсутствует</p>
                <p className="text-sm text-muted-foreground">Пожалуйста, добавьте ваш ключ API MapTiler в файл .env и перезапустите сервер.</p>
            </div>
        </div>
    )
  }
  
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = ['dark', 'evening'].includes(currentTheme || '');
  const mapStyle = isDark ? "streets-v2-dark" : "streets-v2";

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0">
        <Map
            ref={mapRef}
            key={`${center.join('-')}-${mapStyle}`}
            initialViewState={{
                longitude: center[1],
                latitude: center[0],
                zoom: 13,
            }}
            onMoveEnd={() => {
                const map = mapRef.current?.getMap();
                if (map) {
                    const newCenter = map.getCenter();
                    onMapChange([newCenter.lat, newCenter.lng]);
                }
            }}
            mapStyle={`https://api.maptiler.com/maps/${mapStyle}/style.json?key=${mapApiKey}`}
            attributionControl={false}
            className={cn(className)}
            style={{ width: '100%', height: '100%' }}
        >
        {markers.map((marker) => (
            <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            onClick={() => handleMarkerClick(marker)}
            style={{ zIndex: marker.isPremium || marker.userId === '0' ? 10 : 1 }}
            >
            <CloudMarker marker={marker} />
            </Marker>
        ))}
        </Map>
    </div>
  );
}
