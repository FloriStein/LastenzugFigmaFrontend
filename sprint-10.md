# Sprint 10 — Dark Mode, Aufträge-Navigation & UX-Verbesserungen

> **Status: ✅ Abgeschlossen** — Implementierung + Tests vollständig

## Ziel

Dark Mode funktional verdrahten, AuftraegePage vollständig machen (Layout, Navigation, URL-Tab-Sync) und zwei UX-Gaps schließen (Stornieren-Bestätigung, Sidebar Mitarbeiter).

Tests kommen **nach** der Implementierung — dieses Dokument enthält keine Testblöcke.

## Scope

| # | Ticket | Beschreibung | Zieldatei(en) |
|---|--------|--------------|---------------|
| 1 | DM-01 | Dark Mode verdrahten | `einstellungen/page.tsx` + `statistiken/page.tsx` |
| 2 | NA-01 | AuftraegePage vollständig | `auftraege/page.tsx` |
| 3 | QA-01 | Stornieren-Bestätigung (Inline) | `AuftragAktionsleiste.tsx` |
| 4 | SB-01 | Sidebar Mitarbeiter — Anzeigetafel | `Sidebar.tsx` |

## Abhängigkeiten / Vorbereitung

- Keine neuen npm-Packages nötig (`next-themes` bereits installiert, `useTheme` sofort nutzbar)
- Keine neuen shadcn-Komponenten nötig

## Implementierungsreihenfolge

1. SB-01 (einfach, eigenständig — gutes Warm-up)
2. QA-01 (eigenständig, Medium)
3. NA-01 (Medium, braucht keinen DM-Stand)
4. DM-01 (komplex, baut auf bestehendem Panel-Pattern von Sprint 9 auf)

---

## Ticket 1 — DM-01: Dark Mode verdrahten

**Figma:** `510:21530` (Einstellungen Dark Mode Screen)

### Ausgangslage

Die CSS-Variablen für `.dark` sind bereits vollständig in `globals.css` definiert (`--background → oklch(0.21 0.02 261)` ≈ `#2A2F3B`, `--foreground → oklch(0.985 0 0)` ≈ weiß). `ThemeProvider` ist aktiv. Es fehlt nur die Verdrahtung.

Zwei Probleme:

1. Der Theme-Select in Einstellungen ist statisch (`defaultValue="hell"`) — er ruft `useTheme()` nie auf, das Theme wechselt nicht.
2. Panel-Wrapper in Einstellungen und Statistiken verwenden `bg-white` (hard-kodiert) statt `bg-background` (CSS-Variable, die im Dark-Modus automatisch auf die dunkle Farbe wechselt).

### Änderung 1 — `src/app/(protected)/einstellungen/page.tsx`

Import ergänzen:

```tsx
import { useTheme } from "next-themes";
```

Im `Panel`-Helper `bg-white` → `bg-background`:

```tsx
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-background rounded-[10px] p-6 flex flex-col gap-6">
```

Im `EinstellungenPage`-Body `useTheme` aufrufen und den Theme-Select-Block ersetzen:

```tsx
export default function EinstellungenPage() {
  const { theme, setTheme } = useTheme();
  const [lautstärke, setLautstärke] = useState(48);
  // … Rest der State-Deklarationen unverändert
```

Den Theme-Select (aktuell `defaultValue="hell"`) ersetzen durch:

```tsx
<Select value={theme ?? "light"} onValueChange={(v) => v !== null && setTheme(v)}>
  <SelectTrigger className="w-40">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Hell</SelectItem>
    <SelectItem value="dark">Dunkel</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
```

### Änderung 2 — `src/app/(protected)/statistiken/page.tsx`

Im `Panel`-Helper identische Änderung: `bg-white` → `bg-background`.

Das `Panel`-Interface und die übrigen Props bleiben unverändert.

### Keine Änderung nötig

- `anzeigetafel/page.tsx`: nutzt `bg-dark-surface` / `bg-[#E6E6E6]` — keine weißen Panels.
- `auftraege/[id]/page.tsx`: kein Panel-Wrapper, kein `bg-white`.
- Root Layout und `body { @apply bg-background ... }` übernehmen den Seitenhintergrund automatisch.

### Funktionsweise

`bg-background` wechselt via CSS-Variable zwischen `oklch(1 0 0)` (weiß, Light-Mode) und `oklch(0.21 0.02 261)` (~`#2A2F3B`, Dark-Mode). Die `body`-Regel in `globals.css` sorgt dafür, dass der gesamte Seitenhintergrund mitzieht. `text-foreground` (schwarz ↔ weiß) ist in allen shadcn-Komponenten bereits gesetzt.

---

## Ticket 2 — NA-01: AuftraegePage vollständig

**Datei:** `src/app/(protected)/auftraege/page.tsx`

### Drei bestehende Probleme

| Problem | Ist | Soll |
|---------|-----|------|
| Padding | `p-6 bg-white min-h-screen` auf `<div>` | `px-14 pt-16` auf `<main>` wie alle anderen Seiten |
| h1-Größe | `text-[24px]` | `text-[42px]` |
| Navigation | kein `onRowClick` | `router.push(\`/auftraege/${id}\`)` |
| URL-Tab-Sync | kein `useSearchParams` | `?tab=offen` / `?tab=archiv` lesen |

