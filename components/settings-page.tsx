"use client";
import { useTheme } from "@/contexts/theme-context";

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="overflow-y-auto h-dvh pb-20 px-4 pt-6">
      <h1 className="text-2xl font-bold mb-0.5">Settings</h1>
      <p className="text-sm text-muted-foreground mb-5">App preferences</p>
      <div className="space-y-3">
        <div className="rounded-2xl border border-border bg-card px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Dark mode</p>
            <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
          </div>
          <button
            onClick={toggleTheme}
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDark ? "bg-primary" : "bg-muted"
            }`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              isDark ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
