import { cn } from "@/lib/utils";

export function NeuterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("", className)}
    >
      <defs>
        <linearGradient id="gender-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="4" fill="url(#gender-gradient)" stroke="none" />
      <path d="M12 16v6" stroke="url(#gender-gradient)" />
      <path d="M12 2v2" stroke="url(#gender-gradient)" />
      <path d="m19 5-1.5 1.5" stroke="url(#gender-gradient)" />
      <path d="m6.5 17.5-1.5 1.5" stroke="url(#gender-gradient)" />
      <path d="M5 5l1.5 1.5" stroke="url(#gender-gradient)" />
      <path d="m17.5 17.5 1.5 1.5" stroke="url(#gender-gradient)" />
    </svg>
  );
}
