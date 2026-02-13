/** Static definition of a parking lot */
export interface ParkingLot {
  id: string;
  slug: string;
  name: string;
  totalSpaces: number;
}

/** Real-time status returned by the Spring Boot API */
export interface LotStatus {
  lotId: string;
  occupiedSpaces: number;
  lastUpdated: string;
}
