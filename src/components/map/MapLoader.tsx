
'use client';

import { GradientBorderCloudIcon } from '@/components/icons/GradientBorderCloudIcon';
import { cn } from '@/lib/utils';

interface MapLoaderProps {
    isLoading: boolean;
}

export function MapLoader({ isLoading }: MapLoaderProps) {
  return (
    <div className={cn(
        "fixed inset-0 bg-background flex items-center justify-center z-[100] transition-opacity duration-300 ease-out",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className="flex flex-col items-center gap-4">
        <GradientBorderCloudIcon className="h-24 w-24" />
        <p className="text-lg text-muted-foreground animate-pulse">Загружаем карту...</p>
      </div>
    </div>
  );
}
