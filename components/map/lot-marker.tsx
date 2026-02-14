"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import { ParkingLot, LotStatus } from "@/types/parking";

const BASE_COLOR = "#16a34a";

interface LotMarkerProps {
  lot: ParkingLot;
  status: LotStatus | undefined;
  isSelected?: boolean;
  onClick: (lot: ParkingLot) => void;
}

function createIcon(isSelected: boolean) {
  const color = BASE_COLOR;
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
      <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 24 24" fill="white">
        <path d="M6 20V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3v7H6zm2-9h3V6H8v5zm5-3v2h3V9h-3z"/>
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function LotMarker({ lot, isSelected = false, onClick }: LotMarkerProps) {
  return (
    <Marker
      position={[lot.lat, lot.lng]}
      icon={createIcon(isSelected)}
      eventHandlers={{ click: () => onClick(lot) }}
    />
  );
}
