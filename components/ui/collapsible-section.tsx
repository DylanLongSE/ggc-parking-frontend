"use client";

import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

/** Props for the {@link CollapsibleSection} component. */
export interface CollapsibleSectionProps {
  /** Section heading text. */
  title: string;
  /** Optional Lucide icon displayed to the left of the title. */
  icon?: LucideIcon;
  /** Content revealed when the section is expanded. */
  children: React.ReactNode;
  /** Whether the section starts in the open state. Defaults to `false`. */
  defaultOpen?: boolean;
}

/**
 * Animated accordion section with a toggle button header.
 * Uses CSS grid transition for smooth expand/collapse without JS height measurement.
 */
export function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left font-medium transition-colors hover:bg-accent/50"
      >
        {Icon && <Icon className="h-5 w-5 text-primary shrink-0" />}
        <span className="flex-1">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
