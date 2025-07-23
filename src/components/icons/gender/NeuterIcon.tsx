
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
      <g transform="translate(1200 1200) scale(1, -1) translate(-1200 -1200)">
        <path
          d="M1200 600 C1000 600 850 700 750 850 C650 1000 600 1200 600 1400 C600 1600 650 1750 700 1850 L500 1850 L550 1950 L1850 1950 L1900 1850 L1700 1850 C1750 1750 1800 1600 1800 1400 C1800 1200 1750 1000 1650 850 C1550 700 1400 600 1200 600 Z M1200 800 C1350 800 1500 900 1550 1050 C1600 1200 1600 1400 1550 1500 C1500 1600 1350 1700 1200 1700 C1050 1700 900 1600 850 1500 C800 1400 800 1200 850 1050 C900 900 1050 800 1200 800 Z"
          fill="black"
        />
      </g>
    </svg>
  );
}
