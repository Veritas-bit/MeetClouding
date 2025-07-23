
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
          d="M1200 500 C850 500, 700 700, 700 1000 L700 1700 C800 1900, 1000 1900, 1200 1900 C1400 1900, 1600 1900, 1700 1700 L1700 1000 C1700 700, 1550 500, 1200 500 Z M1200 700 C1400 700, 1500 800, 1500 1000 L1500 1600 C1400 1700, 1300 1700, 1200 1700 C1100 1700, 1000 1700, 900 1600 L900 1000 C900 800, 1000 700, 1200 700 Z"
          fill="black"
        />
      </g>
    </svg>
  );
}
