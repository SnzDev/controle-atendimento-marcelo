import * as React from "react";

import { cn } from "~/lib/utils";

export type InputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    icon?: React.ReactNode;
    inputClassName?: React.InputHTMLAttributes<HTMLInputElement>['className']
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputClassName, type, icon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}>
        <input
          type={type}
          className={cn("w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50", inputClassName)}
          ref={ref}
          {...props}
        />
        <span className="pr-4">
          {icon}
        </span>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };