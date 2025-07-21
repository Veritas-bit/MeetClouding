
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div 
        className={cn(
          "relative rounded-lg p-px",
          "before:absolute before:-z-10 before:inset-0 before:rounded-lg before:bg-[linear-gradient(135deg,var(--tw-gradient-stops))] before:from-primary/50 before:to-secondary/50",
          "after:absolute after:-z-20 after:inset-0 after:rounded-lg after:bg-[linear-gradient(135deg,var(--tw-gradient-stops))] after:from-primary after:to-secondary after:blur-md after:transition-opacity after:duration-500 after:opacity-0",
          "has-[input:focus]:after:opacity-30"
        )}
      >
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-[7px] border-none bg-muted/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
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
