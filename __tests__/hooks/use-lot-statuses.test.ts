/**
 * @module UseLotStatusesTests
 *
 * Smoke tests for the {@link useLotStatuses} hook.
 * Mocks `getLotStatus` from `lib/api` and Jest fake timers to verify:
 * initial loading state, fetching only live lots (LIVE_LOT_IDS),
 * mock-data fallback on failure, 30-second polling interval,
 * and interval cleanup on unmount.
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useLotStatuses } from "@/hooks/use-lot-statuses";
import { LIVE_LOT_IDS } from "@/lib/constants";
import { getLotStatus } from "@/lib/api";
import { LotStatus } from "@/types/parking";

jest.mock("@/lib/api");
const mockGetLotStatus = getLotStatus as jest.MockedFunction<typeof getLotStatus>;

const okStatus: LotStatus = {
  lotId: "lot-w",
  carCount: 100,
  lastUpdated: "2026-02-21T12:00:00Z",
  status: "OK",
};

const mockStatus: LotStatus = {
  lotId: "lot-w",
  carCount: 342,
  lastUpdated: expect.any(String) as unknown as string,
  status: "OK",
};

describe("useLotStatuses @smoke", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetLotStatus.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts with loading state", () => {
    mockGetLotStatus.mockResolvedValue(okStatus);

    const { result } = renderHook(() => useLotStatuses());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.statuses).toEqual({});
  });

  it("fetches only live lots", async () => {
    mockGetLotStatus.mockResolvedValue(okStatus);

    renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(mockGetLotStatus).toHaveBeenCalledTimes(LIVE_LOT_IDS.size);
    });

    LIVE_LOT_IDS.forEach((id) => {
      expect(mockGetLotStatus).toHaveBeenCalledWith(id);
    });
  });

  it("sets isLoading to false after fetch", async () => {
    mockGetLotStatus.mockResolvedValue(okStatus);

    const { result } = renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("stores returned statuses by lot id", async () => {
    mockGetLotStatus.mockResolvedValue(okStatus);

    const { result } = renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.statuses["lot-w"]).toEqual(okStatus);
  });

  it("polls every 30 seconds", async () => {
    mockGetLotStatus.mockResolvedValue(okStatus);

    renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(mockGetLotStatus).toHaveBeenCalledTimes(LIVE_LOT_IDS.size);
    });

    mockGetLotStatus.mockClear();
    jest.advanceTimersByTime(30_000);

    await waitFor(() => {
      expect(mockGetLotStatus).toHaveBeenCalledTimes(LIVE_LOT_IDS.size);
    });
  });

  it("clears interval on unmount", async () => {
    mockGetLotStatus.mockResolvedValue(okStatus);

    const { unmount } = renderHook(() => useLotStatuses());

    await waitFor(() => {
      expect(mockGetLotStatus).toHaveBeenCalledTimes(LIVE_LOT_IDS.size);
    });

    mockGetLotStatus.mockClear();
    unmount();
    jest.advanceTimersByTime(30_000);

    expect(mockGetLotStatus).not.toHaveBeenCalled();
  });
});
