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
                'relative flex min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
                'placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'resize-none overflow-y-hidden',
                className
            )}
        />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
