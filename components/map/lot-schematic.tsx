import { ParkingSpot, SpotType } from "@/types/parking";

interface LotSchematicProps {
  spots: ParkingSpot[];
  isOffline?: boolean;
}

/* ── Geometry (calibrated to lot-w.png) ─────────────────────────── */

const SPOT_W = 43;
const SPOT_H = 18;
const SPOT_GAP = 1;
const SPOT_STRIDE = SPOT_H + SPOT_GAP;
const SPOT_START_Y = 52;

const COL_D_X = 9;   // farthest from entrance (was A)
const COL_C_X = 91;  // mid-far (was BL)
const CENTER_DIVIDER_X = 135;
const COL_B_X = 142; // mid-near (was BR)
const COL_A_X = 224; // closest to entrance (was C)

// Column layout — near→far = A B C D
const COLUMNS = {
  D: {
    ids: [
      "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10",
      "D11","D12","D13","D14","D15","D16","D17","D18","D19","D20",
      "D21","D22","D23",
    ],
    x: COL_D_X,
    openSide: "right" as const,
  },
  C: {
    ids: [
      "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10",
      "C11","C12","C13","C14","C15","C16","C17","C18","C19","C20",
    ],
    x: COL_C_X,
    openSide: "left" as const,
  },
  B: {
    ids: [
      "B1","B2","B3","B4","B5","B6","B7","B8","B9","B10",
      "B11","B12","B13","B14","B15","B16","B17","B18","B19","B20",
    ],
    x: COL_B_X,
    openSide: "right" as const,
  },
  A: {
    ids: [
      "A1","A2","A3","A4","A5","A6","A7","A8","A9","A10",
      "A11","A12","A13","A14","A15","A16","A17","A18","A19","A20",
      "A21","A22","A23",
    ],
    x: COL_A_X,
    openSide: "left" as const,
  },
};

/* ── Drive lanes ────────────────────────────────────────────────── */
const LANE_A_X = 53;
const LANE_B_X = 186;
const LANE_W = 37;

/* ── Lot boundary ───────────────────────────────────────────────── */
const LOT_X = 8;
const LOT_Y = 40;
const LOT_W = 262;
const LOT_H = 23 * SPOT_STRIDE + 10;
const ENTRANCE_GAP_X1 = 121;
const ENTRANCE_GAP_X2 = 155;

/* ── Open area below center island ──────────────────────────────── */
const ISLAND_END_Y = SPOT_START_Y + 20 * SPOT_STRIDE + 2;

/* ── Color palette ──────────────────────────────────────────────── */

const ASPHALT = "#e2e5ea";
const ASPHALT_LANE = "#d5d9e0";
const LANE_DASH = "#b0b7c3";
const LINE_COLOR = "#ffffff";
const CURB_COLOR = "#8892a0";

const MONITORED_FREE_FILL = "#ace6c2"; // light green — available monitored spots
const MONITORED_OCC_FILL  = "#fca5a5"; // light red — occupied monitored spots
const UNMONITORED_FILL = "#d1d5db"; // gray-300

const FONT = "var(--font-sans), Montserrat, system-ui, sans-serif";

function typeCode(type: SpotType): string | null {
  switch (type) {
    case "visitor": return "VIS";
    case "staff":   return "STF";
    case "standard": return "STU";
    default: return null;
  }
}

function spotFill(spot: ParkingSpot | undefined, isOffline: boolean): string {
  if (!spot) return "#cbd5e1";
  if (!spot.monitored) return UNMONITORED_FILL;
  if (isOffline) return "transparent";
  return spot.occupied ? MONITORED_OCC_FILL : MONITORED_FREE_FILL;
}

function spotAriaLabel(id: string, spot: ParkingSpot | undefined, isOffline: boolean): string {
  if (!spot) return `Spot ${id} unknown`;
  if (spot.type === "access aisle") return `Spot ${id} access aisle`;
  if (!spot.monitored) return `Spot ${id} ${spot.type} not monitored`;
  if (isOffline) return `Spot ${id} ${spot.type} offline`;
  return `Spot ${id} ${spot.type} ${spot.occupied ? "occupied" : "free"}`;
}

/* ── Painted-line parking bay ────────────────────────────────────── */

