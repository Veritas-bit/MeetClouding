
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
       <path d="M1200 480C855.6 480 576 759.6 576 1104V1296C576 1569.6 741.6 1920 1200 1920C1658.4 1920 1824 1569.6 1824 1296V1104C1824 759.6 1544.4 480 1200 480Z" fill="black"/>
    </svg>
  );
}
