/** Static definition of a parking lot */
export interface ParkingLot {
  id: string;
  name: string;
  totalSpaces: number;
  lat: number;
  lng: number;
}

/** Real-time status returned by the Spring Boot API */
export interface LotStatus {
  lotId: string;
  carCount: number;
  lastUpdated: string;
  status: string;
}
