"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KarteShell } from "@/components/layout/KarteShell";
import { RoutenzugListPanel } from "@/components/features/RoutenzugListPanel";
import type { Routenzug } from "@/types/routenzug";

const MapCanvas = dynamic(
  () => import("@/components/features/MapCanvas").then((m) => ({ default: m.MapCanvas })),
  { ssr: false }
);

const MOCK_ROUTENZÜGE: Routenzug[] = [
  {
    id: "RZ-A",
    name: "Routenzug A",
    aufträge: ["#212", "#209"],
    status: "fahrt-unterbrochen",
    position: { x: 1264, y: 626 },
  },
  {
    id: "RZ-B",
    name: "Routenzug B",
    aufträge: ["#210"],
    status: "fährt-automatisiert",
    position: { x: 774, y: 768 },
  },
  {
    id: "RZ-C",
    name: "Routenzug C",
    aufträge: [],
    status: "lädt",
    ladestand: 71,
    position: { x: 500, y: 400 },
  },
];

export default function KartePage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  function handleSelect(id: string) {
    setSelectedId(id);
    router.push(`/routenzug/${encodeURIComponent(id)}`);
  }

  return (
    <KarteShell activeItem="karte">
      <div className="flex h-full">
        <RoutenzugListPanel
          routenzüge={MOCK_ROUTENZÜGE}
          onSelect={handleSelect}
        />
        <div className="flex-1 relative">
          <MapCanvas
            routenzüge={MOCK_ROUTENZÜGE}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </KarteShell>
  );
}
