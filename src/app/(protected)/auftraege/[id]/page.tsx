"use client";

import { useRouter } from "next/navigation";
import type { AuftragStatus } from "@/types/auftrag";
import { AuftragDetailHeader } from "@/components/features/AuftragDetailHeader";
import { AuftragDetailFields } from "@/components/features/AuftragDetailFields";
import { AuftragAktionsleiste } from "@/components/features/AuftragAktionsleiste";
import { LieferungTimeline } from "@/components/features/LieferungTimeline";

interface TimelineSchritt {
  label: string;
  zeit: string;
  aktuell?: boolean;
}

const MOCK_AUFTRAG = {
  id: "212",
  art: "Lieferung",
  artikel: "Karosserieteil #12312 (4 Stk.)",
  start: "Lager B",
  ziel: "Lager A",
  routenzug: "Routenzug A",
  ankunft: "12:10 Uhr (in 12min)",
  auftraggeber: "Alex Auftrag",
  erstellt: "10:50 Uhr",
  priorität: 2 as 1 | 2 | 3 | 4,
  status: "aktiv" as AuftragStatus,
};

const MOCK_TIMELINE: TimelineSchritt[] = [
  { label: "In Auftrag gegeben", zeit: "10:50" },
  { label: "Auftrag verarbeitet", zeit: "10:58" },
  { label: "Scan Beladestation", zeit: "11:18" },
  { label: "Lieferung geladen", zeit: "11:28" },
  { label: "In Auslieferung", zeit: "", aktuell: true },
  { label: "Ankunft voraussichtlich", zeit: "12:10" },
];

export default function AuftragDetailPage() {
  const router = useRouter();
  return (
    <main className="px-14 pt-16">
      <AuftragDetailHeader
        id={MOCK_AUFTRAG.id}
        art={MOCK_AUFTRAG.art}
        status={MOCK_AUFTRAG.status}
        onBack={() => router.push("/auftraege")}
      />
      <div className="flex gap-8 mt-8">
        <div className="flex-1 flex flex-col gap-6">
          <AuftragDetailFields {...MOCK_AUFTRAG} />
          <AuftragAktionsleiste onBearbeiten={() => {}} onStornieren={() => {}} />
          <button className="text-blue-primary underline self-start">In Karte anzeigen</button>
        </div>
        <div className="w-85">
          <h2 className="text-[20px] font-semibold mb-4">Lieferungsverlauf</h2>
          <LieferungTimeline schritte={MOCK_TIMELINE} />
        </div>
      </div>
    </main>
  );
}
