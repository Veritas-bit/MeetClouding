import { cn } from "@/lib/utils";

export function FemaleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <circle cx="40" cy="40" r="40" fill="#7289DA" />
      <path
        d="M51.5 58C51.5 53.8579 48.2843 50.5 44.25 50.5H35.75C31.7157 50.5 28.5 53.8579 28.5 58V61H51.5V58Z"
        fill="#2C2F33"
      />
      <path
        d="M40 49C45.5228 49 50 44.5228 50 39C50 33.4772 45.5228 29 40 29C34.4772 29 30 33.4772 30 39C30 44.5228 34.4772 49 40 49Z"
        fill="#FFFFFF"
      />
      <path
        d="M46 31C46 29.8954 45.1046 29 44 29H36C34.8954 29 34 29.8954 34 31V32C34 33.1046 34.8954 34 36 34H44C45.1046 34 46 33.1046 46 32V31Z"
        fill="#2C2F33"
      />
      <circle cx="40" cy="24" r="5" fill="#2C2F33" />
      <path
        d="M45 30H35C34.4477 30 34 29.5523 34 29V28C34 27.4477 34.4477 27 35 27H45C45.5523 27 46 27.4477 46 28V29C46 29.5523 45.5523 30 45 30Z"
        fill="#2C2F33"
      />
      <circle cx="36" cy="31.5" r="1.5" fill="white" />
      <circle cx="44" cy="31.5" r="1.5" fill="white" />
    </svg>
  );
}