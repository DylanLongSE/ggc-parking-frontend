"use client";

import { getMockTrends } from "@/lib/mock-trends";
import { AVAILABILITY_THRESHOLDS } from "@/lib/constants";

/** Props for the {@link HourlyTrendChart} component. */
export interface HourlyTrendChartProps {
  /** The lot identifier used to look up trend data. */
  lotId: string;
}

function getBarColor(occupancy: number): string {
  const available = 1 - occupancy;
  if (available > AVAILABILITY_THRESHOLDS.HIGH) return "bg-primary";
  if (available > AVAILABILITY_THRESHOLDS.LOW) return "bg-yellow-500";
  return "bg-destructive";
}

function formatHour(hour: number): string {
  if (hour === 0 || hour === 12) return "12";
  return String(hour > 12 ? hour - 12 : hour);
}

/**
 * Bar chart showing the typical hourly occupancy pattern for a parking lot.
 * Highlights the current hour with a ring indicator.
 */
export function HourlyTrendChart({ lotId }: HourlyTrendChartProps) {
  const trends = getMockTrends(lotId);
  const currentHour = new Date().getHours();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Typical Occupancy
      </h3>
      <div className="flex items-end gap-[3px] h-20">
        {trends.map((t) => {
          const isCurrent = t.hour === currentHour;
          return (
            <div
              key={t.hour}
              className="flex-1 flex flex-col items-center justify-end h-full"
            >
              <div
                className={`w-full rounded-sm transition-all ${getBarColor(t.avgOccupancy)} ${
                  isCurrent ? "ring-2 ring-foreground ring-offset-1" : ""
                }`}
                style={{ height: `${Math.max(t.avgOccupancy * 100, 4)}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-[3px] text-[9px] text-muted-foreground">
        {trends.map((t) => (
          <div key={t.hour} className="flex-1 text-center">
            {t.hour % 3 === 0 ? `${formatHour(t.hour)}${t.hour < 12 ? "a" : "p"}` : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
