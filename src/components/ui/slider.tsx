"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
  showValue?: boolean;
  unit?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, label, showValue = true, unit, value, ...props }, ref) => {
  const displayValue = Array.isArray(value) ? value[0] : value;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-3">
          {label && (
            <label className="text-sm font-medium text-slate-300">
              {label}
            </label>
          )}
          {showValue && displayValue !== undefined && (
            <span className="text-lg font-bold text-amber-500">
              {displayValue}
              {unit}
            </span>
          )}
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        value={value}
        className={cn(
          "relative flex w-full touch-none select-none items-center py-4",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-slate-700">
          <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-amber-600 to-amber-400" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-8 w-8 rounded-full border-4 border-amber-500 bg-slate-900 shadow-lg shadow-amber-500/30 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/30 disabled:pointer-events-none disabled:opacity-50 active:scale-110 touch-manipulation" />
      </SliderPrimitive.Root>
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
