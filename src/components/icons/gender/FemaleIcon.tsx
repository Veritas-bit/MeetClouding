
import { cn } from "@/lib/utils";

export function FemaleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <circle cx="40" cy="40" r="40" fill="hsl(var(--muted))" />
      <g transform="translate(40, 40) scale(0.04) translate(-1300, -1400)">
        <path
            d="M882 1050 c-311 -127 -327 -145 -398 -449 l-38 -164 39 -34 c221 -192 446 -300 717 -343 118 -18 342 -14 459 10 258 53 490 170 666 336 l61 59 -33 173 c-21 108 -42 185 -54 206 -49 78 -136 138 -296 201 -38 15 -96 40 -128 56 -40 19 -59 24 -62 16 -3 -7 -20 -66 -39 -133 -85 -297 -212 -535 -306 -574 -27 -11 -34 -10 -70 14 -111 74 -257 366 -308 617 l-18 87 -192 -78z"
            fill="hsl(var(--primary))"
            fillOpacity="0.4"
        />
      </g>
    </svg>
  );
}
