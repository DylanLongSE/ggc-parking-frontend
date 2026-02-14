"use client";

import { LocateFixed } from "lucide-react";

interface MapControlsProps {
  onRecenter: () => void;
}

export function MapControls({ onRecenter }: MapControlsProps) {
  return (
    <div className="absolute right-4 top-20 z-[999] flex flex-col gap-2">
      <button
        onClick={onRecenter}
        className="rounded-full bg-background p-3 shadow-lg border border-border hover:bg-accent transition-colors"
        aria-label="Re-center map on campus"
      >
        <LocateFixed className="h-5 w-5" />
      </button>
    </div>
  );
}
