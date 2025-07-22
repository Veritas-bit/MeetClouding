import { cn } from "@/lib/utils";

export function FemaleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <circle cx="40" cy="40" r="40" fill="hsl(var(--muted))" />
      <path
        d="M56.5 40.5C56.5 49.83 49.33 57 40 57C30.67 57 23.5 49.83 23.5 40.5C23.5 31.17 30.67 24 40 24C49.33 24 56.5 31.17 56.5 40.5Z"
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