function ParkingBay({
  x, y, w, h, fill, openSide, label, typeLabel,
  isAccessAisle, isHandicap, isReserved,
  occupied, monitored, isOffline, ariaLabel,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  openSide: "left" | "right";
  label: string;
  typeLabel: string | null;
  isAccessAisle: boolean;
  isHandicap: boolean;
  isReserved: boolean;
  occupied: boolean;
  monitored: boolean;
  isOffline: boolean;
  ariaLabel: string;
}) {
  const lineW = 1.2;
  const closedX = openSide === "right" ? x : x + w;
  const openX   = openSide === "right" ? x + w : x;
  const borderPath = `M ${openX},${y} L ${closedX},${y} L ${closedX},${y + h} L ${openX},${y + h}`;

  // Outline color logic
  const outlineColor = !monitored
    ? "#9ca3af"                           // gray-400 — unmonitored always
    : isOffline
      ? "#9ca3af"                         // gray-400 — offline: neutral gray
      : occupied ? "#ef4444" : "#10b981"; // red-500 / emerald-500 when live

  const outlineDash = !monitored ? "2 2" : undefined;
  const outlineWidth = monitored ? 1.5 : 0.8;

  return (
    <g role="img" aria-label={ariaLabel}>
      {/* Fill */}
      {isAccessAisle ? (
        <rect x={x} y={y} width={w} height={h} fill="url(#aisle-hatch-v2)" />
      ) : (
        <rect x={x} y={y} width={w} height={h} fill={fill} />
      )}

      {/* Painted lines (3 sides) */}
      <path
        d={borderPath}
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth={lineW}
        strokeLinejoin="round"
      />

      {/* Status outline */}
      {!isAccessAisle && (
        <rect
          x={x + 1}
          y={y + 1}
          width={w - 2}
          height={h - 2}
          fill="none"
          stroke={outlineColor}
          strokeWidth={outlineWidth}
          strokeDasharray={outlineDash}
          rx="1"
        />
      )}

      {/* Handicap wheelchair icon */}
      {isHandicap && (
        <svg
          x={x + w / 2 - 5} y={y + h / 2 - 5}
          width={10} height={10}
          viewBox="0 0 24 24"
          fill="#0e7490"
          aria-hidden={true}
        >
          <circle cx="9" cy="4" r="2" />
          <path d="M16.98 14.804A1 1 0 0 0 16 14h-4.133l-.429-3H16V9h-4.847l-.163-1.142A1 1 0 0 0 10 7H9a1.003 1.003 0 0 0-.99 1.142l.877 6.142A2.009 2.009 0 0 0 10.867 16h4.313l.839 4.196c.094.467.504.804.981.804h3v-2h-2.181l-.839-4.196z" />
          <path d="M12.51 17.5c-.739 1.476-2.25 2.5-4.01 2.5A4.505 4.505 0 0 1 4 15.5a4.503 4.503 0 0 1 2.817-4.167l-.289-2.025C3.905 10.145 2 12.604 2 15.5 2 19.084 4.916 22 8.5 22a6.497 6.497 0 0 0 5.545-3.126l-.274-1.374H12.51z" />
        </svg>
      )}

      {/* Reserved — no-parking icon */}
      {isReserved && (
        <svg
          x={x + w / 2 - 6} y={y + h / 2 - 6}
          width={12} height={12}
          viewBox="0 0 16 16"
          fill="#475569"
          aria-hidden={true}
        >
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m5.29-3.416L9.63 8.923C10.5 8.523 11 7.66 11 6.586c0-1.482-.955-2.584-2.538-2.584H5.5v.79L3.416 2.71a7 7 0 0 1 9.874 9.874m-.706.707A7 7 0 0 1 2.71 3.417l2.79 2.79V12h1.283V9.164h1.674zM8.726 8.019 6.777 6.07v-.966H8.27c.893 0 1.419.539 1.419 1.482 0 .769-.35 1.273-.963 1.433m-1.949-.534.59.59h-.59z" />
        </svg>
      )}

      {/* Two-line label: type code + spot ID (non-icon spots only) */}
      {!isHandicap && !isAccessAisle && !isReserved && (
        <>
          {typeLabel && (
            <text
              x={x + w / 2}
              y={y + h / 2 - 2.5}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="5.5"
              fill={fill === "transparent" ? "#6b7280" : "#1e3a5f"}
              fontFamily={FONT}
              fontWeight="700"
              aria-hidden="true"
            >
              {typeLabel}
            </text>
          )}
          <text
            x={x + w / 2}
            y={y + h / 2 + (typeLabel ? 4 : 0)}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="5"
            fill={fill === "transparent" ? "#9ca3af" : "#374151"}
            fontFamily={FONT}
            fontWeight="500"
            opacity="0.75"
            aria-hidden="true"
          >
            {label}
          </text>
        </>
      )}
    </g>
  );
}

/* ── Dashed center line for driving lanes ────────────────────────── */

