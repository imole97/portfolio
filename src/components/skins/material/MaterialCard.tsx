"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { useRipple } from "./useRipple";

// Tonal Material card with press ripple. (DESIGN-SYSTEM §4.2 Materials, §6 Container)
export function MaterialCard({
  className,
  children,
  onPointerDown,
  ...props
}: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const ripple = useRipple<HTMLButtonElement>();
  return (
    <button
      onPointerDown={(e) => {
        ripple(e);
        onPointerDown?.(e);
      }}
      className={cn(
        "md-ripple md-surface block w-full rounded-[var(--md-radius-lg)] p-4 text-left",
        "transition-[transform,background] duration-200 active:scale-[0.99]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
