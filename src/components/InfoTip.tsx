"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * A small explanatory popover. Opens on click as well as hover/focus, because
 * a hover-only tooltip is unreachable on a phone — and these explanations are
 * the point of the perk controls, not decoration.
 */
export function InfoTip({
  label,
  children,
  align = "left",
}: {
  /** Describes what is being explained, for screen readers. */
  label: string;
  children: ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={`What is ${label}?`}
        onClick={() => setOpen((value) => !value)}
        className="grid size-5 place-items-center rounded-full border border-rule text-[0.6875rem] font-semibold text-faint transition-colors hover:border-accent hover:text-accent"
      >
        i
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className={`absolute bottom-full z-30 mb-2 w-64 rounded-sm border border-rule-strong bg-surface p-3 text-[0.8125rem] leading-relaxed text-muted shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <span className="mb-1 block font-semibold text-ink">{label}</span>
          {children}
        </span>
      ) : null}
    </span>
  );
}
