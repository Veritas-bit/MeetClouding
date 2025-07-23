
import { cn } from "@/lib/utils";

export function BackIcon({ className }: { className?: string }) {
  return (
    <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={cn("", className)}
    >
        <path 
            d="M14 6L8 12L14 18" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
  );
}
