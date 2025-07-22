import { cn } from "@/lib/utils";

export function MaleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <circle cx="40" cy="40" r="40" fill="hsl(var(--muted))" />
      <g clipPath="url(#clip0_2003_10)">
        <path
          d="M40 46C46.6274 46 52 40.6274 52 34C52 27.3726 46.6274 22 40 22C33.3726 22 28 27.3726 28 34C28 40.6274 33.3726 46 40 46Z"
          fill="hsl(var(--primary))"
          fillOpacity="0.4"
        />
        <path
          d="M58 64C58 56.268 51.732 50 44 50H36C28.268 50 22 56.268 22 64H58Z"
          fill="hsl(var(--primary))"
          fillOpacity="0.4"
        />
      </g>
      <defs>
        <clipPath id="clip0_2003_10">
          <rect width="48" height="48" fill="white" transform="translate(16 16)" />
        </clipPath>
      </defs>
    </svg>
  );
}
