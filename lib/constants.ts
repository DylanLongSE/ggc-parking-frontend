import { ParkingLot } from "@/types/parking";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const PARKING_LOTS: ParkingLot[] = [
  {
    id: "lot-w",
    slug: "lot-w",
    name: "Parking Lot W",
    totalSpaces: 500,
  },
];
