import { cn } from "@/lib/utils";

export function MaleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <circle cx="40" cy="40" r="40" fill="hsl(var(--muted))" />
      <path
        d="M56.5 61C56.5 54.5456 52.1289 49.3878 46.5 47.4111C46.5 47.4111 46.5 45.4111 46.5 44.9111C51.5 42.4111 54.5 36.4111 54.5 30.4111C54.5 22.1268 47.9558 15.5 40 15.5C32.0442 15.5 25.5 22.1268 25.5 30.4111C25.5 36.4111 28.5 42.4111 33.5 44.9111C33.5 45.4111 33.5 47.4111 33.5 47.4111C27.8711 49.3878 23.5 54.5456 23.5 61H56.5Z"
        fill="hsl(var(--primary))"
        fillOpacity="0.4"
      />
    </svg>
  );
}
