
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div 
        className={cn(
          "relative w-full rounded-lg p-px",
          "bg-gradient-to-r from-primary/30 to-secondary/30",
          "transition-all duration-300",
          "focus-within:from-primary/80 focus-within:to-secondary/80",
          "focus-within:shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
        )}
      >
        <input
          type={type}
          className={cn(
            "relative flex h-10 w-full rounded-[7px] border-none bg-muted/50 px-3 py-2 text-base text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
