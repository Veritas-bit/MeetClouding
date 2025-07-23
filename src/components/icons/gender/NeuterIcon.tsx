
import { cn } from "@/lib/utils";

export function NeuterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 2400 2400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="1200" cy="1200" r="1200" fill="url(#logo-gradient)" />
      <g transform="translate(1200 1200) scale(1, -1) translate(-1200 -1200)">
        <path
          d="M1200 480 C1500 480, 1700 700, 1700 960 L1700 1560 C1700 1700, 1600 1920, 1200 1920 C800 1920, 700 1700, 700 1560 L700 960 C700 700, 900 480, 1200 480 Z M1200 1080 A120 120 0 1 1 1200 1320 A120 120 0 0 1 1200 1080"
          fill="black"
        />
      </g>
    </svg>
  );
}
