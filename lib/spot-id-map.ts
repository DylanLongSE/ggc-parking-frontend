/**
 * Maps Pi integer spot IDs (from YOLO detection) to frontend string spot IDs.
 *
 * The camera sees 35 of 86 total spots in Lot W, grouped into 4 rows:
 *   Pi 0-3   → A1-A4   (bottom of camera, closest row)
 *   Pi 4-12  → B1-B9   (mid-low)
 *   Pi 13-22 → C1-C10  (mid-high)
 *   Pi 23-34 → D1-D12  (top of camera, farthest row)
 *
 * Within each row, IDs increment right-to-left in the camera view,
 * mapping to spot 1 → N (top of each column in the schematic).
 */

const PI_TO_FRONTEND: [number, string][] = [
  // Col A (Pi bottom row — 4 spots, closest to camera)
  [0, "A1"],
  [1, "A2"],
  [2, "A3"],
  [3, "A4"],

  // Col B (Pi mid-low row — 9 spots)
  [4, "B1"],
  [5, "B2"],
  [6, "B3"],
  [7, "B4"],
  [8, "B5"],
  [9, "B6"],
  [10, "B7"],
  [11, "B8"],
  [12, "B9"],

  // Col C (Pi mid-high row — 10 spots)
  [13, "C1"],
  [14, "C2"],
  [15, "C3"],
  [16, "C4"],
  [17, "C5"],
  [18, "C6"],
  [19, "C7"],
  [20, "C8"],
  [21, "C9"],
  [22, "C10"],

  // Col D (Pi top row — 12 spots, farthest from camera)
  [23, "D1"],
  [24, "D2"],
  [25, "D3"],
  [26, "D4"],
  [27, "D5"],
  [28, "D6"],
  [29, "D7"],
  [30, "D8"],
  [31, "D9"],
  [32, "D10"],
  [33, "D11"],
  [34, "D12"],
];

/** Pi integer ID → frontend string ID */
export const piToFrontendId = new Map<number, string>(PI_TO_FRONTEND);

/** Set of all frontend spot IDs that the camera monitors */
export const monitoredSpotIds = new Set<string>(
  PI_TO_FRONTEND.map(([, frontendId]) => frontendId),
);
