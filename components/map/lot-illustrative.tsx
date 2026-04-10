import { ParkingSpot, SpotType } from "@/types/parking";

/* ═══ Layout constants (SVG user-units inside the viewBox) ═══════ */

const VB_W = 386;
const VB_H = 700;

const SW = 54; // spot width
const SH = 22; // spot height
const SS = 26; // spot stride (SH + 4 gap)

// X positions (left → right)
const WL = 8;   // left wall
const AX = 14;  // col A
const LLX = 70; // left lane start
const BLX = 134; // col BL
const DX = 190;  // center divider
const BRX = 198; // col BR
const LRX = 254; // right lane start
const CX = 318;  // col C
const WR = 378;  // right wall

// Y positions
const WT = 50;  // wall top
const WB = 660; // wall bottom
const ACY = 58; // col A & C spot start
const BBY = 97; // col BL & BR spot start

// Lane center lines
const LLC = (LLX + BLX) / 2; // ~102
const LRC = (LRX + CX) / 2;  // ~286

// Landscaping island X span
const ISX = BLX + 6;
const ISW = BRX + SW - 6 - ISX;

/* ═══ Column definitions ═════════════════════════════════════════ */

type Dir = "left" | "right";

interface Col {
  key: string;
  ids: string[];
  x: number;
  y0: number;
  dir: Dir;
}

function seq(n: number, fn: (i: number) => string): string[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}

const COLS: Col[] = [
  { key: "A", ids: seq(23, i => `A${i + 1}`), x: AX, y0: ACY, dir: "left" },
  { key: "BL", ids: seq(20, i => `BL${i + 1}`), x: BLX, y0: BBY, dir: "right" },
  { key: "BR", ids: seq(20, i => `BR${i + 1}`), x: BRX, y0: BBY, dir: "left" },
  { key: "C", ids: seq(23, i => `C${i + 1}`), x: CX, y0: ACY, dir: "right" },
];

/* ═══ Helpers ════════════════════════════════════════════════════ */

function spotAria(id: string, spot?: ParkingSpot): string {
  if (!spot) return `Spot ${id} unknown`;
  if (spot.type === "access aisle") return `Spot ${id} access aisle`;
  return `Spot ${id} ${spot.type} ${spot.occupied ? "occupied" : "free"}`;
}

/* ═══ Car icon sub-component ════════════════════════════════════ */

function Car({ x, y, dir }: { x: number; y: number; dir: Dir }) {
  const cw = 42;
  const ch = 14;
  const cx = x + SW / 2;
  const cy = y + SH / 2;
  const flip = dir === "left" ? " scale(-1,1)" : "";
  return (
    <use
      href="#car"
      x={-cw / 2}
      y={-ch / 2}
      width={cw}
      height={ch}
      transform={`translate(${cx},${cy})${flip}`}
    />
  );
}

/* ═══ Main component ════════════════════════════════════════════ */

interface LotIllustrativeProps {
  spots: ParkingSpot[];
}

