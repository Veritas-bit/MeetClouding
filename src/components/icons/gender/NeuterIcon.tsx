
import { cn } from "@/lib/utils";

export function NeuterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 2400 2400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <circle cx="1200" cy="1200" r="1200" fill="black" />
      <g transform="translate(1200 1200) scale(1, -1) translate(-1200 -1200)">
        <path 
          d="M1200 1740C1385.6 1740 1530 1595.6 1530 1410C1530 1224.4 1385.6 1080 1200 1080C1014.4 1080 870 1224.4 870 1410C870 1595.6 1014.4 1740 1200 1740Z" 
          fill="white"
        />
        <path 
          d="M1532.4 900H867.6C775.2 900 702 826.8 702 735V660H1698V735C1698 826.8 1624.8 900 1532.4 900Z" 
          fill="white"
        />
      </g>
    </svg>
  );
}
