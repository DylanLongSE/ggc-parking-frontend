"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { ParkingLot } from "@/types/parking";
import { GGC_CENTER, GGC_DEFAULT_ZOOM, GGC_BOUNDS, PARKING_LOTS, LOT_DETAIL_ZOOM, FLY_TO_DURATION_S, FLY_TO_DURATION_MS, LIVE_LOT_IDS } from "@/lib/constants";
import { useLotStatuses } from "@/hooks/use-lot-statuses";
import { useLotSpots } from "@/hooks/use-lot-spots";
import { LotMarker } from "./lot-marker";
import { LotChips } from "./lot-chips";
import { MapControls } from "./map-controls";
import { LotDrawer } from "./lot-drawer";
import { SpotView } from "./spot-view";
import { BottomTabs, type TabId } from "../bottom-tabs";
import { OverviewPage } from "../overview-page";
import { InfoPage } from "../info-page";
import { SettingsPage } from "../settings-page";

export default function ParkingMap() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const selectedLotRef = useRef<ParkingLot | null>(null);
  const [spotViewVisible, setSpotViewVisible] = useState(false);
  const zoomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("lots");
  const { statuses, isLoading } = useLotStatuses();
  const { spots, isLoading: spotsLoading } = useLotSpots(selectedLot?.id ?? null);

  const handleSelectLot = useCallback((lot: ParkingLot) => {
    if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    setSpotViewVisible(false);
    mapRef.current?.stop();

    const isDeselect = selectedLotRef.current?.id === lot.id;

    if (isDeselect) {
      mapRef.current?.flyTo([GGC_CENTER.lat, GGC_CENTER.lng], GGC_DEFAULT_ZOOM, { duration: FLY_TO_DURATION_S });
      selectedLotRef.current = null;
      setSelectedLot(null);
    } else {
      mapRef.current?.flyTo([lot.lat, lot.lng], LOT_DETAIL_ZOOM, { duration: FLY_TO_DURATION_S });
      if (lot.id === "lot-w") {
        zoomTimerRef.current = setTimeout(() => setSpotViewVisible(true), FLY_TO_DURATION_MS);
      }
      selectedLotRef.current = lot;
      setSelectedLot(lot);
    }
  }, []);

  // Clean up timer on unmount
  useEffect(() => () => {
    if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
  }, []);

  const handleRecenter = useCallback(() => {
    mapRef.current?.stop();
    mapRef.current?.flyTo(
      [GGC_CENTER.lat, GGC_CENTER.lng],
      GGC_DEFAULT_ZOOM,
      { duration: FLY_TO_DURATION_S }
    );
  }, []);

  const handleDrawerClose = useCallback(() => {
    if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    setSpotViewVisible(false);
    selectedLotRef.current = null;
    setSelectedLot(null);
  }, []);

  const drawerOpen = !!selectedLot;

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Lots tab — map + chips + controls */}
      <div className={`absolute inset-0 h-full transition-opacity duration-200 ${
        activeTab === "lots" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        {/* Map layer — fades out when spot view is active */}
        <div className={`absolute inset-0 transition-opacity duration-200 ${
          spotViewVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          <LotChips
            statuses={statuses}
            isLoading={isLoading}
            selectedLot={selectedLot}
            onSelect={handleSelectLot}
          />
          <MapControls onRecenter={handleRecenter} />
        </div>

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

        {/* Spot view layer — scales + fades in over the map for Lot W, after zoom completes */}
        <div className={`absolute inset-0 transition-all duration-300 ${
          spotViewVisible
            ? "opacity-100 pointer-events-auto scale-100"
            : "opacity-0 pointer-events-none scale-95"
        }`}>
          {selectedLot && spotViewVisible && (
            <SpotView
              lot={selectedLot}
              spots={spots}
              isLoading={spotsLoading}
              onClose={() => {
                setSpotViewVisible(false);
                setSelectedLot(null);
              }}
            />
          )}
        </div>

        <LotDrawer
          lot={LIVE_LOT_IDS.has(selectedLot?.id ?? "") ? null : selectedLot}
          status={selectedLot ? statuses[selectedLot.id] : undefined}
          onClose={handleDrawerClose}
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

      {/* Settings tab */}
      <div className={`absolute inset-0 transition-opacity duration-200 ${
        activeTab === "settings" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <SettingsPage />
      </div>

      {!drawerOpen && (
        <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
