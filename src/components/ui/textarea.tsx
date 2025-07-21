
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
          "relative rounded-xl p-px w-full",
          "before:absolute before:-z-10 before:inset-0 before:rounded-xl before:bg-[linear-gradient(135deg,var(--tw-gradient-stops))] before:from-primary/50 before:to-secondary/50",
          "after:absolute after:-z-20 after:inset-0 after:rounded-xl after:bg-[linear-gradient(135deg,var(--tw-gradient-stops))] after:from-primary after:to-secondary after:blur-md after:transition-opacity after:duration-500 after:opacity-0",
          "has-[textarea:focus]:after:opacity-30"
        )}
      >
        <textarea
          {...props}
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          className={cn(
            'flex w-full rounded-[11px] border-none bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
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
