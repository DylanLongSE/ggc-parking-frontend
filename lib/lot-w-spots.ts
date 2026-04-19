import { ParkingSpot, SpotType } from "@/types/parking";
import { piToFrontendId, monitoredSpotIds } from "@/lib/spot-id-map";

/**
 * Returns the real physical layout of Lot W as {@link ParkingSpot} objects.
 *
 * This represents the actual arrangement of spots in Lot W — 86 total:
 *   - Col A  (A1–A23):  3 reserved, 8 handicap, 5 access aisle, 7 staff  (closest to entrance)
 *   - Col B  (B1–B20):  20 staff  (right face of center island)
 *   - Col C  (C1–C20):  20 staff  (left face of center island)
 *   - Col D  (D1–D23):  10 visitor, 13 staff  (farthest from entrance)
 *
 * @param occupiedPiIds - Pi integer IDs of currently occupied spots
 */
export function getLotWSpots(occupiedPiIds: number[] = []): ParkingSpot[] {
  // Build a set of frontend IDs that are currently occupied
  const occupiedFrontendIds = new Set<string>();
  for (const piId of occupiedPiIds) {
    const frontendId = piToFrontendId.get(piId);
    if (frontendId) occupiedFrontendIds.add(frontendId);
  }

  // [id, type?] — type defaults to "standard" if omitted
  const layout: [string, SpotType?][] = [
    // Col A — A1–A16 reserved/handicap/access aisle, A17–A23 staff (23 spots, closest to entrance)
    ["A1","reserved"],
    ["A2","reserved"],
    ["A3","reserved"],
    ["A4","handicap"],
    ["A5","handicap"],
    ["A6","access aisle"],
    ["A7","handicap"],
    ["A8","access aisle"],
    ["A9","handicap"],
    ["A10","access aisle"],
    ["A11","handicap"],
    ["A12","access aisle"],
    ["A13","handicap"],
    ["A14","access aisle"],
    ["A15","handicap"],
    ["A16","handicap"],
    ["A17","staff"],
    ["A18","staff"],
    ["A19","staff"],
    ["A20","staff"],
    ["A21","staff"],
    ["A22","staff"],
    ["A23","staff"],

    // Col B — right face of center island (20 spots)
    ["B1","staff"],
    ["B2","staff"],
    ["B3","staff"],
    ["B4","staff"],
    ["B5","staff"],
    ["B6","staff"],
    ["B7","staff"],
    ["B8","staff"],
    ["B9","staff"],
    ["B10","staff"],
    ["B11","staff"],
    ["B12","staff"],
    ["B13","staff"],
    ["B14","staff"],
    ["B15","staff"],
    ["B16","staff"],
    ["B17","staff"],
    ["B18","staff"],
    ["B19","staff"],
    ["B20","staff"],

    // Col C — left face of center island (20 spots)
    ["C1","staff"],
    ["C2","staff"],
    ["C3","staff"],
    ["C4","staff"],
    ["C5","staff"],
    ["C6","staff"],
    ["C7","staff"],
    ["C8","staff"],
    ["C9","staff"],
    ["C10","staff"],
    ["C11","staff"],
    ["C12","staff"],
    ["C13","staff"],
    ["C14","staff"],
    ["C15","staff"],
    ["C16","staff"],
    ["C17","staff"],
    ["C18","staff"],
    ["C19","staff"],
    ["C20","staff"],

    // Col D — 10 visitor, 13 staff (23 spots, farthest from entrance)
    ["D1","visitor"],
    ["D2","visitor"],
    ["D3","visitor"],
    ["D4","visitor"],
    ["D5","visitor"],
    ["D6","visitor"],
    ["D7","visitor"],
    ["D8","visitor"],
    ["D9","visitor"],
    ["D10","visitor"],
    ["D11","staff"],
    ["D12","staff"],
    ["D13","staff"],
    ["D14","staff"],
    ["D15","staff"],
    ["D16","staff"],
    ["D17","staff"],
    ["D18","staff"],
    ["D19","staff"],
    ["D20","staff"],
    ["D21","staff"],
    ["D22","staff"],
    ["D23","staff"],
  ];

  return layout.map(([id, type]) => ({
    id,
    occupied: occupiedFrontendIds.has(id),
    type: type ?? ("standard" as SpotType),
    monitored: monitoredSpotIds.has(id),
  }));
}
