# Sprint 11 — Filter-Dialoge & UX-Verfeinerung

> **Status: ✅ Abgeschlossen** — Implementierung + Tests vollständig

## Ziel

Filter-Dialoge für Ereignisse und Aufträge implementieren, "Lieferauftrag erstellen" Dialog verdrahten und kleinere UX-Gaps schließen.

Tests kommen **nach** der Implementierung — dieses Dokument enthält keine Testblöcke.

## Scope

| # | Ticket | Beschreibung | Zieldatei(en) |
|---|--------|--------------|---------------|
| 1 | UX-01 | SearchBar Clear-Button | `SearchBar.tsx` |
| 2 | FD-01 | Ereignis Filter-Dialog | `EreignisFilterDialog.tsx` + `EreignisListView.tsx` + `ereignisse/page.tsx` |
| 3 | CR-01 | Lieferauftrag erstellen Dialog | `AuftragErstellenDialog.tsx` + `auftraege/page.tsx` |
| 4 | FD-02 | Aufträge Filter-Dialog | `AuftragFilterDialog.tsx` + `AuftragListView.tsx` + `auftraege/page.tsx` |

## Abhängigkeiten / Vorbereitung

- **Abhängigkeit Sprint 10:** Sprint 11 baut auf NA-01 (AuftraegePage mit Suspense-Wrapper + useState) auf. Sprint-10 zuerst abschließen.
- **FD-01 vor CR-01 und FD-02:** FD-01 installiert `dialog.tsx` (shadcn) — CR-01 und FD-02 nutzen dieselbe Komponente. FD-01 zuerst.
- **Neues shadcn-Package:** `npx shadcn@latest add dialog` → erzeugt `src/components/ui/dialog.tsx`. Exports nach der Installation in der Datei verifizieren (erwartet: `Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose`, ggf. `DialogHeader, DialogFooter, DialogOverlay`).

## Implementierungsreihenfolge

1. UX-01 (einfach, eigenständig — Warm-up)
2. FD-01 (komplex, installiert Dialog-Komponente)
3. CR-01 (Medium, nutzt Dialog aus FD-01, baut auf Sprint-10-NA-01 auf)
4. FD-02 (Medium, analoge Struktur zu FD-01)

---

## Ticket 1 — UX-01: SearchBar Clear-Button

**Datei:** `src/components/ui-custom/SearchBar.tsx`

### Problem

Wenn ein Suchbegriff eingegeben wurde, gibt es keinen schnellen Weg, die Suche zu löschen. Das ×-Icon ersetzt die Lupe sobald `value.length > 0`.

### Änderung

Den statischen `<span>` mit `<SearchIcon />` durch ein bedingtes JSX ersetzen:

```tsx
{value.length > 0 ? (
  <button
    type="button"
    onClick={() => onChange("")}
    aria-label="Suche löschen"
    className="absolute right-3 flex items-center text-gray-muted hover:text-dark-surface transition-colors"
  >
    <span className="text-[16px] leading-none select-none">×</span>
  </button>
) : (
  <span className="absolute right-3 flex items-center pointer-events-none">
    <SearchIcon />
  </span>
)}
```

Kein neues State, keine neuen Props — nur `onChange("")` beim Click.

---

## Ticket 2 — FD-01: Ereignis Filter-Dialog

**Figma:** `516:19538` (Ereignisansicht mit Filter)

### Vorbereitung

```bash
npx shadcn@latest add dialog
# → src/components/ui/dialog.tsx
```

Nach der Installation `src/components/ui/dialog.tsx` öffnen und die genauen Export-Namen notieren. Die folgenden Code-Snippets verwenden die Standard-shadcn-Exports (`Dialog, DialogContent, DialogTitle, DialogClose`).

### Schritt 1 — Neuer Type in `src/types/ereignis.ts`

Am Ende der Datei ergänzen:

```ts
export type EreignisFilter = {
  status: EreignisStatus[];
  priorität: (1 | 2 | 3 | 4)[];
  fahrzeug: string;
};

export const EMPTY_EREIGNIS_FILTER: EreignisFilter = {
  status: [],
  priorität: [],
  fahrzeug: "",
};
```

### Schritt 2 — Neue Komponente `src/components/features/EreignisFilterDialog.tsx`

