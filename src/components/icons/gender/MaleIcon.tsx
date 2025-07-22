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
        d="M54.5 61C54.5 55.4333 50.6333 51 45.5 51H34.5C29.3667 51 25.5 55.4333 25.5 61H54.5Z"
        fill="hsl(var(--primary))" 
        fillOpacity="0.4" 
      />
      <path
        d="M48.5 30C48.5 34.6944 44.6944 38.5 40 38.5C35.3056 38.5 31.5 34.6944 31.5 30C31.5 25.3056 35.3056 21.5 40 21.5C44.6944 21.5 48.5 25.3056 48.5 30Z"
        fill="hsl(var(--primary))"
        fillOpacity="0.4"
      />
    </svg>
  );
}
