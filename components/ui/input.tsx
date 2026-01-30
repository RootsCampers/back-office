import * as React from "react";

import { cn } from "@/lib/styles";

// Add to the existing interface or create it if it doesn't exist
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

// In the Input component implementation
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => (
    <div className="relative">
      {icon && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2">{icon}</span>
      )}
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
          icon ? "pl-8" : "",
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  ),
);
Input.displayName = "Input";
