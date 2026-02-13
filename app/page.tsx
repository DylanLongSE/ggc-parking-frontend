import { PARKING_LOTS } from "@/lib/constants";
import { LotCard } from "@/components/lot-card";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">GGC Parking Availability</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PARKING_LOTS.map((lot) => (
          <LotCard key={lot.slug} lot={lot} />
        ))}
      </div>
    </main>
  );
}
