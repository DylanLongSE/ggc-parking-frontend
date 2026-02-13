import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-background py-4 px-4">
      <Link href="/" className="text-xl font-bold">
        GGC Parking
      </Link>
    </header>
  );
}
