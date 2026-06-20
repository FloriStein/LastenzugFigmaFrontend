"use client";

import { useState } from "react";
import type { Auftrag, AuftragTab } from "@/types/auftrag";
import { AuftragListView } from "@/components/features/AuftragListView";

const MOCK_AUFTRÄGE: Auftrag[] = [
  {
    id: "AUF-001",
    linie: "L1",
    art: "Lieferauftrag",
    von: "Lager A",
    ab: "08:00",
    ziel: "Hauptgebäude",
    auftraggeber: "Sabine M.",
    status: "aktiv",
    ankunft: "08:45",
  },
  {
    id: "AUF-002",
    linie: "L2",
    art: "Mitarbeitertransport",
    von: "Lager B",
    ab: "09:30",
    ziel: "Büro West",
    auftraggeber: "Jonas M.",
    status: "geplant",
    ankunft: "10:00",
  },
  {
    id: "AUF-003",
    linie: "L1",
    art: "Leerfahrt",
    von: "Haltestelle C",
    ab: "11:00",
    ziel: "Lager F",
    auftraggeber: "System",
    status: "unterbrochen",
    ankunft: "11:30",
  },
  {
    id: "AUF-004",
    art: "Lieferauftrag",
    von: "Lager E",
    ab: "13:00",
    ziel: "Umsteigepunkt",
    auftraggeber: "Matthias M.",
    status: "aktiv",
    ankunft: "13:20",
  },
];

export default function AuftraegePage() {
  const [activeTab, setActiveTab] = useState<AuftragTab>("alle");
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-[24px] font-bold text-black mb-6">Aufträge</h1>
      <AuftragListView
        aufträge={MOCK_AUFTRÄGE}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
    </div>
  );
}
