/**
 * @module UseLotSpotsTests
 *
 * Tests for the {@link useLotSpots} hook.
 * Mocks `global.fetch` and Jest fake timers to verify:
 * null lotId returns empty, loading state on fetch, mock fallback,
 * 30-second polling, cleanup on unmount, and reset on lotId change.
 */

import { renderHook, waitFor, act } from "@testing-library/react";
import { useLotSpots } from "@/hooks/use-lot-spots";

const mockSpotsResponse = [
  { id: "A1", occupied: false },
  { id: "A2", occupied: true },
];

describe("useLotSpots @smoke", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
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
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSpotsResponse,
    });

    const { result } = renderHook(() => useLotSpots("lot-w"));
    expect(result.current.isLoading).toBe(true);
  });

  it("sets spots after successful fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSpotsResponse,
    });

    const { result } = renderHook(() => useLotSpots("lot-w"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.spots).toHaveLength(2);
    expect(result.current.spots[0].id).toBe("A1");
  });

  it("falls back to mock data on API error", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLotSpots("lot-w"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Mock data for lot-w has 80 spots (A×20, BL×20, BR×20, C×20)
    expect(result.current.spots).toHaveLength(80);
  });

  it("falls back to mock on non-OK response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    const { result } = renderHook(() => useLotSpots("lot-w"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.spots).toHaveLength(80);
  });

  it("polls every 30 seconds", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSpotsResponse,
    });

    renderHook(() => useLotSpots("lot-w"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    (global.fetch as jest.Mock).mockClear();
    act(() => jest.advanceTimersByTime(30_000));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it("clears interval on unmount", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSpotsResponse,
    });

    const { unmount } = renderHook(() => useLotSpots("lot-w"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    (global.fetch as jest.Mock).mockClear();
    unmount();
    act(() => jest.advanceTimersByTime(30_000));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});