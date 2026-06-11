"use client";

// Floating Action Button — primary action (Contact). (DESIGN-SYSTEM §4.2 Chrome)

import { useEffect, useRef } from "react";
import { fabIn } from "@/lib/motion/material";
import { useSkin } from "@/components/SkinProvider";
import { useRipple } from "./useRipple";

interface FABProps {
  onClick: () => void;
  label: string;
  icon: string;
  extended?: boolean;
}

export function FAB({ onClick, label, icon, extended }: FABProps) {
  const { reducedMotion } = useSkin();
  const wrapRef = useRef<HTMLDivElement>(null);
  const onRipple = useRipple<HTMLButtonElement>();

  useEffect(() => {
    if (wrapRef.current) fabIn(wrapRef.current, { reducedMotion });
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} style={{ willChange: "transform" }}>
      <button
        onClick={onClick}
        onPointerDown={onRipple}
        aria-label={label}
        className="md-ripple flex items-center gap-2 rounded-[var(--md-radius-md)] px-4 py-4 text-[15px] font-medium shadow-lg"
        style={{
          background: "var(--md-primary-container)",
          color: "var(--md-on-primary-container)",
        }}
      >
        <span aria-hidden className="text-xl leading-none">
          {icon}
        </span>
        {extended && <span className="pr-1">{label}</span>}
      </button>
    </div>
  );
}
