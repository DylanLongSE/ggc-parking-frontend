import { ParkingLot } from "@/types/parking";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const GGC_CENTER = { lat: 33.9804, lng: -84.0031 } as const;
export const GGC_DEFAULT_ZOOM = 16;

export const GGC_BOUNDS: [[number, number], [number, number]] = [
  [33.971, -84.014], // southwest corner
  [33.989, -83.993], // northeast corner
];

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
