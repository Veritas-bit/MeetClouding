
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
          d="M1200,500 C900,500 700,700 700,1000 L700,1500 C700,1800 900,1900 1200,1900 C1500,1900 1700,1800 1700,1500 L1700,1000 C1700,700 1500,500 1200,500 Z M1200,900 C1350,900 1450,1050 1450,1300 L1450,1500 L950,1500 L950,1300 C950,1050 1050,900 1200,900 Z"
          fill="black"
        />
      </g>
    </svg>
  );
}
