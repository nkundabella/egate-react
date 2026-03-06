import * as React from "react";
import { cn } from "@/app/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-[6px]">
        {label && (
          <label className="text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              error &&
                "border-destructive focus-visible:border-destructive focus-visible:ring-destructive",
              className,
            )}
            placeholder={props.placeholder}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm font-medium text-destructive px-1">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
