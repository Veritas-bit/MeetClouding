import { cn } from "@/lib/utils";
import { GradientUserCircleIcon } from "../GradientUserCircleIcon";

export function NeuterIcon({ className }: { className?: string }) {
  return (
    <GradientUserCircleIcon className={cn("p-0", className)} />
  );
}
