
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
      {/* 
        Пожалуйста, вставьте данные пути (атрибут d) для вашего силуэта ниже.
        Я уже настроил размеры, положение и цвета.
      */}
      <path
        d="" 
        fill="hsl(var(--primary))"
        fillOpacity="0.4"
      />
    </svg>
  );
}
