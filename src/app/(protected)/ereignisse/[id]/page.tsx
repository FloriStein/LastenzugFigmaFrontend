"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DetailShell } from "@/components/layout/DetailShell";
import { EreignisTitelleiste } from "@/components/features/EreignisTitelleiste";
import { FahrtmodusCard } from "@/components/features/FahrtmodusCard";
import { PrioritätBadge } from "@/components/ui-custom/PrioritätBadge";
import { useFahrtmodus } from "@/lib/useFahrtmodus";
import type { Ereignis, EreignisStatus } from "@/types/ereignis";
import type { FahrtmodusVariant } from "@/types/fahrtmodus";

type EreignisDetail = Ereignis & { routenzug: string };

const MOCK_EREIGNIS_DETAILS: Record<string, EreignisDetail> = {
  "#102": { id: "#102", art: "Strecke blockiert",      fahrzeug: "Routenzug A", status: "neu",            priorität: 3, erstelltAt: "14:28 Uhr",         routenzug: "Routenzug A" },
  "#103": { id: "#103", art: "Kommunikationsanfrage",  fahrzeug: "Routenzug B", status: "neu",            priorität: 4, erstelltAt: "16:04 Uhr",         routenzug: "Routenzug B" },
  "#99":  { id: "#99",  art: "Weiterfahrt bestätigen", fahrzeug: "Routenzug A", status: "in-bearbeitung", priorität: 1, erstelltAt: "15:26 Uhr",         routenzug: "Routenzug A", bearbeiter: "Maxi Muster" },
  "#95":  { id: "#95",  art: "Strecke blockiert",      fahrzeug: "Routenzug A", status: "abgeschlossen",  priorität: 1, erstelltAt: "6. Aug, 14:28 Uhr", routenzug: "Routenzug A", bearbeiter: "Tim Zabel" },
};

const STATUS_LABEL: Record<EreignisStatus, string> = {
  "neu":            "Neu",
  "in-bearbeitung": "In Bearbeitung",
  "warten":         "Warten",
  "abgeschlossen":  "Abgeschlossen",
};

const STATUS_COLOR: Record<EreignisStatus, string> = {
  "neu":            "text-blue-primary",
  "in-bearbeitung": "text-yellow-500",
  "warten":         "text-orange-500",
  "abgeschlossen":  "text-green-600",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[13px] text-gray-muted">{label}</span>
      <div className="text-[15px] font-medium text-dark-surface">{children}</div>
    </div>
  );
}

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
  const [status, setStatus] = useState<EreignisStatus>(ereignis === null ? "neu" : ereignis.status);
  const [abschlussConfirm, setAbschlussConfirm] = useState(false);

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
      <main className="px-14 pt-10 flex gap-10">
        <div className="flex-1 flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-5">
            <Field label="Ereignis-ID">{ereignis.id}</Field>
            <Field label="Erstellt">{ereignis.erstelltAt}</Field>
            <Field label="Ereignisart">{ereignis.art}</Field>
            <Field label="Bearbeiter">{ereignis.bearbeiter ?? "[offen]"}</Field>
            <Field label="Fahrzeug">{ereignis.fahrzeug}</Field>
            <Field label="Priorität">
              <PrioritätBadge prio={ereignis.priorität} />
            </Field>
            <Field label="Status">
              <span className={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</span>
            </Field>
          </div>

          <div
            className="flex items-center gap-4 rounded-[10px] px-6 py-4"
            style={{ background: "rgba(158, 172, 182, 0.1)" }}
          >
            {status === "neu" && (
              <button
                onClick={() => setStatus("in-bearbeitung")}
                className="bg-blue-primary text-white rounded-[8px] px-5 py-2 font-medium text-[15px] hover:bg-blue-primary/80 transition-colors"
              >
                Ereignis annehmen
              </button>
            )}

            {status === "in-bearbeitung" && !abschlussConfirm && (
              <button
                onClick={() => setAbschlussConfirm(true)}
                className="bg-blue-primary text-white rounded-[8px] px-5 py-2 font-medium text-[15px] hover:bg-blue-primary/80 transition-colors"
              >
                Ereignis abschließen
              </button>
            )}

            {status === "in-bearbeitung" && abschlussConfirm && (
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-[#646A79]">
                  Ereignis wirklich abschließen?
                </span>
                <button
                  onClick={() => { setStatus("abgeschlossen"); setAbschlussConfirm(false); }}
                  className="bg-blue-primary text-white rounded-[8px] px-4 py-1.5 font-medium text-[14px] hover:bg-blue-primary/80 transition-colors"
                >
                  Ja, abschließen
                </button>
                <button
                  onClick={() => setAbschlussConfirm(false)}
                  className="border border-gray-300 text-dark-surface rounded-[8px] px-4 py-1.5 font-medium text-[14px] hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            )}

            {status === "abgeschlossen" && (
              <span className="text-green-600 text-[14px] font-medium">
                ✓ Ereignis ist abgeschlossen
              </span>
            )}
          </div>
        </div>

        <div className="w-72 shrink-0">
          <FahrtmodusCard
            variant={fahrtmodus}
            onPrimaryAction={() => dispatch(primaryActionFor(fahrtmodus))}
          />
        </div>
      </main>
    </DetailShell>
  );
}
