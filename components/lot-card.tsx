import Link from "next/link";
import { ParkingLot } from "@/types/parking";

interface LotCardProps {
  lot: ParkingLot;
}

export function LotCard({ lot }: LotCardProps) {
  return (
    <Link
      href={`/lots/${lot.slug}`}
      className="block rounded-lg border border-border p-6 hover:bg-accent hover:shadow-md transition-all"
    >
      <h2 className="text-xl font-semibold">{lot.name}</h2>
      <p className="text-muted-foreground mt-1">{lot.totalSpaces} total spaces</p>
    </Link>
  );
}
