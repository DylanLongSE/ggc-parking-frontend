"use client";

import dynamic from "next/dynamic";

const ParkingMap = dynamic(() => import("@/components/map/parking-map"), {
  ssr: false,
});

export default function HomePage() {
  return <ParkingMap />;
}