```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { EreignisFilter, EreignisStatus } from "@/types/ereignis";

const STATUS_LABELS: { value: EreignisStatus; label: string }[] = [
  { value: "neu",            label: "Neu" },
  { value: "in-bearbeitung", label: "In Bearbeitung" },
  { value: "warten",         label: "Warten" },
  { value: "abgeschlossen",  label: "Abgeschlossen" },
];

interface EreignisFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilter: EreignisFilter;
  onApply: (filter: EreignisFilter) => void;
}

export function EreignisFilterDialog({
  open,
  onOpenChange,
  initialFilter,
  onApply,
}: EreignisFilterDialogProps) {
  const [draft, setDraft] = useState<EreignisFilter>(initialFilter);

  function toggleStatus(value: EreignisStatus) {
    setDraft((prev) => ({
      ...prev,
      status: prev.status.includes(value)
        ? prev.status.filter((s) => s !== value)
        : [...prev.status, value],
    }));
  }

  function togglePriorität(p: 1 | 2 | 3 | 4) {
    setDraft((prev) => ({
      ...prev,
      priorität: prev.priorität.includes(p)
        ? prev.priorität.filter((x) => x !== p)
        : [...prev.priorität, p],
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[10px] p-6 w-[440px] shadow-lg">
        <DialogTitle className="text-[18px] font-bold text-dark-surface mb-5">
          Filter
        </DialogTitle>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide mb-2">
              Status
            </p>
            <div className="flex flex-col gap-2">
              {STATUS_LABELS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.status.includes(value)}
                    onChange={() => toggleStatus(value)}
                    className="w-4 h-4 accent-blue-primary"
                  />
                  <span className="text-[14px] text-dark-surface">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide mb-2">
              Priorität
            </p>
            <div className="flex gap-2">
              {([1, 2, 3, 4] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePriorität(p)}
                  className={`w-8 h-8 rounded-full border-2 text-[13px] font-bold transition-colors ${
                    draft.priorität.includes(p)
                      ? "border-blue-primary bg-blue-primary text-white"
                      : "border-gray-border text-dark-surface"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide mb-2">
              Fahrzeug
            </p>
            <input
              type="text"
              value={draft.fahrzeug}
              onChange={(e) => setDraft((prev) => ({ ...prev, fahrzeug: e.target.value }))}
              placeholder="z.B. Routenzug A"
              className="w-full h-9 px-3 border border-gray-border rounded-[8px] text-[14px] text-dark-surface placeholder:text-gray-muted outline-none focus:border-blue-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <button
              type="button"
              onClick={() => setDraft(initialFilter)}
              className="px-4 py-2 rounded-[8px] border border-gray-border text-dark-surface text-[14px] font-medium hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={() => { onApply(draft); onOpenChange(false); }}
            className="px-4 py-2 rounded-[8px] bg-blue-primary text-white text-[14px] font-medium hover:bg-blue-primary/80 transition-colors"
          >
            Anwenden
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Schritt 3 — `src/components/features/EreignisListView.tsx` anpassen

Neue Props ergänzen:

```ts
interface EreignisListViewProps {
  ereignisse: Ereignis[];
  activeTab: "alle" | "offen" | "archiv";
  onTabChange: (tab: "alle" | "offen" | "archiv") => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRowClick?: (id: string) => void;
  filter?: EreignisFilter;          // NEU
  onFilterOpen?: () => void;        // NEU
  onFilterRemove?: (key: keyof EreignisFilter) => void;  // NEU
}
```

Filter-Zeile (zwischen `<hr>` Linien) dynamisch machen:

```tsx
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
      className="inline-flex items-center gap-1.5 h-[27px] px-3 rounded-[4px] bg-[rgba(20,106,161,0.1)] text-[#146AA1] font-semibold text-[15px]"
    >
      neuer Filter
      <PlusIcon />
    </button>
    {/* "als Ansicht speichern" Button bleibt unverändert */}
  </div>
</div>
```

### Schritt 4 — `src/app/(protected)/ereignisse/page.tsx` anpassen

```tsx
import { EreignisFilterDialog, type EreignisFilter } from "@/components/features/EreignisFilterDialog";
import { EMPTY_EREIGNIS_FILTER } from "@/types/ereignis";
```

Neue State-Variablen in `EreignissePageContent`:

```tsx
const [filter, setFilter] = useState<EreignisFilter>(EMPTY_EREIGNIS_FILTER);
const [filterOpen, setFilterOpen] = useState(false);
```

Filterlogik erweitern — nach dem Tab-Filter und Suchfilter:

```tsx
.filter((e) => {
  if (filter.status.length > 0 && !filter.status.includes(e.status)) return false;
  if (filter.priorität.length > 0 && !filter.priorität.includes(e.priorität)) return false;
  if (filter.fahrzeug && !e.fahrzeug.toLowerCase().includes(filter.fahrzeug.toLowerCase())) return false;
  return true;
})
```

Wait — die Filterlogik sitzt in `EreignisListView.tsx`, nicht in der Page. Für die `filter`-Props-Übergabe gilt: die `EreignisListView` wendet nur Tab + Suche an; den neuen `EreignisFilter` separat anwenden in `EreignissePageContent`:

```tsx
const filtered = MOCK_EREIGNISSE
  .filter((e) => { /* Tab-Filter */ })
  .filter((e) => { /* Such-Filter */ })
  .filter((e) => {
    if (filter.status.length > 0 && !filter.status.includes(e.status)) return false;
    if (filter.priorität.length > 0 && !filter.priorität.includes(e.priorität)) return false;
    if (filter.fahrzeug && !e.fahrzeug.toLowerCase().includes(filter.fahrzeug.toLowerCase())) return false;
    return true;
  });
```

**Hinweis:** Das bedeutet, dass das Filtern aus `EreignisListView` herausgezogen werden muss — die `filtered`-Variable wird in der Page berechnet und als `ereignisse={filtered}` an die View übergeben. Die ListView filtert dann intern nur noch nach Tab und Suche.

Alternatively — einfacher Ansatz: den `EreignisFilter` als additional Props an `EreignisListView` durchreichen und die Liste dort intern filtern (nach Tab, Suche UND `EreignisFilter`). Das hält alles in der View und spart State-Durchleitung. Diesen Ansatz bevorzugen.

JSX in `EreignissePageContent` erweitern:

```tsx
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
```

---

## Ticket 3 — CR-01: Lieferauftrag erstellen Dialog

**Hinweis:** Baut auf Sprint-10 NA-01 auf (AuftraegePage hat bereits Suspense-Wrapper). Die `MOCK_AUFTRÄGE`-Konstante muss zu `useState` werden.

### Neue Komponente `src/components/features/AuftragErstellenDialog.tsx`

```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { Auftrag } from "@/types/auftrag";

type AuftragFormData = Omit<Auftrag, "id">;

const ART_OPTIONS = ["Lieferauftrag", "Mitarbeitertransport", "Leerfahrt"] as const;

interface AuftragErstellenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AuftragFormData) => void;
}

const EMPTY_FORM: AuftragFormData = {
  art: "Lieferauftrag",
  von: "",
  ab: "",
  ziel: "",
  auftraggeber: "",
  status: "geplant",
  ankunft: "",
};

export function AuftragErstellenDialog({
  open,
  onOpenChange,
  onSubmit,
}: AuftragErstellenDialogProps) {
  const [form, setForm] = useState<AuftragFormData>(EMPTY_FORM);

  function set(field: keyof AuftragFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (!form.von || !form.ziel || !form.auftraggeber) return;
    onSubmit(form);
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[10px] p-6 w-[480px] shadow-lg">
        <DialogTitle className="text-[18px] font-bold text-dark-surface mb-5">
          Neuen Auftrag erstellen
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide block mb-1.5">
              Art
            </label>
            <select
              value={form.art}
              onChange={(e) => set("art", e.target.value)}
              className="w-full h-9 px-3 border border-gray-border rounded-[8px] text-[14px] text-dark-surface outline-none focus:border-blue-primary bg-white"
            >
              {ART_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {(["von", "ziel", "auftraggeber", "ab"] as const).map((field) => (
            <div key={field}>
              <label className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide block mb-1.5">
                {field === "von" ? "Von" : field === "ziel" ? "Ziel" : field === "auftraggeber" ? "Auftraggeber" : "Abfahrt (Uhrzeit)"}
              </label>
              <input
                type="text"
                value={form[field]}
                onChange={(e) => set(field, e.target.value)}
                placeholder={field === "ab" ? "08:30" : ""}
                className="w-full h-9 px-3 border border-gray-border rounded-[8px] text-[14px] text-dark-surface placeholder:text-gray-muted outline-none focus:border-blue-primary transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <button
              type="button"
              onClick={() => setForm(EMPTY_FORM)}
              className="px-4 py-2 rounded-[8px] border border-gray-border text-dark-surface text-[14px] font-medium hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!form.von || !form.ziel || !form.auftraggeber}
            className="px-4 py-2 rounded-[8px] bg-blue-primary text-white text-[14px] font-medium hover:bg-blue-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Erstellen
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Änderungen in `src/app/(protected)/auftraege/page.tsx`

In `AuftragPageContent` (nach Sprint-10-NA-01-Refactoring):

```tsx
import { AuftragErstellenDialog } from "@/components/features/AuftragErstellenDialog";

// MOCK_AUFTRÄGE wird zu useState-Initialwert:
const INITIAL_AUFTRÄGE: Auftrag[] = [ /* ... bestehende 4 Mock-Einträge ... */ ];

function AuftragPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ... (Tab-Sync wie in Sprint 10)
  const [aufträge, setAufträge] = useState<Auftrag[]>(INITIAL_AUFTRÄGE);
  const [createOpen, setCreateOpen] = useState(false);

  let nextId = aufträge.length + 1;

  return (
    <>
      <main className="px-14 pt-16">
        <h1 className="text-[42px] font-bold mb-15.75">Aufträge</h1>
        <AuftragListView
          aufträge={aufträge}
          // ... restliche Props
          onRowClick={(id) => router.push(`/auftraege/${encodeURIComponent(id)}`)}
          onNeuErstellen={() => setCreateOpen(true)}
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
    </>
  );
}
```

### Hinweis zu `nextId`

Das `nextId`-Pattern ist für Mock-Daten ausreichend — es gibt keine Kollisionsgefahr ohne Backend.

---

## Ticket 4 — FD-02: Aufträge Filter-Dialog

**Figma:** `514:22132` (Aufträge mit Filterdialog)

### Schritt 1 — Neuer Type in `src/types/auftrag.ts`

```ts
export type AuftragFilter = {
  status: AuftragStatus[];
  art: string[];
};

