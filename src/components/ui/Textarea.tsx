import { cn } from "@/lib/utils";
import { type TextareaHTMLAttributes, forwardRef } from "react";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition-colors resize-y min-h-[100px]",
          "placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
