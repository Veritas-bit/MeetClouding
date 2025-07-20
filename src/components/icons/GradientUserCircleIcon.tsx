import { cn } from "@/lib/utils"

export function GradientUserCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M18 20a6 6 0 0 0-12 0" fill="url(#logo-gradient)" />
      <circle cx="12" cy="10" r="4" fill="url(#logo-gradient)" />
      <circle cx="12" cy="12" r="10" stroke="url(#logo-gradient)" strokeWidth="2" fill="none" />
    </svg>
  );
}
