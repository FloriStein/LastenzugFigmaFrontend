"use client";

import { useState } from "react";
import { EreignisListView } from "@/components/features/EreignisListView";
import type { Ereignis } from "@/types/ereignis";

const MOCK_EREIGNISSE: Ereignis[] = [
  {
    id: "#103",
    art: "Kommunikationsanfrage",
    fahrzeug: "Routenzug B",
    status: "neu",
    priorität: 4,
    erstelltAt: "16:04 Uhr",
  },
  {
    id: "#102",
    art: "Strecke blockiert",
    fahrzeug: "Routenzug A",
    status: "neu",
    priorität: 3,
    erstelltAt: "14:28 Uhr",
  },
  {
    id: "#101",
    art: "Verlassen Betriebsgelände",
    fahrzeug: "Routenzug B",
    status: "neu",
    priorität: 1,
    erstelltAt: "16:02 Uhr",
  },
  {
    id: "#100",
    art: "Sensordefekt",
    fahrzeug: "Routenzug A",
    status: "neu",
    priorität: 3,
    erstelltAt: "16:00 Uhr",
  },
  {
    id: "#99",
    art: "Weiterfahrt bestätigen",
    fahrzeug: "Routenzug A",
    status: "in-bearbeitung",
    bearbeiter: "Maxi Muster",
    priorität: 1,
    erstelltAt: "15:26 Uhr",
  },
  {
    id: "#96",
    art: "Strecke blockiert",
    fahrzeug: "Routenzug A",
    status: "warten",
    bearbeiter: "Tim Zabel",
    priorität: 3,
    erstelltAt: "14:28 Uhr",
  },
  {
    id: "#95",
    art: "Strecke blockiert",
    fahrzeug: "Routenzug A",
    status: "abgeschlossen",
    bearbeiter: "Tim Zabel",
    priorität: 1,
    erstelltAt: "6. Aug, 14:28 Uhr",
  },
];

export default function EreignissePage() {
  const [activeTab, setActiveTab] = useState<"alle" | "offen" | "archiv">("alle");
  const [search, setSearch] = useState("");

  return (
    <main className="px-14 pt-16">
      <h1 className="text-[42px] font-bold text-black mb-15.75">Ereignisse</h1>
      <EreignisListView
        ereignisse={MOCK_EREIGNISSE}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={search}
        onSearchChange={setSearch}
      />
    </main>
  );
}
