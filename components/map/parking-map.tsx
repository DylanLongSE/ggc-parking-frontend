"use client";

import { useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { ParkingLot } from "@/types/parking";
import { GGC_CENTER, GGC_DEFAULT_ZOOM, GGC_BOUNDS, PARKING_LOTS } from "@/lib/constants";
import { useLotStatuses } from "@/hooks/use-lot-statuses";
import { LotMarker } from "./lot-marker";
import { LotChips } from "./lot-chips";
import { MapControls } from "./map-controls";
import { LotDrawer } from "./lot-drawer";
import { BottomTabs, type TabId } from "../bottom-tabs";
import { OverviewPage } from "../overview-page";
import { InfoPage } from "../info-page";

export default function ParkingMap() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("lots");
  const { statuses, isLoading } = useLotStatuses();

  const handleSelectLot = useCallback((lot: ParkingLot) => {
    setSelectedLot((prev) => {
      if (prev?.id === lot.id) {
        mapRef.current?.flyTo(
          [GGC_CENTER.lat, GGC_CENTER.lng],
          GGC_DEFAULT_ZOOM,
          { duration: 0.5 }
        );
        return null;
      } else {
        mapRef.current?.flyTo([lot.lat, lot.lng], 17, { duration: 0.5 });
        return lot;
      }
    });
  }, []);

  const handleRecenter = useCallback(() => {
    mapRef.current?.flyTo(
      [GGC_CENTER.lat, GGC_CENTER.lng],
      GGC_DEFAULT_ZOOM,
      { duration: 0.5 }
    );
  }, []);

  const drawerOpen = !!selectedLot;

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Lots tab — map + chips + controls */}
      <div className={`absolute inset-0 h-full transition-opacity duration-200 ${
        activeTab === "lots" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <LotChips
          statuses={statuses}
          isLoading={isLoading}
          selectedLot={selectedLot}
          onSelect={handleSelectLot}
        />
        <MapControls onRecenter={handleRecenter} />

        <MapContainer
          center={[GGC_CENTER.lat, GGC_CENTER.lng]}
          zoom={GGC_DEFAULT_ZOOM}
          className="h-full w-full z-0"
          zoomControl={false}
          maxBounds={GGC_BOUNDS}
          maxBoundsViscosity={1.0}
          minZoom={15}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {PARKING_LOTS.map((lot) => (
            <LotMarker
              key={lot.id}
              lot={lot}
              status={statuses[lot.id]}
              isSelected={selectedLot?.id === lot.id}
              onClick={handleSelectLot}
            />
          ))}
        </MapContainer>

        <LotDrawer
          lot={selectedLot}
          status={selectedLot ? statuses[selectedLot.id] : undefined}
          onClose={() => setSelectedLot(null)}
        />
      </div>

      {/* Overview tab */}
      <div className={`absolute inset-0 transition-opacity duration-200 ${
        activeTab === "overview" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <OverviewPage statuses={statuses} isLoading={isLoading} />
      </div>

      {/* Info tab */}
      <div className={`absolute inset-0 transition-opacity duration-200 ${
        activeTab === "info" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <InfoPage />
      </div>

      {!drawerOpen && (
        <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
