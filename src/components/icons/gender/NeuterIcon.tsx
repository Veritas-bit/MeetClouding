
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
          d="M1200 500 C950 500, 800 650, 800 900 C800 1100, 900 1200, 1000 1250 L950 1900 L1450 1900 L1400 1250 C1500 1200, 1600 1100, 1600 900 C1600 650, 1450 500, 1200 500 Z M1200 700 C1350 700, 1400 800, 1400 900 C1400 1050, 1350 1150, 1250 1200 L1200 1150 L1150 1200 C1050 1150, 1000 1050, 1000 900 C1000 800, 1050 700, 1200 700 Z"
          fill="black"
        />
      </g>
    </svg>
  );
}
