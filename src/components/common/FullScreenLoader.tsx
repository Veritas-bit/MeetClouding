
'use client';

import { GradientBorderCloudIcon } from '@/components/icons/GradientBorderCloudIcon';
import { cn } from '@/lib/utils';

interface FullScreenLoaderProps {
    text?: string;
}

export function FullScreenLoader({ text }: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className={cn("flex flex-col items-center gap-4", "animate-in fade-in duration-500")}>
        <GradientBorderCloudIcon className="h-24 w-24" />
        {text && <p className="text-lg text-muted-foreground animate-pulse">{text}</p>}
      </div>
    </div>
  );
}
