import { formatRelativeTime } from "@/lib/format-time";

describe("formatRelativeTime @smoke", () => {
  beforeEach(() => {
    jest
      .spyOn(Date, "now")
      .mockReturnValue(new Date("2026-02-21T12:00:00Z").getTime());
  });

  it('returns "Just now" for <60 seconds ago', () => {
    expect(formatRelativeTime("2026-02-21T11:59:30Z")).toBe("Just now");
  });

  it('returns "X min ago" for <60 minutes ago', () => {
    expect(formatRelativeTime("2026-02-21T11:55:00Z")).toBe("5 min ago");
    expect(formatRelativeTime("2026-02-21T11:20:00Z")).toBe("40 min ago");
  });

  it('returns "X hr ago" for <24 hours ago', () => {
    expect(formatRelativeTime("2026-02-21T10:00:00Z")).toBe("2 hr ago");
    expect(formatRelativeTime("2026-02-20T16:00:00Z")).toBe("20 hr ago");
  });

  it('returns "Xd ago" for >=24 hours ago', () => {
    expect(formatRelativeTime("2026-02-19T12:00:00Z")).toBe("2d ago");
    expect(formatRelativeTime("2026-02-14T12:00:00Z")).toBe("7d ago");
  });

  it("boundary: exactly 60 seconds → 1 min ago", () => {
    expect(formatRelativeTime("2026-02-21T11:59:00Z")).toBe("1 min ago");
  });

  it("boundary: exactly 60 minutes → 1 hr ago", () => {
    expect(formatRelativeTime("2026-02-21T11:00:00Z")).toBe("1 hr ago");
  });

  it("boundary: exactly 24 hours → 1d ago", () => {
    expect(formatRelativeTime("2026-02-20T12:00:00Z")).toBe("1d ago");
  });
});
