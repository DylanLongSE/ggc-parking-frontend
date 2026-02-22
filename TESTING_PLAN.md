# Testing Plan — GGC Parking Frontend

## 1. Types of Testing

- **Unit testing** — Verify utility functions, hooks, and component rendering using Jest + React Testing Library.
- **Component/integration testing** — Validate multi-component flows: tab navigation, lot selection → drawer, chip filtering.
- **Smoke testing** — Confirm the app loads, the map renders with markers, and all three tabs are accessible.
- **Cross-browser/device compatibility** — Test on mobile, tablet, and desktop across Chrome, Safari, and Firefox.
- **Usability spot-checks** — Verify touch targets, text readability, and responsive layout at key breakpoints.

## 2. Risk-Based Priorities

| Priority | Area                                        | Why It's High-Risk                                                                                      |
| -------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1        | **Interactive map rendering**               | Leaflet + React integration is fragile; the map and markers must load reliably as the core UI.          |
| 2        | **Lot selection → drawer flow**             | Primary user journey — tapping a marker must fly to the lot, open the drawer, and show correct details. |
| 3        | **Tab navigation (Lots / Overview / Info)** | Switching tabs must preserve map state and not cause re-mount or layout issues.                         |
| 4        | **Responsive layout**                       | Floating tab bar, drawer, and chip bar must render correctly across mobile, tablet, and desktop.        |
| 5        | **Lot status display accuracy**             | Status badges, availability percentages, and color coding must correctly reflect the underlying data.   |

## 3. Testing Scope

- **Fully tested:**
  - Map load and marker rendering
  - Lot selection / deselection flow (marker → fly-to → drawer → close)
  - Tab switching between all three views
  - Status badge logic and color mapping
  - Availability calculation utilities (`lib/availability.ts`)
  - Time formatting utilities (`lib/format-time.ts`)

- **Spot-checked:**
  - Overview page charts and summary cards
  - Info page static content
  - Map tile loading under slow network
  - Edge-case screen sizes (very small / very large)

- **Deferred / out of scope:**
  - Performance and load testing
  - Security testing
  - Real API integration testing (no backend deployed yet)
  - Full accessibility audit (WCAG compliance)

## 4. Entry & Exit Criteria

### Entry Criteria

- `npm run build` completes with zero errors
- Dev server starts and the app loads in a browser without crashes
- All mock data is in place and rendering correctly on screen

### Exit Criteria (Go / No-Go)

- Zero critical or high-severity bugs in the five priority areas above
- All three tabs render correctly on Chrome mobile, Safari mobile, and Chrome desktop
- Lot selection → drawer flow works end-to-end without errors or visual glitches
- 90%+ of written test cases pass
- No unhandled console errors or exceptions during smoke testing

## 5. Tools, Environments & Devices

- **Test framework:** Jest + React Testing Library (unit and component tests)
- **Responsive testing:** Chrome DevTools device emulation
- **Physical / cloud devices:** iOS Safari, Android Chrome (via physical devices or BrowserStack)
- **Browsers:** Chrome (latest), Safari (latest), Firefox (latest)
- **Devices:** iPhone SE / 14 (mobile), iPad (tablet), 1440p monitor (desktop)
- **Environment:** `localhost:3000` dev server with mock data
- **CI:** GitHub Actions — run test suite on push and pull requests (planned)
