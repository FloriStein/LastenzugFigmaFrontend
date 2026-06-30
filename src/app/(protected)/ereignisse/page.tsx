"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EreignisListView } from "@/components/features/EreignisListView";
import { EreignisFilterDialog } from "@/components/features/EreignisFilterDialog";
import type { Ereignis, EreignisFilter } from "@/types/ereignis";
import { EMPTY_EREIGNIS_FILTER } from "@/types/ereignis";

type TabType = "alle" | "offen" | "archiv";

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

function EreignissePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: TabType =
    tabParam === "offen" || tabParam === "archiv" ? tabParam : "alle";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EreignisFilter>(EMPTY_EREIGNIS_FILTER);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <main className="px-14 pt-16">
        <h1 className="text-[42px] font-bold text-black mb-15.75">Ereignisse</h1>
        <EreignisListView
          ereignisse={MOCK_EREIGNISSE}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={(id) => router.push(`/ereignisse/${encodeURIComponent(id)}`)}
          filter={filter}
          onFilterOpen={() => setFilterOpen(true)}
          onFilterRemove={(key) =>
            setFilter((prev) => ({
              ...prev,
              [key]: Array.isArray(prev[key]) ? [] : "",
            }))
          }
        />
      </main>
      <EreignisFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        initialFilter={filter}
        onApply={setFilter}
      />
    </>
  );
}

export default function EreignissePage() {
  return (
    <Suspense>
      <EreignissePageContent />
    </Suspense>
  );
}
