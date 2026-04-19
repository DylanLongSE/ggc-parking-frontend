/**
 * @module UseLotSpotsTests
 *
 * Tests for the {@link useLotSpots} hook.
 * The hook computes spot statuses synchronously from occupiedIds,
 * so no timers or async logic needed.
 */

import { renderHook } from "@testing-library/react";
import { useLotSpots } from "@/hooks/use-lot-spots";

describe("useLotSpots @smoke", () => {
  it("returns empty array when lotId is null", () => {
    const { result } = renderHook(() => useLotSpots(null, []));
    expect(result.current).toEqual([]);
  });

  it("returns spots for lot-w with no occupied IDs", () => {
    const { result } = renderHook(() => useLotSpots("lot-w", []));
    expect(result.current.length).toBeGreaterThan(0);
    expect(result.current[0].id).toBe("A1");
    expect(result.current[0].occupied).toBe(false);
  });

  it("marks spots as occupied based on Pi IDs", () => {
    const { result } = renderHook(() => useLotSpots("lot-w", [0, 13]));
    const a1 = result.current.find((s) => s.id === "A1"); // Pi 0 → A1
    const c1 = result.current.find((s) => s.id === "C1"); // Pi 13 → C1
    expect(a1?.occupied).toBe(true);
    expect(c1?.occupied).toBe(true);
  });

  it("sets monitored flag correctly", () => {
    const { result } = renderHook(() => useLotSpots("lot-w", []));
    const a1 = result.current.find((s) => s.id === "A1");
    const a23 = result.current.find((s) => s.id === "A23");
    expect(a1?.monitored).toBe(true);   // camera covers A1-A4
    expect(a23?.monitored).toBe(false); // A23 is outside camera view
  });

  it("returns empty array for non-lot-w lots", () => {
    const { result } = renderHook(() => useLotSpots("lot-a", []));
    expect(result.current).toEqual([]);
  });
});
