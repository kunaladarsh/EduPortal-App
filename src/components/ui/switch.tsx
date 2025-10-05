"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "./utils";
import { Check } from "lucide-react"; 

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<
    typeof SwitchPrimitive.Root
  > {}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        "peer inline-flex h-8 w-16 items-center rounded-full transition-colors shadow-inner border-2",
        "data-[state=unchecked]:bg-switch-background data-[state=unchecked]:border-border",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-transform",
          "transform translate-x-1 data-[state=checked]:translate-x-8",
        )}
      >
        <Check className="h-4 w-4 text-primary transition-opacity data-[state=checked]:opacity-100 opacity-0" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = "Switch";