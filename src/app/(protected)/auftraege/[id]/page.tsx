"use client";

import { useParams, useRouter } from "next/navigation";
import type { AuftragStatus } from "@/types/auftrag";
import { AuftragDetailHeader } from "@/components/features/AuftragDetailHeader";
import { AuftragDetailFields } from "@/components/features/AuftragDetailFields";
import { AuftragAktionsleiste } from "@/components/features/AuftragAktionsleiste";
import { LieferungTimeline } from "@/components/features/LieferungTimeline";
import { PrioritätBadge } from "@/components/ui-custom/PrioritätBadge";

interface LieferungAuftrag {
  id: string;
  typ: "lieferung";
  art: string;
  artikel: string;
  start: string;
  ziel: string;
  routenzug: string;
  ankunft: string;
  auftraggeber: string;
  erstellt: string;
  priorität: 1 | 2 | 3 | 4;
  status: AuftragStatus;
}

interface LinienStop {
  name: string;
  zeit: string;
  vergangen?: boolean;
  aktuell?: boolean;
}

interface MitarbeitertransportAuftrag {
  id: string;
  typ: "mitarbeitertransport";
  linie: string;
  status: AuftragStatus;
  priorität: 1 | 2 | 3 | 4;
  start: string;
  endhaltestelle: string;
  auftraggeber: string;
  ankunft: string;
  routenzug: string;
  wiederholen: string;
  fahrgäste: number;
  linienverlauf: LinienStop[];
}

type AuftragDetailData = LieferungAuftrag | MitarbeitertransportAuftrag;

const MOCK_AUFTRAEGE: Record<string, AuftragDetailData> = {
  "212": {
    id: "212",
    typ: "lieferung",
    art: "Lieferung",
    artikel: "Karosserieteil #12312 (4 Stk.)",
    start: "Lager B",
    ziel: "Lager A",
    routenzug: "Routenzug A",
    ankunft: "12:10 Uhr (in 12min)",
    auftraggeber: "Alex Auftrag",
    erstellt: "10:50 Uhr",
    priorität: 2,
    status: "aktiv",
  },
  "MT-A": {
    id: "MT-A",
    typ: "mitarbeitertransport",
    linie: "Linie A",
    status: "aktiv",
    priorität: 1,
    start: "Lager C",
    endhaltestelle: "Hauptgebäude",
    auftraggeber: "[geplante Linie]",
    ankunft: "voraussichtlich 12:00 Uhr",
    routenzug: "Routenzug A",
    wiederholen: "jeden: Mo, Di, Mi, Do, Fr",
    fahrgäste: 4,
    linienverlauf: [
      { name: "Lager C",      zeit: "11:40 Uhr",                vergangen: true },
      { name: "Lager A",      zeit: "11:44 Uhr",                vergangen: true },
      { name: "Lager H",      zeit: "11:44 Uhr",                vergangen: true },
      { name: "Halle A",      zeit: "11:48 Uhr",                vergangen: true },
      { name: "Lager F",      zeit: "11:53 Uhr",                vergangen: true },
      { name: "Lager E",      zeit: "Abfahrt: 11:58 Uhr",       aktuell: true  },
      { name: "Hauptgebäude", zeit: "voraussichtlich 12:00 Uhr"                },
    ],
  },
};

