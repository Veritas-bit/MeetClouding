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
        d="M56.5 42C56.5 51.33 49.33 58.5 40 58.5C30.67 58.5 23.5 51.33 23.5 42C23.5 32.67 30.67 25.5 40 25.5C49.33 25.5 56.5 32.67 56.5 42Z"
        fill="hsl(var(--primary))"
        fillOpacity="0.2"
      />
      <path
        d="M51 68C51 64.6667 46.8 62 40 62C33.2 62 29 64.6667 29 68H51Z"
        fill="hsl(var(--primary))"
        fillOpacity="0.2"
      />
    </svg>
  );
}
