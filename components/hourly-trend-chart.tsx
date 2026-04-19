"use client";

import { useEffect, useState } from "react";
import { getLotHistory } from "@/lib/api";
import { HourlyTrend, ParkingLot } from "@/types/parking";

export interface HourlyTrendChartProps {
  lotId: string;
  lot: ParkingLot;
  freeCount: number;
  occupiedCount: number;
  isOffline: boolean;
}

const HOUR_LABELS = ["7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p"];

function fillGaps(data: HourlyTrend[], capacity: number): { label: string; pct: number; avg: number }[] {
  const byHour = new Map(data.map((d) => [d.hour, d.avgOccupancy]));
  return HOUR_LABELS.map((label, i) => {
    const avg = byHour.get(i + 7) ?? 0;
    return { label, pct: Math.min(100, Math.round((avg / capacity) * 100)), avg };
  });
}

function barColor(pct: number) {
  if (pct < 50) return "#22c55e";
  if (pct < 75) return "#f59e0b";
  return "#ef4444";
}

function todayLabel() {
  return `Today, ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()]}`;
}

export function HourlyTrendChart({ lotId, lot, freeCount, occupiedCount, isOffline }: HourlyTrendChartProps) {
  const [chartData, setChartData] = useState<{ label: string; pct: number; avg: number }[] | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const capacity = lot.totalSpaces;

  useEffect(() => {
    getLotHistory(lotId).then((d) => setChartData(fillGaps(d, capacity)));
  }, [lotId, capacity]);

  const CHART_H = 140;

  // Truncated Y-axis: start from half the minimum observed avg
  const validAvgs = chartData?.map((d) => d.avg).filter((a) => a > 0) ?? [];
  const minAvg = validAvgs.length > 0 ? Math.min(...validAvgs) : 0;
  const yMin = Math.max(0, Math.floor(minAvg * 0.5));
  const yRange = capacity - yMin;

  return (
    <div className="flex flex-col gap-3">
      {/* 3 stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Available",   val: isOffline ? "—" : freeCount,     color: "#22c55e" },
          { label: "Occupied",    val: isOffline ? "—" : occupiedCount,  color: "#ef4444" },
          { label: "Total Spots", val: capacity,                         color: "#8a8983" },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-xl px-4 py-3">
            <div className="text-2xl font-semibold leading-none tracking-tight" style={{ color: item.color }}>
              {item.val}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Histogram card */}
      <div className="bg-card border border-border rounded-xl px-5 py-4">
        {/* Card header */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-sm font-medium tracking-tight">Typical Occupancy</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Historical average by hour</div>
          </div>
          <span className="text-[11px] text-muted-foreground bg-muted rounded-md px-2.5 py-1">
            {todayLabel()}
          </span>
        </div>

        {!chartData ? (
          <div className="h-36 animate-pulse rounded-lg bg-muted" />
        ) : chartData.every((d) => d.pct === 0) ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No historical data yet.</p>
        ) : (
          <div className="w-full">
            {/* Chart area */}
            <div
              className="relative flex items-end gap-1.5"
              style={{ height: CHART_H + 24, paddingTop: 8 }}
            >
              {/* Grid lines — no labels */}
              <div className="absolute pointer-events-none" style={{ top: 8, bottom: 24, left: 0, right: 0 }}>
                {[33, 66, 100].map((pct) => (
                  <div
                    key={pct}
                    className="absolute left-0 right-0"
                    style={{ bottom: `${pct}%`, borderTop: "1px dashed #e2e1de" }}
                  />
                ))}
                <div className="absolute left-0 right-0" style={{ bottom: 0, borderTop: "1.5px solid #d1d0cc" }} />
              </div>

              {/* Bars */}
              {chartData.map((d, i) => {
                const isHov = hovered === i;
                const color = barColor(d.pct);
                const barH = Math.max(0, ((d.avg - yMin) / yRange)) * CHART_H;
                return (
                  <div
                    key={d.label}
                    className="relative flex flex-col items-center justify-end"
                    style={{ flex: 1, height: "100%", cursor: "pointer" }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Tooltip */}
                    {isHov && (
                      <div
                        className="absolute z-10 whitespace-nowrap text-white rounded text-[11px] font-medium px-2 py-1"
                        style={{ bottom: 24 + barH + 6, background: "#1a1a1a", letterSpacing: "0.01em" }}
                      >
                        {d.avg.toFixed(1)} / {capacity} spots taken
                      </div>
                    )}
                    {/* Bar */}
                    <div
                      style={{
                        width: "100%",
                        height: barH,
                        background: color,
                        borderRadius: "4px 4px 0 0",
                        opacity: isHov ? 1 : 0.82,
                        transition: "opacity 0.15s",
                        boxShadow: isHov ? `0 0 0 2px ${color}40` : "none",
                      }}
                    />
                    {/* X label */}
                    <div className="mt-1.5 text-[10px]" style={{ color: "#8a8983" }}>
                      {d.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4">
              {[
                { label: "Open (< 50% full)",      color: "#22c55e" },
                { label: "Filling up (50–75%)",    color: "#f59e0b" },
                { label: "Almost full (> 75%)",    color: "#ef4444" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color, opacity: 0.82 }} />
                  <span className="text-[11px]" style={{ color: "#8a8983" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
