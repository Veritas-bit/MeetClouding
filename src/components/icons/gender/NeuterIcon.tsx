
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
          d="M1200,400 C800,400 500,700 500,1200 C500,1300 550,1550 600,1700 L800,2000 L1600,2000 L1800,1700 C1850,1550 1900,1300 1900,1200 C1900,700 1600,400 1200,400 Z M1200,800 C1400,800 1500,900 1500,1100 C1500,1300 1400,1400 1200,1400 C1000,1400 900,1300 900,1100 C900,900 1000,800 1200,800 Z"
          fill="black"
        />
      </g>
    </svg>
  );
}
