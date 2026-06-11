"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { useReveal } from "./useReveal";

// Mica/card surface with reveal highlight. (DESIGN-SYSTEM §4.3, §6 Container)
export function FluentCard({
  className,
  children,
  ...props
}: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const reveal = useReveal<HTMLButtonElement>();
  return (
    <button
      {...reveal}
      className={cn(
        "fluent-card reveal block w-full overflow-hidden text-left transition-colors",
        "hover:border-[var(--fl-stroke-strong)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
