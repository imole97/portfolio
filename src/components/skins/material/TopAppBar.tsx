"use client";

// Large flexible top app bar that collapses on scroll. (DESIGN-SYSTEM §4.2 Chrome)

import { useEffect, useRef, useState } from "react";

interface TopAppBarProps {
  title: string;
  subtitle?: string;
  /** The scrolling content element this bar reacts to. */
  scrollRef: React.RefObject<HTMLElement | null>;
  action?: React.ReactNode;
  /** Optional leading control (e.g. a back button when opened as an app). */
  leading?: React.ReactNode;
}

export function TopAppBar({ title, subtitle, scrollRef, action, leading }: Readonly<TopAppBarProps>) {
  const [collapsed, setCollapsed] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setCollapsed(el.scrollTop > 40);
        ticking.current = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  return (
    <header
      className="sticky top-0 z-[300] px-4 transition-all duration-300"
      style={{
        background: collapsed ? "var(--md-surface-container)" : "var(--md-background)",
        color: "var(--md-on-background)",
        paddingTop: collapsed ? 12 : 20,
        paddingBottom: collapsed ? 12 : 16,
      }}
    >
      <div className="flex items-center gap-2">
        {leading}
        <h1
          className="font-semibold transition-all duration-300"
          style={{
            fontSize: collapsed ? "1.25rem" : "2rem",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        {action && <span className="ml-auto">{action}</span>}
      </div>
      {subtitle && (
        <p
          className="overflow-hidden text-[14px] transition-all duration-300"
          style={{
            color: "var(--md-on-surface-variant)",
            maxHeight: collapsed ? 0 : 40,
            opacity: collapsed ? 0 : 1,
            marginTop: collapsed ? 0 : 4,
            marginLeft: leading ? 44 : 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