function LaneDashes({ laneX, laneW, startY, height }: { laneX: number; laneW: number; startY: number; height: number }) {
  const cx = laneX + laneW / 2;
  return (
    <line x1={cx} y1={startY + 4} x2={cx} y2={startY + height - 4}
      stroke={LANE_DASH} strokeWidth="1.5" strokeDasharray="6 4" />
  );
}

/* ── Road arrow ──────────────────────────────────────────────────── */

const FA_ARROW_PATH = "M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z";

function RoadArrow({ x, y, direction, size = 10 }: { x: number; y: number; direction: "down" | "up" | "left" | "right"; size?: number }) {
  const rotation = { left: 0, down: -90, right: 180, up: 90 }[direction];
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 448 512" aria-hidden="true">
      <path d={FA_ARROW_PATH} fill={LANE_DASH} transform={`rotate(${rotation}, 224, 256)`} />
    </svg>
  );
}

function LaneArrows({ laneX, laneW, startY, height }: { laneX: number; laneW: number; startY: number; height: number }) {
  const arrowSize = 10;
  const leftX  = laneX + laneW / 4 - arrowSize / 2;
  const rightX = laneX + 3 * laneW / 4 - arrowSize / 2;
  const spacing = 55;
  const count = Math.floor((height - 30) / spacing);
  const positions: number[] = [];
  for (let i = 0; i < count; i++) positions.push(startY + 20 + i * spacing);
  return (
    <g aria-hidden="true">
      {positions.map((py, i) => (
        <g key={i}>
          <RoadArrow x={leftX}  y={py} direction="down" />
          <RoadArrow x={rightX} y={py} direction="up" />
        </g>
      ))}
    </g>
  );
}

/* ── Legend helpers ──────────────────────────────────────────────── */

