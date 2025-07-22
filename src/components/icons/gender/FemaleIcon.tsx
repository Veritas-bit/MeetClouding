
import { cn } from "@/lib/utils";

export function FemaleIcon({ className }: { className?: string }) {
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
      <g transform="translate(1152 1272) scale(1, -1) translate(-1440 -1200)">
        <path
            d="M1324 2420 c-161 -17 -241 -79 -286 -223 -21 -65 -23 -92 -23 -282 l0 -210 34 -69 c21 -44 59 -95 102 -140 l68 -71 1 33 c0 20 -10 46 -24 65 -14 18 -35 57 -46 88 -17 44 -26 55 -43 55 -43 -2 -84 176 -55 239 13 29 26 32 43 9 10 -14 14 -9 25 32 25 94 75 188 134 251 56 61 58 62 85 49 111 -58 225 -183 296 -324 41 -83 95 -241 95 -278 0 -28 -31 -94 -66 -141 -13 -17 -24 -44 -24 -60 1 -27 2 -26 55 29 l54 57 6 -57 c9 -83 10 -83 43 -12 96 203 132 549 74 712 -71 200 -248 280 -548 248z"
            fill="hsl(var(--background))"
        />
        <path
            d="M882 1050 c-311 -127 -327 -145 -398 -449 l-38 -164 39 -34 c221 -192 446 -300 717 -343 118 -18 342 -14 459 10 258 53 490 170 666 336 l61 59 -33 173 c-21 108 -42 185 -54 206 -49 78 -136 138 -296 201 -38 15 -96 40 -128 56 -40 19 -59 24 -62 16 -3 -7 -20 -66 -39 -133 -85 -297 -212 -535 -306 -574 -27 -11 -34 -10 -70 14 -111 74 -257 366 -308 617 l-18 87 -192 -78z"
            fill="hsl(var(--background))"
        />
      </g>
    </svg>
  );
}
