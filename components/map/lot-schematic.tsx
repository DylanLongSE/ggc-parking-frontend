import { ParkingSpot, SpotType } from "@/types/parking";

interface LotSchematicProps {
  spots: ParkingSpot[];
}

// TODO: calibrate x/y constants to match lot-w.jpg once provided

const SPOT_W = 43;
const SPOT_H = 16;
const SPOT_STRIDE = 19; // SPOT_H(16) + gap(3)
const SPOT_START_Y = 50;

// Column x positions (calibrated to lot-w.png satellite image)
// Layout: x=9 [A:43] x=52 1px x=53 [lane:37] x=90 1px
//         x=91 [BL:43] x=134 1px x=135 [div:6] x=141 1px
//         x=142 [BR:43] x=185 1px x=186 [lane:37] x=223 1px
//         x=224 [C:43] x=267  lot right wall=270 ✓
const COL_A_X = 9;
const COL_BL_X = 91;
const CENTER_DIVIDER_X = 135;
const COL_BR_X = 142;
const COL_C_X = 224;

const COLUMNS = {
  A: {
    ids: ["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10",
          "A11","A12","A13","A14","A15","A16","A17","A18","A19","A20",
          "A21","A22","A23"],
    x: COL_A_X,
    w: SPOT_W,
  },
  BL: {
    ids: ["BL1","BL2","BL3","BL4","BL5","BL6","BL7","BL8","BL9","BL10",
          "BL11","BL12","BL13","BL14","BL15","BL16","BL17","BL18","BL19","BL20"],
    x: COL_BL_X,
    w: SPOT_W,
  },
  BR: {
    ids: ["BR1","BR2","BR3","BR4","BR5","BR6","BR7","BR8","BR9","BR10",
          "BR11","BR12","BR13","BR14","BR15","BR16","BR17","BR18","BR19","BR20"],
    x: COL_BR_X,
    w: SPOT_W,
  },
  C: {
    ids: ["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10",
          "C11","C12","C13","C14","C15","C16","C17","C18","C19","C20",
          "C21","C22","C23"],
    x: COL_C_X,
    w: SPOT_W,
  },
};

// Drive lane bounds (calibrated to lot-w.png satellite image)
const LANE_A_X = 53;   // between Col A and Col BL
const LANE_B_X = 186;  // between Col BR and Col C
const LANE_W = 37;

// Lot boundary
const LOT_X = 8;
const LOT_Y = 38;
const LOT_W = 262;
const LOT_H = 23 * SPOT_STRIDE + 8; // fits 23 rows + padding
const ENTRANCE_GAP_X1 = 121;
const ENTRANCE_GAP_X2 = 155;

const TYPE_FILL: Record<SpotType, { free: string; occupied: string }> = {
  standard: { free: "#22c55e", occupied: "#ef4444" },
  visitor:  { free: "#3b82f6", occupied: "#1e3a8a" },
  staff:    { free: "#8b5cf6", occupied: "#4c1d95" },
  handicap: { free: "#38bdf8", occupied: "#075985" },
  "access aisle": { free: "#fbbf24", occupied: "#fbbf24" },
  reserved:       { free: "#64748b", occupied: "#64748b" },
};

function spotFill(spot: ParkingSpot | undefined): string {
  if (!spot) return "#94a3b8"; // slate-400 unknown
  const colors = TYPE_FILL[spot.type];
  return spot.occupied ? colors.occupied : colors.free;
}

function spotAriaLabel(id: string, spot: ParkingSpot | undefined): string {
  if (!spot) return `Spot ${id} unknown`;
  if (spot.type === "access aisle") return `Spot ${id} access aisle`;
  return `Spot ${id} ${spot.type} ${spot.occupied ? "occupied" : "free"}`;
}

function spotIcon(id: string, type: SpotType): string {
  if (type === "handicap") return "♿";
  if (type === "access aisle") return "⊘";
  if (type === "reserved") return "⊘";
  return id;
}

/**
 * SVG overhead map of Lot W showing spot positions color-coded by availability.
 * Green = free, Red = occupied, Blue = handicap accessible.
 * Wraps in a div that shows a satellite photo (public/lot-w.jpg) as background.
 */
export function LotSchematic({ spots }: LotSchematicProps) {
  const spotMap = new Map(spots.map((s) => [s.id, s]));

  return (
    <div className="px-4 pt-4 pb-2">
      {/* bg-muted fallback when lot-w.jpg is absent (dev/CI) */}
      <div
        className="relative rounded-lg overflow-hidden bg-muted"
        style={{
          backgroundImage: "url('/lot-w.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <svg
          viewBox={`0 0 280 ${LOT_Y + LOT_H + 12}`}
          width="100%"
          height="auto"
          aria-label="Lot W overhead map"
        >
          {/* Entrance label and arrow */}
          <text
            x="140"
            y="12"
            textAnchor="middle"
            fontSize="9"
            fill="#64748b"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            ENTRANCE
          </text>
          <text x="140" y="28" textAnchor="middle" fontSize="13" fill="#64748b">
            ▼
          </text>

          {/* Lot boundary with entrance gap at top-center */}
          <path
            d={`M ${ENTRANCE_GAP_X1},${LOT_Y} L ${LOT_X},${LOT_Y} L ${LOT_X},${LOT_Y + LOT_H} L ${LOT_X + LOT_W},${LOT_Y + LOT_H} L ${LOT_X + LOT_W},${LOT_Y} L ${ENTRANCE_GAP_X2},${LOT_Y}`}
            fill="none"
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {/* Drive lanes — subtle when satellite image is present */}
          <rect x={LANE_A_X} y={LOT_Y} width={LANE_W} height={LOT_H} fill="rgba(0,0,0,0.15)" />
          <rect x={LANE_B_X} y={LOT_Y} width={LANE_W} height={LOT_H} fill="rgba(0,0,0,0.15)" />

          {/* Center divider between BL and BR backs */}
          <rect
            x={CENTER_DIVIDER_X}
            y={LOT_Y}
            width={6}
            height={LOT_H}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1"
          />

          {/* Spots */}
          {(Object.keys(COLUMNS) as (keyof typeof COLUMNS)[]).map((colKey) => {
            const col = COLUMNS[colKey];
            return col.ids.map((id, rowIndex) => {
              const spot = spotMap.get(id);
              const x = col.x;
              const y = SPOT_START_Y + rowIndex * SPOT_STRIDE;
              const fill = spotFill(spot);
              const label = spotAriaLabel(id, spot);
              const icon = spotIcon(id, spot?.type ?? "standard");

              return (
                <g key={id} role="img" aria-label={label}>
                  <rect
                    x={x}
                    y={y}
                    width={col.w}
                    height={SPOT_H}
                    fill={fill}
                    fillOpacity="0.85"
                    rx="2"
                  />
                  <text
                    x={x + col.w / 2}
                    y={y + SPOT_H / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="8"
                    fill="white"
                    fontFamily="monospace"
                    aria-hidden="true"
                  >
                    {icon}
                  </text>
                </g>
              );
            });
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-green-500" /> Free
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-red-500" /> Occupied
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-blue-500" /> Visitor
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-violet-500" /> Staff
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-sky-400" /> ♿ Accessible
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-amber-400" /> ⊘ Access Aisle
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-slate-500" /> ⊘ Reserved
        </span>
      </div>
    </div>
  );
}
