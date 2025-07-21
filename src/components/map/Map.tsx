
'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Marker } from 'react-map-gl/maplibre';
import type { MarkerInfo } from '@/app/(main)/map/page';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';

interface MapProps {
  center: [number, number];
  markers?: MarkerInfo[];
  className?: string;
}

function CloudIcon({ color, isPremium }: { color: string, isPremium?: boolean }) {
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

  return (
    <div className="relative" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}>
        {isPremium && (
            <Crown 
                className="absolute -top-3.5 -left-1.5 h-6 w-6 text-yellow-400 -rotate-12"
                stroke="hsl(var(--background))"
                strokeWidth={0.5}
                fill="currentColor"
            />
        )}
        <svg
            width="40"
            height="30"
            viewBox="0 0 80 60"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible', cursor: 'pointer' }}
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
  );
}

export default function MapComponent({ center, markers = [], className }: MapProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleMarkerClick = (marker: MarkerInfo) => {
    if (marker.userId === '0') {
      alert("Это ваше собственное желание!");
      return;
    }
    // This is a mock navigation. In a real app, you would navigate to the specific chat.
    router.push(`/chats/conv-2?from=map`);
  };
  
  const getEffectiveTheme = useCallback(() => {
    if (!mounted) return 'light';

    const doc = document.documentElement;
    if (doc.classList.contains('dark') || doc.classList.contains('evening')) {
        return 'dark';
    }
    return 'light';
    
  }, [mounted]);


  const effectiveTheme = getEffectiveTheme();
  const isDarkMap = effectiveTheme === 'dark';

  const mapApiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  if (!mapApiKey || mapApiKey === 'GET_YOUR_OWN_KEY') {
    return (
        <div className="flex h-full w-full items-center justify-center bg-muted">
            <div className="text-center">
                <p className="text-lg font-semibold text-destructive">MapTiler API Key Missing</p>
                <p className="text-sm text-muted-foreground">Please add your MapTiler API key to the .env file.</p>
            </div>
        </div>
    )
  }

  const mapStyleUrl = isDarkMap
    ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${mapApiKey}`
    : `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapApiKey}`;

  const mapContainerStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transition: 'filter 0.5s ease-in-out',
  };

  const doc = typeof document !== 'undefined' ? document.documentElement : null;
  if (doc?.classList.contains('early-morning')) {
    mapContainerStyle.filter = 'sepia(20%)';
  } else if (doc?.classList.contains('evening')) {
    mapContainerStyle.filter = 'brightness(0.8) contrast(1.1)';
  }

  if (!mounted) {
    return null;
  }

  return (
    <div style={mapContainerStyle}>
        <Map
            key={`${center.join('-')}-${effectiveTheme}`}
            initialViewState={{
                longitude: center[1],
                latitude: center[0],
                zoom: 13,
            }}
            mapStyle={mapStyleUrl}
            className={cn(className)}
            style={{ width: '100%', height: '100%' }}
        >
        {markers.map((marker) => (
            <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            onClick={() => handleMarkerClick(marker)}
            style={{ zIndex: marker.isPremium ? 10 : 1 }}
            >
            <CloudIcon 
                color={marker.color || '#FF7F50'}
                isPremium={marker.isPremium}
            />
            </Marker>
        ))}
        </Map>
    </div>
  );
}
