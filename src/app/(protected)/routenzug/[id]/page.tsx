"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RoutenzugDetailShell } from "@/components/layout/RoutenzugDetailShell";
import { EreignisTitelleiste } from "@/components/features/EreignisTitelleiste";
import { KameraPanel } from "@/components/features/KameraPanel";
import { FahrtInfoPanel } from "@/components/features/FahrtInfoPanel";
import { AktionenPanel } from "@/components/features/AktionenPanel";
import { useFahrtmodus } from "@/lib/useFahrtmodus";
import type { FahrtStatus } from "@/types/routenzug";
import type { FahrtmodusVariant } from "@/types/fahrtmodus";

type RoutenzugDetail = {
  id: string;
  name: string;
  status: FahrtStatus;
  frontImageUrl: string;
  speedKmh: number;
  acceleration: number;
  aufträge: { id: string; typ: string; priorität: 1 | 2 | 3 | 4 }[];
};

const MOCK_ROUTENZUG_DETAILS: Record<string, RoutenzugDetail> = {
  "RZ-A": {
    id: "RZ-A", name: "Routenzug A", status: "fährt-automatisiert",
    frontImageUrl: "/mock/kamera-front-a.jpg", speedKmh: 12, acceleration: 2,
    aufträge: [
      { id: "AUF-01", typ: "Lieferung", priorität: 2 },
      { id: "AUF-02", typ: "Mitarbeitertransport", priorität: 1 },
    ],
  },
  "RZ-B": {
    id: "RZ-B", name: "Routenzug B", status: "lädt",
    frontImageUrl: "/mock/kamera-front-b.jpg", speedKmh: 0, acceleration: 0,
    aufträge: [
      { id: "AUF-03", typ: "Lieferung", priorität: 3 },
    ],
  },
  "RZ-C": {
    id: "RZ-C", name: "Routenzug C", status: "lädt",
    frontImageUrl: "/mock/kamera-front-c.jpg", speedKmh: 0, acceleration: 0,
    aufträge: [],
  },
};

function primaryActionFor(variant: FahrtmodusVariant) {
  switch (variant) {
    case "manuell":              return { type: "SET_MODUS" as const, payload: "autom-eingabe" as const };
    case "autom-eingabe":        return { type: "SET_MODUS" as const, payload: "manuell" as const };
    case "autom-nicht-moeglich": return { type: "SET_MODUS" as const, payload: "manuell" as const };
    case "wiederherstellung":    return { type: "RESTORE" as const };
  }
}

export default function RoutenzugDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const routenzug = MOCK_ROUTENZUG_DETAILS[decodeURIComponent(params.id)] ?? null;
  const [fahrtmodus, dispatch] = useFahrtmodus("manuell");
  const [confirming, setConfirming] = useState(false);

  const handlePrimaryAction = () => dispatch(primaryActionFor(fahrtmodus));

  if (!routenzug) {
    return (
      <div className="h-screen flex flex-col">
        <div className="h-37 bg-blue-primary" />
        <div className="flex-1 bg-gray-light p-8">
          <p className="text-[20px] font-bold text-black">Routenzug nicht gefunden.</p>
          <Link href="/karte" className="text-blue-primary underline mt-2 inline-block">
            ← Zurück zur Karte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <RoutenzugDetailShell
      titelleiste={
        <>
          <EreignisTitelleiste
            title={routenzug.name}
            connectionStatus="connected"
            backHref="/karte"
            onAbschließen={() => setConfirming(true)}
          />
          {confirming && (
            <div className="bg-[#1a1f2b] px-8 py-3 flex items-center gap-4 shrink-0">
              <span className="text-white text-[14px]">
                Fahrt wirklich abschließen?
              </span>
              <button
                onClick={() => router.push("/karte")}
                className="bg-blue-primary text-white rounded-[8px] px-4 py-1.5 text-[14px] font-medium hover:bg-blue-primary/80 transition-colors"
              >
                Ja, abschließen
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="border border-white/30 text-white rounded-[8px] px-4 py-1.5 text-[14px] font-medium hover:bg-white/10 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          )}
        </>
      }
      kameraPanel={
        <KameraPanel
          frontImageUrl={routenzug.frontImageUrl}
          speedKmh={routenzug.speedKmh}
          acceleration={routenzug.acceleration}
        />
      }
      fahrtInfoPanel={
        <FahrtInfoPanel
          fahrtStatus={routenzug.status}
          aufträge={routenzug.aufträge}
        />
      }
      aktionenPanel={
        <AktionenPanel
          fahrtmodus={fahrtmodus}
          onFahrtmodusAction={handlePrimaryAction}
        />
      }
    />
  );
}
