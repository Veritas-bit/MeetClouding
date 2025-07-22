import { cn } from "@/lib/utils";

export function MaleIcon({ className }: { className?: string }) {
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
        d="M48 29C48 25.6863 44.4183 23 40 23C35.5817 23 32 25.6863 32 29V32H48V29Z"
        fill="#2C2F33"
      />
      <path
        d="M50 49C50 51.2091 45.5228 53 40 53C34.4772 53 30 51.2091 30 49V47C30 44.7909 34.4772 43 40 43C45.5228 43 50 44.7909 50 47V49Z"
        fill="#2C2F33"
      />
    </svg>
  );
}