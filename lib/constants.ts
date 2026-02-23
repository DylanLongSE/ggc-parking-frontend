import { ParkingLot } from "@/types/parking";

/** Base URL for the Spring Boot parking API. Reads from `NEXT_PUBLIC_API_URL` env var. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/**
 * Availability thresholds expressed as free-space ratios (0–1).
 * - `HIGH`: above this ratio → "Available"
 * - `LOW`: below this ratio → "Almost Full"
 */
export const AVAILABILITY_THRESHOLDS = { HIGH: 0.5, LOW: 0.2 } as const;

/** Geographic center of GGC campus used to initialize the map. */
export const GGC_CENTER = { lat: 33.9804, lng: -84.0031 } as const;

/** Default Leaflet zoom level for the campus map. */
export const GGC_DEFAULT_ZOOM = 16;

/**
 * Map panning bounds that restrict the view to the GGC campus area.
 * Formatted as `[[swLat, swLng], [neLat, neLng]]`.
 */
export const GGC_BOUNDS: [[number, number], [number, number]] = [
  [33.971, -84.014], // southwest corner
  [33.989, -83.993], // northeast corner
];

/**
 * Set of lot IDs that have a live backend and real-time data.
 * All other lots are considered "coming soon" and will not be fetched.
 */
export const LIVE_LOT_IDS = new Set(["lot-w"]);

/** Static registry of all GGC parking lots with their capacity and coordinates. */
export const PARKING_LOTS: ParkingLot[] = [
  {
    id: "lot-w",
    name: "Parking Lot W",
    totalSpaces: 500,
    lat: 33.97961,
    lng: -84.00747,
  },
  {
    id: "parking-deck",
    name: "Parking Deck",
    totalSpaces: 800,
    lat: 33.981374,
    lng: -84.000075,
  },
  {
    id: "lot-a",
    name: "A Lot",
    totalSpaces: 400,
    lat: 33.979519,
    lng: -84.002343,
  },
  {
    id: "lot-l",
    name: "L Lot",
    totalSpaces: 350,
    lat: 33.978571,
    lng: -84.003170,
  },
  {
    id: "lot-3000",
    name: "3000 Lot",
    totalSpaces: 300,
    lat: 33.978366,
    lng: -84.011187,
  },
];
