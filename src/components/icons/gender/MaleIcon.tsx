
import { cn } from "@/lib/utils";

export function MaleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 2400 2400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <defs>
        <linearGradient id="avatar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
            <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))" }} />
        </linearGradient>
      </defs>
      <circle cx="1200" cy="1200" r="1200" fill="url(#avatar-gradient)" />
      <g transform="translate(150, 200)">
        <path
            d="M1726.5,824.5C1726.5,483.74,1447.26,204.5,1106.5,204.5C765.74,204.5,486.5,483.74,486.5,824.5C486.5,1165.26,765.74,1444.5,1106.5,1444.5C1447.26,1444.5,1726.5,1165.26,1726.5,824.5Z"
            fill="hsl(var(--background))"
        />
        <path
            d="M204.5,2097.5C204.5,1756.74,483.74,1477.5,824.5,1477.5H1388.5C1729.26,1477.5,2008.5,1756.74,2008.5,2097.5V2195.5H204.5V2097.5Z"
            fill="hsl(var(--background))"
        />
      </g>
    </svg>
  );
}
