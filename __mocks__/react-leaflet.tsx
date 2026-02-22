import React from "react";

export const MapContainer = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
  [key: string]: unknown;
}) => (
  <div data-testid="map-container" {...props}>
    {children}
  </div>
);

export const TileLayer = (props: { [key: string]: unknown }) => (
  <div data-testid="tile-layer" {...props} />
);

export const Marker = ({
  children,
  eventHandlers,
  ...props
}: {
  children?: React.ReactNode;
  eventHandlers?: { click?: () => void };
  [key: string]: unknown;
}) => (
  <div data-testid="marker" onClick={eventHandlers?.click} {...props}>
    {children}
  </div>
);

export const Popup = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
  [key: string]: unknown;
}) => (
  <div data-testid="popup" {...props}>
    {children}
  </div>
);

export const useMap = () => ({
  flyTo: jest.fn(),
  setView: jest.fn(),
  invalidateSize: jest.fn(),
});

export const useMapEvents = () => null;
