import { cn } from "@/lib/utils";
import { type SelectHTMLAttributes, forwardRef } from "react";

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition-colors",
          "focus:border-primary focus:ring-1 focus:ring-primary",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
export { Select };
