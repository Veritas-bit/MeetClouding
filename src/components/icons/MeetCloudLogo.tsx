
import { cn } from "@/lib/utils"

export function MeetCloudLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 40" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8", className)} 
      style={{ width: 'auto' }} 
    >
      <defs>
        <linearGradient id="meetcloud-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 1 }} />
        </linearGradient>
         <mask id="meetcloud-mask">
            <g fill="white">
                 <path
                    transform="scale(1.5) translate(0, -2)"
                    d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
                />
                <text 
                    x="40" 
                    y="28" 
                    fontFamily="var(--font-nunito), sans-serif" 
                    fontSize="24" 
                    fontWeight="bold"
                    letterSpacing="0.5"
                >
                    MeetCloud
                </text>
            </g>
        </mask>
      </defs>
      
      <rect x="0" y="0" width="180" height="40" fill="url(#meetcloud-gradient)" mask="url(#meetcloud-mask)" />
    </svg>
  );
}
