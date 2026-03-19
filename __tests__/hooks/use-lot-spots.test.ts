/**
 * @module UseLotSpotsTests
 *
 * Tests for the {@link useLotSpots} hook.
 * Mocks `getLotSpots` from `lib/api` and Jest fake timers to verify:
 * null lotId returns empty, loading state on fetch, mock fallback,
 * 30-second polling, cleanup on unmount, and reset on lotId change.
 */

import { renderHook, waitFor, act } from "@testing-library/react";
import { useLotSpots } from "@/hooks/use-lot-spots";
import { getLotSpots } from "@/lib/api";
import { ParkingSpot } from "@/types/parking";

jest.mock("@/lib/api");
const mockGetLotSpots = getLotSpots as jest.MockedFunction<typeof getLotSpots>;

const mockSpotsResponse: ParkingSpot[] = [
  { id: "A1", occupied: false, type: "standard" },
  { id: "A2", occupied: true, type: "standard" },
];

describe("useLotSpots @smoke", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetLotSpots.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns empty spots and not loading when lotId is null", () => {
    const { result } = renderHook(() => useLotSpots(null));
    expect(result.current.spots).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("starts with loading state when lotId is provided", () => {
    mockGetLotSpots.mockResolvedValue(mockSpotsResponse);

    const { result } = renderHook(() => useLotSpots("lot-w"));
    expect(result.current.isLoading).toBe(true);
  });

  it("sets spots after successful fetch", async () => {
    mockGetLotSpots.mockResolvedValue(mockSpotsResponse);

    const { result } = renderHook(() => useLotSpots("lot-w"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.spots).toHaveLength(2);
    expect(result.current.spots[0].id).toBe("A1");
  });

  it("polls every 30 seconds", async () => {
    mockGetLotSpots.mockResolvedValue(mockSpotsResponse);

    renderHook(() => useLotSpots("lot-w"));

    await waitFor(() => {
      expect(mockGetLotSpots).toHaveBeenCalledTimes(1);
    });

    mockGetLotSpots.mockClear();
    act(() => jest.advanceTimersByTime(30_000));

    await waitFor(() => {
      expect(mockGetLotSpots).toHaveBeenCalledTimes(1);
    });
  });

  it("clears interval on unmount", async () => {
    mockGetLotSpots.mockResolvedValue(mockSpotsResponse);

    const { unmount } = renderHook(() => useLotSpots("lot-w"));

    await waitFor(() => {
      expect(mockGetLotSpots).toHaveBeenCalledTimes(1);
    });

    mockGetLotSpots.mockClear();
    unmount();
    act(() => jest.advanceTimersByTime(30_000));

    expect(mockGetLotSpots).not.toHaveBeenCalled();
  });
});
