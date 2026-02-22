"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import { ParkingLot, LotStatus } from "@/types/parking";
import { getAvailabilityLevel, getAvailabilityHex } from "@/lib/availability";

interface LotMarkerProps {
  lot: ParkingLot;
  status: LotStatus | undefined;
  isSelected?: boolean;
  onClick: (lot: ParkingLot) => void;
}

function createIcon(color: string, isSelected: boolean) {
  const size = isSelected ? 40 : 32;
  const svgSize = isSelected ? 20 : 16;
  const borderWidth = isSelected ? 4 : 3;
  const shadow = isSelected
    ? `0 2px 6px rgba(0,0,0,0.3), 0 0 12px ${color}80`
    : "0 2px 6px rgba(0,0,0,0.3)";

  return L.divIcon({
    className: "",
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: ${borderWidth}px solid white;
      border-radius: 50%;
      box-shadow: ${shadow};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    ">
      <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 24 24">
        <text x="12" y="17.5" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="sans-serif">P</text>
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function LotMarker({ lot, status, isSelected = false, onClick }: LotMarkerProps) {
  const level = getAvailabilityLevel(lot, status);
  const color = status ? getAvailabilityHex(level) : "#9ca3af";

  return (
    <Marker
      position={[lot.lat, lot.lng]}
      icon={createIcon(color, isSelected)}
      eventHandlers={{ click: () => onClick(lot) }}
    />
  );
}
