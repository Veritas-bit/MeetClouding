
import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    // This allows the component to be used with both forwardRef and its own internal ref
    React.useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    const adjustHeight = () => {
      if (internalRef.current) {
        internalRef.current.style.height = 'auto'; // Reset height to recalculate
        const scrollHeight = internalRef.current.scrollHeight;
        internalRef.current.style.height = `${scrollHeight}px`;
      }
    };

    // Adjust height on mount and when value changes
    React.useEffect(() => {
      adjustHeight();
    }, [props.value]);

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
        <textarea
            {...props}
            ref={internalRef}
            onChange={(e) => {
                if (props.onChange) {
                props.onChange(e);
                }
                adjustHeight();
            }}
            className={cn(
                'relative flex min-h-[40px] w-full rounded-[7px] border-none bg-background px-3 py-2 text-sm text-foreground',
                'placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'resize-none overflow-y-hidden',
                className
            )}
        />
       </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
