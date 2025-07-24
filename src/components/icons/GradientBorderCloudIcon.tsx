
import { cn } from "@/lib/utils";

export function GradientBorderCloudIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 1 }} />
        </linearGradient>

        <linearGradient id="fade-gradient-anim" x1="-100%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="40%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            <animate attributeName="x1" from="-100%" to="100%" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="x2" from="0%" to="200%" dur="1.5s" repeatCount="indefinite" />
        </linearGradient>

        <mask id="fade-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#fade-gradient-anim)" />
        </mask>

        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            {/* Create a blurred copy of the source graphic (the gradient stroke) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blurred" />
             {/* Boost the brightness and intensity of the blurred copy */}
            <feComponentTransfer in="blurred" result="boosted">
                <feFuncA type="linear" slope="2" />
            </feComponentTransfer>
            {/* Composite the glow under the original graphic */}
            <feMerge>
                <feMergeNode in="boosted" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
      </defs>

      {/* The animated running line with the glow filter applied */}
      <path
        d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
        fill="none"
        stroke="url(#logo-gradient)"
        strokeWidth="1"
        mask="url(#fade-mask)"
        filter="url(#glow)"
      />
    </svg>
  );
}
