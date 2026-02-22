/**
 * Converts an ISO 8601 timestamp to a human-readable relative time string.
 *
 * @param iso - ISO 8601 date string (e.g. the `lastUpdated` field from a `LotStatus`)
 * @returns Relative label such as `"Just now"`, `"5 min ago"`, or `"2d ago"`
 */
export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}
