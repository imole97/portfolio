"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Reusable liquid-glass card. (DESIGN-SYSTEM §4.1 Materials, §6 Container)
export const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function GlassCard({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "glass glass-specular rounded-[var(--radius-card)] p-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