function CodeBubble({ code }: { code: string }) {
  return (
    <span
      className="inline-block rounded px-1 py-0.5 text-[9px] font-bold leading-none"
      style={{ background: "#e5e7eb", color: "#374151", fontFamily: "monospace" }}
    >
      {code}
    </span>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

export function LotSchematic({ spots, isOffline = false }: LotSchematicProps) {
  const spotMap = new Map(spots.map((s) => [s.id, s]));
  const svgH = LOT_Y + LOT_H + 14;

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Legend — top */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-3 text-[11px] text-gray-600">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm border-2"
            style={{ background: MONITORED_FREE_FILL, borderColor: "#10b981" }}
          />
          Free
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm border-2"
            style={{ background: MONITORED_OCC_FILL, borderColor: "#ef4444" }}
          />
          Occupied
        </span>
        <span className="flex items-center gap-1.5">
          <CodeBubble code="VIS" /> Visitor
        </span>
        <span className="flex items-center gap-1.5">
          <CodeBubble code="STF" /> Staff
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm border border-dashed border-gray-400"
            style={{ background: UNMONITORED_FILL }}
          />
          Not Monitored
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm border border-gray-400"
            style={{
              background: "repeating-linear-gradient(45deg, #e2e8f0 0px, #e2e8f0 2px, #94a3b8 2px, #94a3b8 4px)",
            }}
          />
          Access Aisle
        </span>
      </div>

      <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
        <svg
          viewBox={`0 0 280 ${svgH}`}
          width="100%"
          height="auto"
          aria-label="Lot W overhead map"
        >
          <defs>
            <pattern
              id="aisle-hatch-v2"
              patternUnits="userSpaceOnUse"
              width="6" height="6"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill="#e2e8f0" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* Asphalt surface */}
          <rect x={LOT_X} y={LOT_Y} width={LOT_W} height={LOT_H} fill={ASPHALT} />

          {/* Left vertical lane */}
          <rect x={LANE_A_X} y={LOT_Y} width={LANE_W} height={LOT_H} fill={ASPHALT_LANE} />
          {/* Right vertical lane */}
          <rect x={LANE_B_X} y={LOT_Y} width={LANE_W} height={LOT_H} fill={ASPHALT_LANE} />

          {/* Open area below center island */}
          <rect
            x={LANE_A_X} y={ISLAND_END_Y}
            width={LANE_B_X + LANE_W - LANE_A_X}
            height={LOT_Y + LOT_H - ISLAND_END_Y}
            fill={ASPHALT_LANE}
          />

          {/* Lane dashes */}
          <LaneDashes laneX={LANE_A_X} laneW={LANE_W} startY={LOT_Y} height={ISLAND_END_Y - LOT_Y} />
          <LaneDashes laneX={LANE_B_X} laneW={LANE_W} startY={LOT_Y} height={ISLAND_END_Y - LOT_Y} />

          {/* U-turn guide */}
          <path
            d={`M ${LANE_A_X + LANE_W / 2},${ISLAND_END_Y} L ${LANE_A_X + LANE_W / 2},${LOT_Y + LOT_H - 25} Q ${LANE_A_X + LANE_W / 2},${LOT_Y + LOT_H - 18} ${(LANE_A_X + LANE_B_X + LANE_W) / 2},${LOT_Y + LOT_H - 18} Q ${LANE_B_X + LANE_W / 2},${LOT_Y + LOT_H - 18} ${LANE_B_X + LANE_W / 2},${LOT_Y + LOT_H - 25} L ${LANE_B_X + LANE_W / 2},${ISLAND_END_Y}`}
            fill="none" stroke={LANE_DASH} strokeWidth="1.5" strokeDasharray="6 4"
          />

          {/* Lane arrows */}
          <LaneArrows laneX={LANE_A_X} laneW={LANE_W} startY={LOT_Y} height={ISLAND_END_Y - LOT_Y} />
          <LaneArrows laneX={LANE_B_X} laneW={LANE_W} startY={LOT_Y} height={ISLAND_END_Y - LOT_Y} />

          {/* U-turn flow arrows */}
          <g aria-hidden="true">
            <RoadArrow x={LANE_A_X + LANE_W / 4 - 5}     y={ISLAND_END_Y + 10} direction="down" />
            <RoadArrow x={LANE_A_X + 3 * LANE_W / 4 - 5} y={ISLAND_END_Y + 10} direction="up" />
            <RoadArrow x={LANE_B_X + LANE_W / 4 - 5}     y={ISLAND_END_Y + 10} direction="down" />
            <RoadArrow x={LANE_B_X + 3 * LANE_W / 4 - 5} y={ISLAND_END_Y + 10} direction="up" />
            <RoadArrow x={(LANE_A_X + LANE_B_X + LANE_W) / 2 - 5} y={LOT_Y + LOT_H - 30} direction="right" />
            <RoadArrow x={(LANE_A_X + LANE_B_X + LANE_W) / 2 - 5} y={LOT_Y + LOT_H - 17} direction="left" />
          </g>

          {/* Center island */}
          <rect
            x={CENTER_DIVIDER_X} y={SPOT_START_Y - 2}
            width={COL_B_X - CENTER_DIVIDER_X}
            height={20 * SPOT_STRIDE + 4}
            fill="#bcc2cc" rx="2"
          />

          {/* Entrance label */}
          <text
            x={138} y={14}
            textAnchor="middle"
            fontSize="8" fill="#6b7280"
            fontFamily={FONT}
            fontWeight="600" letterSpacing="1.5"
          >
            ENTRANCE
          </text>
          <polygon points="138,20 134,26 142,26" fill="#6b7280" />

          {/* Lot boundary */}
          <path
            d={`M ${ENTRANCE_GAP_X1},${LOT_Y} L ${LOT_X},${LOT_Y} L ${LOT_X},${LOT_Y + LOT_H} L ${LOT_X + LOT_W},${LOT_Y + LOT_H} L ${LOT_X + LOT_W},${LOT_Y} L ${ENTRANCE_GAP_X2},${LOT_Y}`}
            fill="none" stroke={CURB_COLOR} strokeWidth="2" strokeLinejoin="round"
          />

          {/* Spots */}
          {(Object.keys(COLUMNS) as (keyof typeof COLUMNS)[]).map((colKey) => {
            const col = COLUMNS[colKey];
            return col.ids.map((id, rowIndex) => {
              const spot = spotMap.get(id);
              const x = col.x;
              const y = SPOT_START_Y + rowIndex * SPOT_STRIDE;
              const fill = spotFill(spot, isOffline);
              const isAccessAisle = spot?.type === "access aisle";
              const isHandicap    = spot?.type === "handicap";
              const isReserved    = spot?.type === "reserved";
              const tLabel        = spot ? typeCode(spot.type) : null;

              return (
                <ParkingBay
                  key={id}
                  x={x} y={y} w={SPOT_W} h={SPOT_H}
                  fill={fill}
                  openSide={col.openSide}
                  label={id}
                  typeLabel={tLabel}
                  isAccessAisle={isAccessAisle}
                  isHandicap={isHandicap}
                  isReserved={isReserved}
                  occupied={spot?.occupied ?? false}
                  monitored={spot?.monitored ?? false}
                  isOffline={isOffline}
                  ariaLabel={spotAriaLabel(id, spot, isOffline)}
                />
              );
            });
          })}
        </svg>
      </div>
    </div>
  );
}
