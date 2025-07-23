
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
      <g transform="translate(1200 1200) scale(-1, -1) translate(-1200 -1200)">
        <path
          d="M1200 1740C1385.6 1740 1530 1595.6 1530 1410C1530 1224.4 1385.6 1080 1200 1080C1014.4 1080 870 1224.4 870 1410C870 1595.6 1014.4 1740 1200 1740Z"
          fill="black"
        />
        <path
          d="M1532.4 900H867.6C775.2 900 702 826.8 702 735V660H1698V735C1698 826.8 1624.8 900 1532.4 900Z"
          fill="black"
        />
      </g>
    </svg>
  );
}
