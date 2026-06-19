"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DetailShell } from "@/components/layout/DetailShell";
import { EreignisTitelleiste } from "@/components/features/EreignisTitelleiste";
import { FahrtmodusCard } from "@/components/features/FahrtmodusCard";
import { useFahrtmodus } from "@/lib/useFahrtmodus";
import type { Ereignis } from "@/types/ereignis";
import type { FahrtmodusVariant } from "@/types/fahrtmodus";

type EreignisDetail = Ereignis & { routenzug: string };

const MOCK_EREIGNIS_DETAILS: Record<string, EreignisDetail> = {
  "#102": { id: "#102", art: "Strecke blockiert",      fahrzeug: "Routenzug A", status: "neu",            priorität: 3, erstelltAt: "14:28 Uhr",          routenzug: "Routenzug A" },
  "#103": { id: "#103", art: "Kommunikationsanfrage",  fahrzeug: "Routenzug B", status: "neu",            priorität: 4, erstelltAt: "16:04 Uhr",          routenzug: "Routenzug B" },
  "#99":  { id: "#99",  art: "Weiterfahrt bestätigen", fahrzeug: "Routenzug A", status: "in-bearbeitung", priorität: 1, erstelltAt: "15:26 Uhr",          routenzug: "Routenzug A", bearbeiter: "Maxi Muster" },
  "#95":  { id: "#95",  art: "Strecke blockiert",      fahrzeug: "Routenzug A", status: "abgeschlossen",  priorität: 1, erstelltAt: "6. Aug, 14:28 Uhr",  routenzug: "Routenzug A", bearbeiter: "Tim Zabel" },
};

function primaryActionFor(variant: FahrtmodusVariant) {
  switch (variant) {
    case "manuell":              return { type: "SET_MODUS" as const, payload: "autom-eingabe" as const };
    case "autom-eingabe":        return { type: "SET_MODUS" as const, payload: "manuell" as const };
    case "autom-nicht-moeglich": return { type: "SET_MODUS" as const, payload: "manuell" as const };
    case "wiederherstellung":    return { type: "RESTORE" as const };
  }
}

export default function EreignisDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const ereignis = MOCK_EREIGNIS_DETAILS[decodeURIComponent(params.id)] ?? null;
  const [fahrtmodus, dispatch] = useFahrtmodus("manuell");

  if (ereignis === null) {
    return (
      <DetailShell titelleiste={<div className="h-37 bg-blue-primary" />}>
        <div className="p-8">
          <p className="text-[20px] font-bold text-black">Ereignis nicht gefunden.</p>
          <Link href="/ereignisse" className="text-blue-primary underline mt-2 inline-block">
            ← Zurück zur Ereignisliste
          </Link>
        </div>
      </DetailShell>
    );
  }

  return (
    <DetailShell
      titelleiste={
        <EreignisTitelleiste
          title={`${ereignis.art} · ${ereignis.fahrzeug}`}
          connectionStatus="connected"
          backHref="/ereignisse"
          onAbschließen={() => router.back()}
        />
      }
    >
      <div className="p-8 flex gap-8">
        <div className="flex-1">
          <dl className="space-y-4">
            <div>
              <dt className="text-gray-muted text-[13px]">Ereignis-ID</dt>
              <dd className="text-[16px] font-medium">{ereignis.id}</dd>
            </div>
            <div>
              <dt className="text-gray-muted text-[13px]">Status</dt>
              <dd className="text-[16px] font-medium">{ereignis.status}</dd>
            </div>
            <div>
              <dt className="text-gray-muted text-[13px]">Priorität</dt>
              <dd className="text-[16px] font-medium">{ereignis.priorität}</dd>
            </div>
            <div>
              <dt className="text-gray-muted text-[13px]">Erstellt</dt>
              <dd className="text-[16px] font-medium">{ereignis.erstelltAt}</dd>
            </div>
            <div>
              <dt className="text-gray-muted text-[13px]">Bearbeiter</dt>
              <dd className="text-[16px] font-medium">{ereignis.bearbeiter ?? "[offen]"}</dd>
            </div>
          </dl>
        </div>
        <div>
          <FahrtmodusCard
            variant={fahrtmodus}
            onPrimaryAction={() => dispatch(primaryActionFor(fahrtmodus))}
          />
        </div>
      </div>
    </DetailShell>
  );
}
