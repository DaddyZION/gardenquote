"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, label, ...props }, ref) => (
  <div className="flex items-center justify-between gap-4 py-2">
    {label && (
      <label className="text-base font-medium text-slate-300 cursor-pointer select-none">
        {label}
      </label>
    )}
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-10 w-[72px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-slate-700 touch-manipulation",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-8 w-8 rounded-full bg-white shadow-lg transition-transform duration-300 data-[state=checked]:translate-x-9 data-[state=unchecked]:translate-x-1"
        )}
      />
    </SwitchPrimitives.Root>
  </div>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