const MOCK_TIMELINE = [
  { label: "In Auftrag gegeben",      zeit: "10:50" },
  { label: "Auftrag verarbeitet",     zeit: "10:58" },
  { label: "Scan Beladestation",      zeit: "11:18" },
  { label: "Lieferung geladen",       zeit: "11:28" },
  { label: "In Auslieferung",         zeit: "", aktuell: true },
  { label: "Ankunft voraussichtlich", zeit: "12:10" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[13px] text-[#9A9EA0] font-semibold">{label}</span>
      <div className="text-[20px] font-medium text-black">{children}</div>
    </div>
  );
}

function LinienverlaufStop({ stop }: { stop: LinienStop }) {
  const dotColor = stop.vergangen
    ? "bg-[#C5C5C5]"
    : stop.aktuell
    ? "bg-[#146AA1]"
    : "bg-black";
  const textColor = stop.vergangen ? "text-[#515358]" : "text-black";

  return (
    <div className="flex items-center gap-5">
      <div className={`w-10 h-10 rounded-full shrink-0 ${dotColor}`} />
      <div className={`text-[18px] font-bold ${textColor}`}>
        <span>{stop.name}</span>
        <span className="font-medium ml-2 text-[#515358]">{stop.zeit}</span>
      </div>
    </div>
  );
}

function MitarbeitertransportView({ auftrag, onBack }: { auftrag: MitarbeitertransportAuftrag; onBack: () => void }) {
  return (
    <main className="px-14 pt-16">
      <div className="flex items-baseline gap-3 mb-4">
        <button onClick={onBack} className="text-gray-muted hover:text-black transition-colors text-[24px] mr-1">←</button>
        <h1 className="text-[42px] font-bold text-black">Aufträge</h1>
        <span className="text-[42px] font-bold text-blue-primary">
          Mitarbeitertransport #{auftrag.linie}
        </span>
      </div>

      <div className="flex gap-3 mb-8">
        <span className="bg-blue-primary/50 text-[#1F3848] rounded px-3 py-1 text-[18px] font-medium">
          Mitarbeitertransport
        </span>
        <span className="bg-[#51A135]/50 text-[#103C00] rounded px-3 py-1 text-[18px] font-medium">
          aktiv
        </span>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-x-12 gap-y-5">
            <Field label="Start">{auftrag.start}</Field>
            <Field label="Endhaltestelle">{auftrag.endhaltestelle}</Field>
            <Field label="Auftraggeber">{auftrag.auftraggeber}</Field>
            <Field label="Ankunft">{auftrag.ankunft}</Field>
            <Field label="Routenzug">{auftrag.routenzug}</Field>
            <Field label="Wiederholen">{auftrag.wiederholen}</Field>
            <Field label="Fahrgäste">{auftrag.fahrgäste} (aktuell)</Field>
            <Field label="Priorität">
              <PrioritätBadge prio={auftrag.priorität} />
            </Field>
          </div>

          <div className="flex items-center gap-8 bg-[#F9F9F9] rounded-[10px] px-6 py-5">
            <button className="text-blue-primary text-[18px] font-bold hover:opacity-70 transition-opacity">
              Hinweis setzen
            </button>
            <button className="text-blue-primary text-[18px] font-bold hover:opacity-70 transition-opacity">
              Linie bearbeiten
            </button>
            <button className="text-[#A11414] text-[18px] font-bold hover:opacity-70 transition-opacity">
              Linie löschen
            </button>
          </div>

          <button className="self-start bg-[#C8DDEA] text-[#2D5D7B] text-[18px] font-bold rounded-[10px] px-5 py-2.5 hover:bg-[#C8DDEA]/80 transition-colors">
            In Karte anzeigen
          </button>
        </div>

        <div className="w-105 bg-[#F9F9F9] rounded-[10px] px-6 py-5 shrink-0">
          <h2 className="text-[24px] font-bold mb-6">Linienverlauf</h2>
          <div className="relative flex flex-col gap-12.5">
            <div
              className="absolute left-4.75 top-5 bottom-10 w-0.75 border-l-[3px] border-dashed border-gray-muted"
            />
            {auftrag.linienverlauf.map((stop, i) => (
              <LinienverlaufStop key={i} stop={stop} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuftragDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = decodeURIComponent(params.id);
  const auftrag = MOCK_AUFTRAEGE[id] ?? null;

  if (auftrag?.typ === "mitarbeitertransport") {
    return <MitarbeitertransportView auftrag={auftrag} onBack={() => router.push("/auftraege")} />;
  }

  const lieferung = (auftrag as LieferungAuftrag | null) ?? (MOCK_AUFTRAEGE["212"] as LieferungAuftrag);

  return (
    <main className="px-14 pt-16">
      <AuftragDetailHeader
        id={lieferung.id}
        art={lieferung.art}
        status={lieferung.status}
        onBack={() => router.push("/auftraege")}
      />
      <div className="flex gap-8 mt-8">
        <div className="flex-1 flex flex-col gap-6">
          <AuftragDetailFields {...lieferung} />
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
