import { renderHook, waitFor } from "@testing-library/react";
import { useLotStatuses } from "@/hooks/use-lot-statuses";
import { PARKING_LOTS } from "@/lib/constants";

describe("useLotStatuses @smoke", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts with loading state", () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        lotId: "lot-w",
        carCount: 100,
        lastUpdated: "2026-02-21T12:00:00Z",
        status: "OK",
      }),
    });

    const { result } = renderHook(() => useLotStatuses());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.statuses).toEqual({});
  });

  it("fetches all 5 lots", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        lotId: "lot-w",
        carCount: 100,
        lastUpdated: "2026-02-21T12:00:00Z",
        status: "OK",
      }),
    });

    renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(5);
    });

    PARKING_LOTS.forEach((lot) => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/lots/${lot.id}/status`)
      );
    });
  });

  it("sets isLoading to false after fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        lotId: "lot-w",
        carCount: 100,
        lastUpdated: "2026-02-21T12:00:00Z",
        status: "OK",
      }),
    });

    const { result } = renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("falls back to mock data on API error", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Object.keys(result.current.statuses)).toHaveLength(5);
    expect(result.current.statuses["lot-w"].carCount).toBe(342);
  });

  it("falls back to mock on non-OK response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    const { result } = renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.statuses["lot-w"].carCount).toBe(342);
  });

  it("polls every 30 seconds", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        lotId: "lot-w",
        carCount: 100,
        lastUpdated: "2026-02-21T12:00:00Z",
        status: "OK",
      }),
    });

    renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(5);
    });

    (global.fetch as jest.Mock).mockClear();
    jest.advanceTimersByTime(30_000);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(5);
    });
  });

  it("clears interval on unmount", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        lotId: "lot-w",
        carCount: 100,
        lastUpdated: "2026-02-21T12:00:00Z",
        status: "OK",
      }),
    });

    const { unmount } = renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(5);
    });

    (global.fetch as jest.Mock).mockClear();
    unmount();
    jest.advanceTimersByTime(30_000);

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
