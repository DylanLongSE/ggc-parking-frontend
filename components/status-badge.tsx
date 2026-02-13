interface StatusBadgeProps {
  occupied: number;
  total: number;
}

export function StatusBadge({ occupied, total }: StatusBadgeProps) {
  const ratio = occupied / total;

  const label =
    ratio >= 0.95 ? "Full" : ratio >= 0.8 ? "Almost Full" : "Available";

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
