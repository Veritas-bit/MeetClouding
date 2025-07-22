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
      <g clipPath="url(#clip0_2003_12)">
        <path
          d="M40.0003 48.6667C47.7463 48.6667 54.0003 42.4127 54.0003 34.6667C54.0003 26.9207 47.7463 20.6667 40.0003 20.6667C32.2543 20.6667 26.0003 26.9207 26.0003 34.6667C26.0003 42.4127 32.2543 48.6667 40.0003 48.6667Z"
          fill="hsl(var(--primary))"
          fillOpacity="0.4"
        />
        <path
          d="M62 68C62 58.0587 53.9413 50 44 50H36C26.0587 50 18 58.0587 18 68L20.1037 60.65C21.4637 56.18 25.4187 53 30.1187 53H49.8813C54.5813 53 58.5363 56.18 59.8963 60.65L62 68Z"
          fill="hsl(var(--primary))"
          fillOpacity="0.4"
        />
      </g>
      <defs>
        <clipPath id="clip0_2003_12">
          <rect width="48" height="48" fill="white" transform="translate(16 16)" />
        </clipPath>
      </defs>
    </svg>
  );
}
