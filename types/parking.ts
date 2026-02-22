/** Static definition of a parking lot */
export interface ParkingLot {
  /** Unique identifier (e.g. `"lot-w"`) */
  id: string;
  /** Human-readable lot name */
  name: string;
  /** Total capacity in spaces */
  totalSpaces: number;
  /** Latitude coordinate */
  lat: number;
  /** Longitude coordinate */
  lng: number;
}

/** Real-time status returned by the Spring Boot API */
export interface LotStatus {
  /** Matches {@link ParkingLot.id} */
  lotId: string;
  /** Number of vehicles currently occupying the lot */
  carCount: number;
  /** ISO 8601 timestamp of the last sensor update */
  lastUpdated: string;
  /** API health indicator — `"OK"` when nominal */
  status: string;
}

/** Hourly occupancy trend data point */
export interface HourlyTrend {
  /** Hour of day in 24-hour format (6–21) */
  hour: number;
  /** Average occupancy ratio from 0 to 1 */
  avgOccupancy: number;
}