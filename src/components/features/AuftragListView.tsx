import type { Auftrag, AuftragStatus, AuftragTab } from "@/types/auftrag";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/ui-custom/SearchBar";
import { ListHeader } from "@/components/ui-custom/ListHeader";
import { AuftragListRow } from "@/components/features/AuftragListRow";
import { PlusIcon } from "@/components/ui-custom/icons";

interface AuftragListViewProps {
  aufträge: Auftrag[];
  activeTab: AuftragTab;
  onTabChange: (tab: AuftragTab) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRowClick?: (id: string) => void;
  onNeuErstellen?: () => void;
}

export function AuftragListView({
  aufträge,
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  onRowClick,
  onNeuErstellen,
}: AuftragListViewProps) {
  const filtered = aufträge
    .filter((a) => {
      if (activeTab === "offen") return a.status === "aktiv";
      if (activeTab === "archiv") return a.status === "geplant" || a.status === "unterbrochen";
      return true;
    })
    .filter((a) => {
      if (!searchValue) return true;
      const q = searchValue.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.art.toLowerCase().includes(q) ||
        a.auftraggeber.toLowerCase().includes(q)
      );
    });

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between pb-0">
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as AuftragTab)}>
          <TabsList className="bg-transparent p-0 h-auto gap-6">
            <TabsTrigger value="alle" className="px-0 pb-2">Alle</TabsTrigger>
            <TabsTrigger value="offen" className="px-0 pb-2">Offen</TabsTrigger>
            <TabsTrigger value="archiv" className="px-0 pb-2">Archiv</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <SearchBar value={searchValue} onChange={onSearchChange} size="small" />
          <button
            type="button"
            onClick={onNeuErstellen}
            className="inline-flex items-center gap-1.5 h-[27px] px-3 rounded-[4px] bg-[rgba(20,106,161,0.1)] text-[#146AA1] font-semibold text-[15px]"
          >
            Lieferauftrag erstellen
            <PlusIcon />
          </button>
        </div>
      </div>

      <hr className="border-t border-[#9A9EA0]" />

      <div className="grid grid-cols-[120px_100px_130px_180px_160px_100px_1fr] items-center h-[18px] mt-3 mb-2">
        <ListHeader label="ID" sort="none" />
        <ListHeader label="Linie" sort="none" />
        <ListHeader label="Art" sort="none" />
        <ListHeader label="Von / Ab" sort="none" />
        <ListHeader label="Ziel" sort="none" />
        <ListHeader label="Auftraggeber" sort="none" />
        <ListHeader label="Status / Ankunft" sort="none" />
      </div>

      <div className="flex flex-col gap-1">
        {filtered.map((a) => (
          <AuftragListRow
            key={a.id}
            {...a}
            onClick={onRowClick ? () => onRowClick(a.id) : undefined}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-muted text-[15px] py-4 text-center">Keine Aufträge gefunden.</p>
        )}
      </div>
    </div>
  );
}