export const EMPTY_AUFTRAG_FILTER: AuftragFilter = {
  status: [],
  art: [],
};
```

### Schritt 2 — Neue Komponente `src/components/features/AuftragFilterDialog.tsx`

Analoge Struktur zu `EreignisFilterDialog`, aber mit anderen Feldern:

```tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import type { AuftragFilter, AuftragStatus } from "@/types/auftrag";

const STATUS_LABELS: { value: AuftragStatus; label: string }[] = [
  { value: "aktiv",        label: "Aktiv" },
  { value: "geplant",      label: "Geplant" },
  { value: "unterbrochen", label: "Unterbrochen" },
];

const ART_OPTIONS = ["Lieferauftrag", "Mitarbeitertransport", "Leerfahrt"] as const;

interface AuftragFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilter: AuftragFilter;
  onApply: (filter: AuftragFilter) => void;
}

export function AuftragFilterDialog({
  open,
  onOpenChange,
  initialFilter,
  onApply,
}: AuftragFilterDialogProps) {
  const [draft, setDraft] = useState<AuftragFilter>(initialFilter);

  function toggleStatus(value: AuftragStatus) {
    setDraft((prev) => ({
      ...prev,
      status: prev.status.includes(value)
        ? prev.status.filter((s) => s !== value)
        : [...prev.status, value],
    }));
  }

  function toggleArt(value: string) {
    setDraft((prev) => ({
      ...prev,
      art: prev.art.includes(value)
        ? prev.art.filter((a) => a !== value)
        : [...prev.art, value],
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[10px] p-6 w-[440px] shadow-lg">
        <DialogTitle className="text-[18px] font-bold text-dark-surface mb-5">
          Filter
        </DialogTitle>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide mb-2">
              Status
            </p>
            <div className="flex flex-col gap-2">
              {STATUS_LABELS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.status.includes(value)}
                    onChange={() => toggleStatus(value)}
                    className="w-4 h-4 accent-blue-primary"
                  />
                  <span className="text-[14px] text-dark-surface">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-muted uppercase tracking-wide mb-2">
              Auftragsart
            </p>
            <div className="flex flex-col gap-2">
              {ART_OPTIONS.map((art) => (
                <label key={art} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.art.includes(art)}
                    onChange={() => toggleArt(art)}
                    className="w-4 h-4 accent-blue-primary"
                  />
                  <span className="text-[14px] text-dark-surface">{art}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <button
              type="button"
              onClick={() => setDraft(initialFilter)}
              className="px-4 py-2 rounded-[8px] border border-gray-border text-dark-surface text-[14px] font-medium hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={() => { onApply(draft); onOpenChange(false); }}
            className="px-4 py-2 rounded-[8px] bg-blue-primary text-white text-[14px] font-medium hover:bg-blue-primary/80 transition-colors"
          >
            Anwenden
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Schritt 3 — `src/components/features/AuftragListView.tsx` anpassen

Neue Props ergänzen:

```ts
interface AuftragListViewProps {
  aufträge: Auftrag[];
  activeTab: AuftragTab;
  onTabChange: (tab: AuftragTab) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRowClick?: (id: string) => void;
  onNeuErstellen?: () => void;
  filter?: AuftragFilter;          // NEU
  onFilterOpen?: () => void;       // NEU
  onFilterRemove?: (key: keyof AuftragFilter) => void;  // NEU
}
```

Filterlogik in `AuftragListView` erweitern (nach Tab- und Such-Filter):

```tsx
.filter((a) => {
  if (filter?.status.length && !filter.status.includes(a.status)) return false;
  if (filter?.art.length && !filter.art.includes(a.art)) return false;
  return true;
})
```

Filter-Badge-Zeile nach dem ersten `<hr>` einfügen (analog zu EreignisListView):

```tsx
<div className="flex items-center gap-2 py-2">
  {filter?.status.length ? (
    <FilterBadge
      header="Status:"
      text={filter.status.join(", ")}
      variant="selected"
      onRemove={() => onFilterRemove?.("status")}
    />
  ) : (
    <FilterBadge header="Status:" text="alle" variant="auto-width" />
  )}
  {filter?.art.length ? (
    <FilterBadge
      header="Art:"
      text={filter.art.join(", ")}
      variant="selected"
      onRemove={() => onFilterRemove?.("art")}
    />
  ) : (
    <FilterBadge header="Art:" text="alle" variant="auto-width" />
  )}
  <div className="ml-auto flex items-center gap-2">
    <button
      type="button"
      onClick={onFilterOpen}
      className="inline-flex items-center gap-1.5 h-[27px] px-3 rounded-[4px] bg-[rgba(20,106,161,0.1)] text-[#146AA1] font-semibold text-[15px]"
    >
      neuer Filter
      <PlusIcon />
    </button>
  </div>
</div>
<hr className="border-t border-[#9A9EA0]" />
```

### Schritt 4 — `src/app/(protected)/auftraege/page.tsx` anpassen

Zusätzlich zu CR-01-Änderungen (Dialog + useState für aufträge):

```tsx
import { AuftragFilterDialog } from "@/components/features/AuftragFilterDialog";
import { EMPTY_AUFTRAG_FILTER, type AuftragFilter } from "@/types/auftrag";

// In AuftragPageContent:
const [auftragsFilter, setAuftragsFilter] = useState<AuftragFilter>(EMPTY_AUFTRAG_FILTER);
const [filterOpen, setFilterOpen] = useState(false);
```

JSX erweitern:

```tsx
<>
  <main className="px-14 pt-16">
    <h1 className="text-[42px] font-bold mb-15.75">Aufträge</h1>
    <AuftragListView
      aufträge={aufträge}
      // ...
      filter={auftragsFilter}
      onFilterOpen={() => setFilterOpen(true)}
      onFilterRemove={(key) =>
        setAuftragsFilter((prev) => ({ ...prev, [key]: [] }))
      }
      onNeuErstellen={() => setCreateOpen(true)}
    />
  </main>
  <AuftragErstellenDialog /* ... */ />
  <AuftragFilterDialog
    open={filterOpen}
    onOpenChange={setFilterOpen}
    initialFilter={auftragsFilter}
    onApply={setAuftragsFilter}
  />
</>
```

---

## Hinweise

- **Dialog `asChild`-Prop:** `DialogClose asChild` übergbt den Click-Handler an den Kind-Button ohne eigenes DOM-Element. Wenn die shadcn-Version `asChild` nicht unterstützt, Button direkt als `<DialogClose>` verwenden.
- **`DialogContent` Positionierung:** shadcn zentriert den Dialog standardmäßig via `fixed inset-0 flex items-center justify-center`. Falls nicht, manuell im `className` ergänzen.
- **FD-01 und FD-02 teilen sich das Dialog-Muster:** Bei Abweichungen in der generierten `dialog.tsx` beide Komponenten gleichzeitig anpassen.
- **Import-Reihenfolge CR-01 / FD-02:** Beide modifizieren `auftraege/page.tsx`. CR-01 zuerst abschließen, dann FD-02 darauf aufbauen — niemals gleichzeitig editieren.
- **`FilterBadge` Import in AuftragListView:** `FilterBadge` ist in `EreignisListView` importiert, aber noch nicht in `AuftragListView`. Import ergänzen: `import { FilterBadge } from "@/components/ui-custom/FilterBadge";`