export function LotIllustrative({ spots }: LotIllustrativeProps) {
  const sm = new Map(spots.map(s => [s.id, s]));

  return (
    <div className="px-4 pt-4 pb-2">
      <div
        className="relative rounded-lg overflow-hidden"
        style={{ backgroundColor: "#f5f0e8" }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          height="auto"
          aria-label="Lot W illustrative grid"
        >
          {/* ── Definitions ─────────────────────────────── */}
          <defs>
            {/* Overhead car facing right (44×16 local) */}
            <symbol id="car" viewBox="0 0 44 16">
              <rect
                x="2"
                y="2"
                width="40"
                height="13"
                rx="4"
                fill="#bfbbb3"
                opacity="0.15"
              />
              <rect
                x="1"
                y="1"
                width="40"
                height="13"
                rx="4"
                fill="#eae6de"
                stroke="#b5b1a9"
                strokeWidth="0.6"
              />
              <rect
                x="10"
                y="3.5"
                width="20"
                height="8"
                rx="2"
                fill="#d6d2ca"
                stroke="#b5b1a9"
                strokeWidth="0.4"
              />
              <line
                x1="20"
                y1="3.5"
                x2="20"
                y2="11.5"
                stroke="#b5b1a9"
                strokeWidth="0.6"
              />
            </symbol>

            {/* Wheelchair icon */}
            <symbol id="wc" viewBox="0 0 24 24">
              <circle cx="9" cy="4" r="2" />
              <path d="M16.98 14.804A1 1 0 0 0 16 14h-4.133l-.429-3H16V9h-4.847l-.163-1.142A1 1 0 0 0 10 7H9a1.003 1.003 0 0 0-.99 1.142l.877 6.142A2.009 2.009 0 0 0 10.867 16h4.313l.839 4.196c.094.467.504.804.981.804h3v-2h-2.181l-.839-4.196z" />
              <path d="M12.51 17.5c-.739 1.476-2.25 2.5-4.01 2.5A4.505 4.505 0 0 1 4 15.5a4.503 4.503 0 0 1 2.817-4.167l-.289-2.025C3.905 10.145 2 12.604 2 15.5 2 19.084 4.916 22 8.5 22a6.497 6.497 0 0 0 5.545-3.126l-.274-1.374H12.51z" />
            </symbol>

            {/* Diagonal hatch for access aisles */}
            <pattern
              id="hatch"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill="#e8e4dc" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#b0ada5"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>

          {/* ── Title ───────────────────────────────────── */}
          <text
            x={VB_W / 2}
            y={22}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#3a3530"
            fontFamily="system-ui,sans-serif"
          >
            Lot W
          </text>
          <text
            x={VB_W / 2}
            y={37}
            textAnchor="middle"
            fontSize="8"
            fill="#8b8580"
            fontFamily="system-ui,sans-serif"
            letterSpacing="0.5"
          >
            Accurate Illustrative Grid
          </text>

          {/* ── Entrance label ──────────────────────────── */}
          <text
            x={16}
            y={WT - 3}
            fontSize="6.5"
            fill="#8b8580"
            fontFamily="system-ui,sans-serif"
            letterSpacing="0.6"
          >
            ENTRANCE
          </text>

          {/* ── Lot boundary ────────────────────────────── */}
          <path
            d={[
              `M ${LLX},${WT}`,
              `L ${WR - 12},${WT}`,
              `Q ${WR},${WT} ${WR},${WT + 12}`,
              `L ${WR},${WB}`,
              `L ${WL},${WB}`,
              `L ${WL},${WT + 16}`,
            ].join(" ")}
            fill="none"
            stroke="#9a9590"
            strokeWidth="1.5"
          />

          {/* ── Accent stripes ──────────────────────────── */}
          {/* Blue stripe — left wall */}
          <rect
            x={WL + 1}
            y={WT + 18}
            width={4}
            height={WB - WT - 20}
            fill="#3b82f6"
            rx="1"
            opacity="0.65"
          />
          {/* Purple stripe — right wall */}
          <rect
            x={WR - 5}
            y={WT + 14}
            width={4}
            height={WB - WT - 16}
            fill="#8b5cf6"
            rx="1"
            opacity="0.45"
          />

          {/* ── Drive lane center lines ─────────────────── */}
          <line
            x1={LLC}
            y1={WT + 4}
            x2={LLC}
            y2={WB - 4}
            stroke="#c8c4bc"
            strokeWidth="1"
            strokeDasharray="8 6"
          />
          <line
            x1={LRC}
            y1={WT + 4}
            x2={LRC}
            y2={WB - 4}
            stroke="#c8c4bc"
            strokeWidth="1"
            strokeDasharray="8 6"
          />

          {/* ── Center divider (between BL & BR) ────────── */}
          <line
            x1={DX}
            y1={BBY - 6}
            x2={DX}
            y2={BBY + 20 * SS}
            stroke="#a8a4a0"
            strokeWidth="1"
            strokeDasharray="6 4"
          />

          {/* ── Landscaping islands ─────────────────────── */}
          {/* Top island */}
          <rect
            x={ISX}
            y={62}
            width={ISW}
            height={28}
            rx="10"
            fill="#a7d5a0"
            opacity="0.45"
          />
          <circle cx={ISX + 22} cy={76} r="8" fill="#6abb60" opacity="0.55" />
          <circle cx={ISX + 48} cy={74} r="10" fill="#5aab50" opacity="0.45" />
          <circle cx={ISX + 78} cy={76} r="7" fill="#6abb60" opacity="0.55" />

          {/* Bottom island */}
          <rect
            x={ISX}
            y={622}
            width={ISW}
            height={28}
            rx="10"
            fill="#a7d5a0"
            opacity="0.45"
          />
          <circle cx={ISX + 28} cy={636} r="9" fill="#5aab50" opacity="0.45" />
          <circle cx={ISX + 58} cy={634} r="8" fill="#6abb60" opacity="0.55" />
          <circle cx={ISX + 82} cy={636} r="7" fill="#5aab50" opacity="0.45" />

          {/* ── Column labels ───────────────────────────── */}
          <text
            x={AX + SW / 2}
            y={WB - 6}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#8b8580"
            fontFamily="system-ui,sans-serif"
          >
            A
          </text>
          <text
            x={BLX + SW / 2}
            y={BBY - 6}
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#8b8580"
            fontFamily="system-ui,sans-serif"
          >
            BL
          </text>
          <text
            x={BRX + SW / 2}
            y={BBY - 6}
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#8b8580"
            fontFamily="system-ui,sans-serif"
          >
            BR
          </text>
          <text
            x={CX + SW / 2}
            y={WB - 6}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#8b8580"
            fontFamily="system-ui,sans-serif"
          >
            C
          </text>

          {/* ── Parking spots ───────────────────────────── */}
          {COLS.map(col =>
            col.ids.map((id, i) => {
              const spot = sm.get(id);
              const x = col.x;
              const y = col.y0 + i * SS;
              const type = spot?.type ?? "standard";
              const occ = spot?.occupied ?? false;

              return (
                <g key={id} role="img" aria-label={spotAria(id, spot)}>
                  {/* Spot boundary dashes */}
                  <line
                    x1={x}
                    y1={y}
                    x2={x + SW}
                    y2={y}
                    stroke="#c8c4bc"
                    strokeWidth="0.7"
                    strokeDasharray="4 3"
                  />
                  {i === col.ids.length - 1 && (
                    <line
                      x1={x}
                      y1={y + SH}
                      x2={x + SW}
                      y2={y + SH}
                      stroke="#c8c4bc"
                      strokeWidth="0.7"
                      strokeDasharray="4 3"
                    />
                  )}

                  {/* Type-specific fill & icon */}
                  {type === "access aisle" ? (
                    <rect
                      x={x + 1}
                      y={y + 1}
                      width={SW - 2}
                      height={SH - 2}
                      fill="url(#hatch)"
                      rx="1"
                    />
                  ) : type === "reserved" ? (
                    <>
                      <rect
                        x={x + 1}
                        y={y + 1}
                        width={SW - 2}
                        height={SH - 2}
                        fill="#e2dfd8"
                        rx="1"
                        opacity="0.5"
                      />
                      <text
                        x={x + SW / 2}
                        y={y + SH / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="11"
                        fill="#8b8580"
                      >
                        ⊘
                      </text>
                    </>
                  ) : type === "handicap" ? (
                    <>
                      <rect
                        x={x + 1}
                        y={y + 1}
                        width={SW - 2}
                        height={SH - 2}
                        fill="#dbeafe"
                        rx="1"
                      />
                      {occ ? (
                        <Car x={x} y={y} dir={col.dir} />
                      ) : (
                        <use
                          href="#wc"
                          x={x + SW / 2 - 6}
                          y={y + SH / 2 - 6}
                          width={12}
                          height={12}
                          fill="#2563eb"
                        />
                      )}
                    </>
                  ) : occ ? (
                    <Car x={x} y={y} dir={col.dir} />
                  ) : (
                    <text
                      x={x + SW / 2}
                      y={y + SH / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="5.5"
                      fill="#a8a49c"
                      fontFamily="monospace"
                    >
                      {id}
                    </text>
                  )}
                </g>
              );
            })
          )}

          {/* ── Bottom decorative spots (not data-driven) ─ */}
          {[75, 145, 215, 305].map(bx => (
            <g key={`bot-${bx}`} opacity="0.5">
              <line
                x1={bx}
                y1={WB}
                x2={bx}
                y2={WB + 32}
                stroke="#c8c4bc"
                strokeWidth="0.7"
                strokeDasharray="4 3"
              />
              <line
                x1={bx + 28}
                y1={WB}
                x2={bx + 28}
                y2={WB + 32}
                stroke="#c8c4bc"
                strokeWidth="0.7"
                strokeDasharray="4 3"
              />
              <use
                href="#car"
                x={-7}
                y={-21}
                width={14}
                height={42}
                transform={`translate(${bx + 14},${WB + 16}) rotate(90)`}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* ── Legend ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <svg width="14" height="10" viewBox="0 0 44 16">
            <rect
              x="1"
              y="1"
              width="40"
              height="13"
              rx="4"
              fill="#eae6de"
              stroke="#b5b1a9"
              strokeWidth="1"
            />
          </svg>
          Occupied
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded border"
            style={{
              borderColor: "#c8c4bc",
              borderStyle: "dashed",
            }}
          />
          Free
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded"
            style={{ backgroundColor: "#dbeafe" }}
          />
          Accessible
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded"
            style={{
              background:
                "repeating-linear-gradient(45deg,#e8e4dc 0px,#e8e4dc 2px,#b0ada5 2px,#b0ada5 4px)",
            }}
          />
          Access Aisle
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded"
            style={{ backgroundColor: "#e2dfd8" }}
          />
          ⊘ Reserved
        </span>
      </div>
    </div>
  );
}
