"use client";

import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapLoader({ isLoading }: { isLoading: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-foreground">Карта загружается...</p>
    </div>
  );
}
