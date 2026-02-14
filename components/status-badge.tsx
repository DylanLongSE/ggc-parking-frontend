interface StatusBadgeProps {
  carCount: number;
  total: number;
  status?: string;
}

export function StatusBadge({ carCount, total, status }: StatusBadgeProps) {
  const ratio = carCount / total;

  const label =
    status && status !== "OK"
      ? status
      : ratio >= 0.95
        ? "Full"
        : ratio >= 0.8
          ? "Almost Full"
          : "Available";

  const color =
    ratio >= 0.95
      ? "bg-destructive/10 text-destructive"
      : ratio >= 0.8
        ? "bg-yellow-100 text-yellow-800"
        : "bg-primary/10 text-primary";

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${color}`}
    >
      {label}
    </span>
  );
}
