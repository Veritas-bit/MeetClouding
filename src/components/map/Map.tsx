
"use client";

import React, { useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';
import type { MarkerInfo } from '@/app/(main)/map/page';
import { Button } from '../ui/button';
import { Send, Gem } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

interface MapComponentProps {
  center: [number, number];
  markers: MarkerInfo[];
  className?: string;
}

export default function MapComponent({ center, markers, className }: MapComponentProps) {
  const { resolvedTheme } = useTheme();
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);

  const mapStyle = resolvedTheme === 'dark' 
    ? 'https://api.maptiler.com/maps/dataviz-dark/style.json?key=GET_YOUR_OWN_KEY'
    : 'https://api.maptiler.com/maps/dataviz-light/style.json?key=GET_YOUR_OWN_KEY';

  return (
    <div className={cn("w-full h-full", className)}>
      <Map
        initialViewState={{
          longitude: center[1],
          latitude: center[0],
          zoom: 13,
        }}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        onLoad={(e) => e.target.resize()} // Force resize on load
      >
        <NavigationControl position="top-right" />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedMarker(marker);
            }}
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-white cursor-pointer shadow-md"
              style={{ backgroundColor: marker.color || 'hsl(var(--primary))' }}
            />
          </Marker>
        ))}

        {selectedMarker && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            onClose={() => setSelectedMarker(null)}
            closeButton={false}
            offset={20}
          >
            <div className="flex flex-col gap-2 max-w-xs">
                <div className="flex justify-between items-center">
                    <p className="text-xs font-bold" style={{ color: selectedMarker.color }}>
                        {selectedMarker.categoryName || 'Желание'}
                    </p>
                    {selectedMarker.isPremium && <Gem className="h-4 w-4 text-primary" />}
                </div>
              <p className="text-sm">"{selectedMarker.message}"</p>
              <Link href={`/users/${selectedMarker.userId}`}>
                <Button size="sm" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Откликнуться
                </Button>
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
