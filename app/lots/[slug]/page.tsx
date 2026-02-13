import { notFound } from "next/navigation";
import Link from "next/link";
import { PARKING_LOTS } from "@/lib/constants";
import { getLotStatus } from "@/lib/api";
import { LotStatusDisplay } from "@/components/lot-status-display";

interface LotDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LotDetailPage({ params }: LotDetailPageProps) {
  const { slug } = await params;
  const lot = PARKING_LOTS.find((l) => l.slug === slug);
  if (!lot) notFound();

  const status = await getLotStatus(lot.id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to all lots
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">{lot.name}</h1>
      <LotStatusDisplay lot={lot} status={status} />
    </main>
  );
}
