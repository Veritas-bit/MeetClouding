import { Loader2 } from "lucide-react";

export function FullScreenLoader({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      {text && <p className="mt-4 text-lg text-foreground">{text}</p>}
    </div>
  );
}
