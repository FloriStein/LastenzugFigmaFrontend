"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Auftrag, AuftragFilter, AuftragTab } from "@/types/auftrag";
import { EMPTY_AUFTRAG_FILTER } from "@/types/auftrag";
import { AuftragListView } from "@/components/features/AuftragListView";
import { AuftragErstellenDialog } from "@/components/features/AuftragErstellenDialog";
import { AuftragFilterDialog } from "@/components/features/AuftragFilterDialog";

const INITIAL_AUFTRÄGE: Auftrag[] = [
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

function AuftragPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: AuftragTab =
    tabParam === "offen" || tabParam === "archiv" ? tabParam : "alle";
  const [activeTab, setActiveTab] = useState<AuftragTab>(initialTab);
  const [searchValue, setSearchValue] = useState("");
  const [aufträge, setAufträge] = useState<Auftrag[]>(INITIAL_AUFTRÄGE);
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [auftragsFilter, setAuftragsFilter] = useState<AuftragFilter>(EMPTY_AUFTRAG_FILTER);

  return (
    <>
      <main className="px-14 pt-16">
        <h1 className="text-[42px] font-bold mb-15.75">Aufträge</h1>
        <AuftragListView
          aufträge={aufträge}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onRowClick={(id) => router.push(`/auftraege/${encodeURIComponent(id)}`)}
          onNeuErstellen={() => setCreateOpen(true)}
          filter={auftragsFilter}
          onFilterOpen={() => setFilterOpen(true)}
          onFilterRemove={(key) =>
            setAuftragsFilter((prev) => ({ ...prev, [key]: [] }))
          }
        />
      </main>
      <AuftragErstellenDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(data) =>
          setAufträge((prev) => [
            { ...data, id: `AUF-${String(prev.length + 1).padStart(3, "0")}` },
            ...prev,
          ])
        }
      />
      <AuftragFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        initialFilter={auftragsFilter}
        onApply={setAuftragsFilter}
      />
    </>
  );
}

export default function AuftraegePage() {
  return (
    <Suspense>
      <AuftragPageContent />
    </Suspense>
  );
}
