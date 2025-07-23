
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
          d="M1200,420 C880,420 600,600 600,900 C600,1200 750,1500 900,1650 C900,1650 810,1980 1200,1980 C1590,1980 1500,1650 1500,1650 C1650,1500 1800,1200 1800,900 C1800,600 1520,420 1200,420 Z M1200,600 C1400,600 1500,750 1500,900 C1500,1050 1400,1200 1200,1200 C1000,1200 900,1050 900,900 C900,750 1000,600 1200,600 Z"
          fill="black"
        />
      </g>
    </svg>
  );
}
