
import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value || '');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value);
      if (props.onChange) {
        props.onChange(event);
      }
    };

    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height to recalculate
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${scrollHeight}px`;
      }
    }, [value]);

    React.useEffect(() => {
      if (props.value !== undefined) {
        setValue(props.value);
      }
    }, [props.value]);

    return (
      <div 
        className={cn(
          "relative w-full rounded-xl p-px",
          "bg-gradient-to-r from-primary/30 to-secondary/30",
          "transition-all duration-300",
          "focus-within:from-primary/80 focus-within:to-secondary/80",
          "focus-within:shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
        )}
      >
        <textarea
          {...props}
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          className={cn(
            'relative flex w-full rounded-[11px] border-none bg-background px-3 py-2 text-sm text-foreground',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0',
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
