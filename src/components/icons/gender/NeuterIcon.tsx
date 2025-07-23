
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
          d="M1200 500 C950 500 750 650 650 800 C550 950 500 1150 500 1300 C500 1500 550 1700 600 1850 L700 2000 L1700 2000 L1800 1850 C1850 1700 1900 1500 1900 1300 C1900 1150 1850 950 1750 800 C1650 650 1450 500 1200 500 Z M1200 700 C1400 700 1550 800 1650 950 C1750 1100 1700 1400 1600 1500 C1500 1600 1350 1750 1200 1750 C1050 1750 900 1600 800 1500 C700 1400 650 1100 750 950 C850 800 1000 700 1200 700 Z"
          fill="black"
        />
      </g>
    </svg>
  );
}
