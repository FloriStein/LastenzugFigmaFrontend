import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/ui-custom/SearchBar";
import { FilterBadge } from "@/components/ui-custom/FilterBadge";
import { ListHeader } from "@/components/ui-custom/ListHeader";
import { EreignisListRow } from "@/components/features/EreignisListRow";
import type { Ereignis, EreignisFilter } from "@/types/ereignis";
import { PlusIcon } from "@/components/ui-custom/icons";

function SaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 14H3a1 1 0 01-1-1V3a1 1 0 011-1h8l3 3v9a1 1 0 01-1 1z" stroke="#146AA1" strokeWidth="1.2" />
      <path d="M5 14v-5h6v5M5 2v3h6V2" stroke="#146AA1" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

interface EreignisListViewProps {
  ereignisse: Ereignis[];
  activeTab: "alle" | "offen" | "archiv";
  onTabChange: (tab: "alle" | "offen" | "archiv") => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRowClick?: (id: string) => void;
  filter?: EreignisFilter;
  onFilterOpen?: () => void;
  onFilterRemove?: (key: keyof EreignisFilter) => void;
  showBetroffen?: boolean;
  onSaveView?: () => void;
}

export function EreignisListView({
  ereignisse,
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  onRowClick,
  filter,
  onFilterOpen,
  onFilterRemove,
  showBetroffen,
  onSaveView,
}: EreignisListViewProps) {
  const filtered = ereignisse
    .filter((e) => {
      if (activeTab === "offen") return e.status === "neu" || e.status === "warten";
      if (activeTab === "archiv") return e.status === "abgeschlossen";
      return true;
    })
    .filter((e) => {
      if (!searchValue) return true;
      const q = searchValue.toLowerCase();
      return e.art.toLowerCase().includes(q) || e.fahrzeug.toLowerCase().includes(q);
    })
    .filter((e) => {
      if (filter?.status.length && !filter.status.includes(e.status)) return false;
      if (filter?.priorität.length && !filter.priorität.includes(e.priorität)) return false;
      if (filter?.fahrzeug && !e.fahrzeug.toLowerCase().includes(filter.fahrzeug.toLowerCase())) return false;
      return true;
    });

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between pb-0">
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as "alle" | "offen" | "archiv")}>
          <TabsList className="bg-transparent p-0 h-auto gap-6">
            <TabsTrigger value="alle" className="px-0 pb-2">Alle</TabsTrigger>
            <TabsTrigger value="offen" className="px-0 pb-2">Offen</TabsTrigger>
            <TabsTrigger value="archiv" className="px-0 pb-2">Archiv</TabsTrigger>
          </TabsList>
        </Tabs>
        <SearchBar value={searchValue} onChange={onSearchChange} size="small" />
      </div>

      <hr className="border-t border-gray-muted" />

      <div className="flex items-center gap-2 py-2">
        {filter && filter.status.length > 0 ? (
          <FilterBadge
            header="Status:"
            text={filter.status.join(", ")}
            variant="selected"
            onRemove={() => onFilterRemove?.("status")}
          />
        ) : (
          <FilterBadge header="Status:" text="alle" variant="auto-width" />
        )}
        {filter && filter.fahrzeug ? (
          <FilterBadge
            header="Fahrzeug:"
            text={filter.fahrzeug}
            variant="selected"
            onRemove={() => onFilterRemove?.("fahrzeug")}
          />
        ) : (
          <FilterBadge header="Fahrzeug:" text="alle" variant="auto-width" />
        )}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onFilterOpen}
            className="inline-flex items-center gap-1.5 h-6.75 px-3 rounded-lg bg-[rgba(20,106,161,0.1)] text-blue-primary font-semibold text-[15px]"
          >
            neuer Filter
            <PlusIcon />
          </button>
          {showBetroffen && onSaveView && (
            <button
              type="button"
              onClick={onSaveView}
              className="inline-flex items-center gap-1.5 h-6.75 px-3 rounded-lg bg-[rgba(20,106,161,0.1)] text-blue-primary font-semibold text-[15px]"
            >
              als Ansicht speichern
              <SaveIcon />
            </button>
          )}
        </div>
      </div>

      <hr className="border-t border-gray-muted" />

      <div
        className="grid items-center h-4.5 mt-3 mb-2"
        style={{
          gridTemplateColumns: showBetroffen
            ? "153px 300px 227px 228px 225px 226px 250px 1fr"
            : "153px 300px 227px 228px 225px 226px 1fr",
        }}
      >
        <ListHeader label="Ereignis-ID" sort="none" />
        <ListHeader label="Ereignisart" sort="none" />
        <ListHeader label="Fahrzeug" sort="none" />
        <ListHeader label="Status" sort="none" />
        <ListHeader label="Bearbeiter" sort="none" />
        <ListHeader label="Priorität" sort="none" />
        {showBetroffen && <ListHeader label="Betroffen" sort="none" />}
        <ListHeader label="Erstellt" sort="none" />
      </div>

      <div className="flex flex-col gap-1">
        {filtered.map((e) => (
          <EreignisListRow
            key={e.id}
            id={e.id}
            art={e.art}
            fahrzeug={e.fahrzeug}
            status={e.status}
            bearbeiter={e.bearbeiter}
            priorität={e.priorität}
            erstelltAt={e.erstelltAt}
            onClick={onRowClick ? () => onRowClick(e.id) : undefined}
            showBetroffen={showBetroffen}
            betroffen={e.betroffen}
          />
        ))}
      </div>
    </div>
  );
}
