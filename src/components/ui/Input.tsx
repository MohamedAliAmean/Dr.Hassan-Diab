import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition-colors",
          "placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export { Input };
