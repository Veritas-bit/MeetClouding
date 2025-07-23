
'use client';

import { GradientBorderCloudIcon } from '@/components/icons/GradientBorderCloudIcon';
import { cn } from '@/lib/utils';

interface FullScreenLoaderProps {
    text?: string;
}

export function FullScreenLoader({ text }: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className={cn("flex flex-col items-center gap-4 w-48", "animate-in fade-in duration-500")}>
        <GradientBorderCloudIcon className="h-24 w-24" />
        {/* <div className="relative w-full h-2 bg-muted overflow-hidden rounded-full">
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-running-progress"></div>
        </div> */}
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
}
