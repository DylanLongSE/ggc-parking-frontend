"use client";

/** Props for the {@link HourlyTrendChart} component. */
export interface HourlyTrendChartProps {
  /** The lot identifier used to look up trend data. */
  lotId: string;
}

/**
 * Bar chart showing the typical hourly occupancy pattern for a parking lot.
 * Replace me — connect to real trend data from Supabase when available.
 */
export function HourlyTrendChart({ lotId: _lotId }: HourlyTrendChartProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Typical Occupancy
      </h3>
      <div className="flex items-center justify-center h-20 rounded-md border border-dashed border-muted-foreground/30">
        <p className="text-xs text-muted-foreground">replace me</p>
      </div>
    </div>
  );
}