### Vollständige neue Version

```tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function AuftragPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: AuftragTab =
    tabParam === "offen" || tabParam === "archiv" ? tabParam : "alle";
  const [activeTab, setActiveTab] = useState<AuftragTab>(initialTab);
  const [searchValue, setSearchValue] = useState("");

  return (
    <main className="px-14 pt-16">
      <h1 className="text-[42px] font-bold mb-15.75">Aufträge</h1>
      <AuftragListView
        aufträge={MOCK_AUFTRÄGE}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onRowClick={(id) => router.push(`/auftraege/${encodeURIComponent(id)}`)}
      />
    </main>
  );
}

export default function AuftraegePage() {
  return (
    <Suspense>
      <AuftragPageContent />
    </Suspense>
  );
}
```

### Hinweise

- `encodeURIComponent(id)` ist konsistent mit EreignissePage (IDs können Sonderzeichen haben).
- Das Muster (innere Content-Komponente + äußerer Suspense-Wrapper) ist identisch mit RF-06 aus Sprint 8 — keine neue Erfindung.
- `mb-15.75` für den h1-Abstand ist der kanonische Wert analog zur Ereignisse-Seite.

---

## Ticket 3 — QA-01: Stornieren-Bestätigung in AuftragAktionsleiste

**Datei:** `src/components/features/AuftragAktionsleiste.tsx`

### Problem

Der "Auftrag stornieren"-Button führt in einem echten Logistik-System eine destruktive Aktion aus. Eine versehentliche Berührung sollte keinen Auftrag stornieren. Die Bestätigung wird als Inline-Toggle ohne Dialog-Overlay implementiert — kein neues shadcn-Package nötig.

### Vollständige neue Version

```tsx
"use client";

import { useState } from "react";

interface AuftragAktionsleistenProps {
  onBearbeiten: () => void;
  onStornieren: () => void;
}

export function AuftragAktionsleiste({ onBearbeiten, onStornieren }: AuftragAktionsleistenProps) {
  const [bestätigen, setBestätigen] = useState(false);

  return (
    <div
      className="flex items-center gap-4 rounded-[10px] px-6 py-4"
      style={{ background: "rgba(158, 172, 182, 0.1)" }}
    >
      <button
        onClick={onBearbeiten}
        className="bg-blue-primary text-white rounded-[8px] px-5 py-2 font-medium text-[15px] hover:bg-blue-primary/80 transition-colors"
      >
        Auftrag bearbeiten
      </button>

      {!bestätigen ? (
        <button
          onClick={() => setBestätigen(true)}
          className="bg-red-600 text-white rounded-[8px] px-5 py-2 font-medium text-[15px] hover:bg-red-600/80 transition-colors"
        >
          Auftrag stornieren
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-[14px] text-[#646A79]">Auftrag wirklich stornieren?</span>
          <button
            onClick={() => { onStornieren(); setBestätigen(false); }}
            className="bg-red-600 text-white rounded-[8px] px-4 py-1.5 font-medium text-[14px] hover:bg-red-600/80 transition-colors"
          >
            Ja, stornieren
          </button>
          <button
            onClick={() => setBestätigen(false)}
            className="border border-gray-300 text-dark-surface rounded-[8px] px-4 py-1.5 font-medium text-[14px] hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      )}
    </div>
  );
}
```

### Props-Interface

Unverändert — die Bestätigungslogik ist intern. `onStornieren` wird erst nach der zweiten Bestätigung aufgerufen. `setBestätigen(false)` nach `onStornieren()` setzt den Zustand zurück falls die Komponente weiter gerendert wird.

### Hinweis

Die Komponente wird von `"use client"` auf Dateiebene markiert — bisher war das nicht nötig (keine State), jetzt schon (useState).

---

## Ticket 4 — SB-01: Sidebar Mitarbeiter — Anzeigetafel-Link

**Datei:** `src/components/layout/Sidebar.tsx`

### Problem

Laut Design-Audit (Benutzerrollen-Matrix) hat die Mitarbeiter-Rolle Zugriff auf "Aufträge MA" und "Anzeigetafel". Aktuell enthält `NAV_CONFIG.mitarbeiter` nur Aufträge und Linien — der Anzeigetafel-Link fehlt.

### Neues Icon (in `Sidebar.tsx` einfügen, nach `IconLinien`)

```tsx
function IconAnzeigetafel() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="19" height="11" rx="1.5" stroke="white" strokeWidth="1" />
      <path d="M7 12v3M13 12v3M5 15h10" stroke="white" strokeWidth="1" strokeLinecap="round" />
      <path d="M4 4h12M4 7.5h8" stroke="white" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
```

### Update `NAV_CONFIG.mitarbeiter`

```tsx
mitarbeiter: [
  { label: "Aufträge",     href: "/auftraege",    icon: <IconAuftraege /> },
  { label: "Anzeigetafel", href: "/anzeigetafel", icon: <IconAnzeigetafel /> },
  { label: "Linien",       href: "/linien",       icon: <IconLinien /> },
],
```

Reihenfolge: Aufträge → Anzeigetafel → Linien entspricht dem primären Workflow eines Mitarbeiters (Auftrag annehmen, Tafel prüfen, Linie nachschlagen).
