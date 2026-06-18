# Sprint 3 — Erster vollständiger Screen: Ereignisansicht

**Session-Einstieg:** Lies dieses Dokument vollständig bevor du irgendwas tust.
Alle Figma-Specs sind bereits extrahiert — kein MCP-Aufruf nötig für diese Tickets.

---

## Kontext

Industrielles Logistik-Management für Routenzüge. Stack: Next.js 16, TypeScript strict,
Tailwind v4, shadcn/ui v4.11. Figma-Datei: `6iHSHiZwZ7ouNQ3KVUy6OK`.

Relevante Dokumente:
- `BRIEFING.md` — Gesamtüberblick, Architekturentscheidungen
- `backlog.md` — Alle 47 Tickets mit Schichten AT/MO/OR/TM/SC
- `sprint-1.md` — Sprint 1 ✅ (AT-01..05, MO-01..03)
- `sprint-2.md` — Sprint 2 ✅ (OR-01..02, TM-01..02, TS-00..03)

**Projektstand nach Sprint 3:**

| Layer | Abgeschlossen |
|---|---|
| Atoms | PrioritätBadge, StatusBadge, FilterBadge, ListHeader, SearchBar, Tab (CSS) |
| Molecules | NavItem, UserCard, EreignisListRow |
| Organisms | Sidebar, SidebarKarte, EreignisListView |
| Templates | ProtectedShell (role-aware layout.tsx), KarteShell |
| Screens | Ereignisansicht (`/ereignisse`) |
| Tests | 60 Tests grün (27 neue in Sprint 3) |
| Routing | Alle Route-Gruppen zu `(protected)` konsolidiert — kein Next.js-16-Konflikt mehr |

**Vorhandene Dateien die in Sprint 3 genutzt werden:**
- `components/layout/SidebarWrapper.tsx` — "use client", role-prop
- `components/ui-custom/SearchBar.tsx`, `FilterBadge.tsx`, `ListHeader.tsx`
- `components/ui-custom/PrioritätBadge.tsx`, `StatusBadge.tsx`
- `app/(operator)/layout.tsx` — bindet SidebarWrapper role="operator" ein

---

## Sprint-Scope (3 Tickets)

| ID | Name | Datei | Status |
|---|---|---|---|
| MO-04 | EreignisListRow | `components/features/EreignisListRow.tsx` | ✅ Fertig |
| OR-08 | EreignisListView | `components/features/EreignisListView.tsx` | ✅ Fertig |
| SC-03 | Ereignisansicht | `app/(protected)/ereignisse/page.tsx` | ✅ Fertig |

**Implementierungsreihenfolge:** MO-04 → OR-08 → SC-03

---

## Konventionen (nicht vergessen)

- Kein Default Export außer bei Next.js Page/Layout-Dateien
- Props-Interface direkt über der Komponente
- Keine Kommentare außer wenn das Warum nicht offensichtlich ist
- `cn()` aus `@/lib/utils`
- Mock-Daten direkt in der Page-Datei definieren — kein separates `data/`-Verzeichnis

---

## Shared Types

Beide Komponenten MO-04 und OR-08 brauchen denselben `Ereignis`-Typ. Da es mehr
als 5 geteilte Typen werden könnten (Aufträge kommen in Sprint 4), jetzt `src/types/`
anlegen:

**`src/types/ereignis.ts`** (neu anlegen):
```ts
export type EreignisStatus =
  | "neu"
  | "in-bearbeitung"
  | "warten"
  | "abgeschlossen";

export interface Ereignis {
  id: string;
  art: string;
  fahrzeug: string;
  status: EreignisStatus;
  bearbeiter?: string;
  priorität: 1 | 2 | 3 | 4;
  erstelltAt: string;
}
```

---

## MO-04 — EreignisListRow

**Figma:** Component Set `#47:169` — Template `EL-80d30c45`, in `#501:17243` verwendet.
3 Varianten: `Style=neu/warten` (aktiv), `Style=in Bearbeitung`, `Style=zu` (geschlossen)

### Visuell

Zeilenmaße: `w-full h-[48px]`, `bg-[rgba(158,172,182,0.1)]`, `border-radius: 10px`

**Farbzustände:**
| Variante | Texte | Einsatz |
|---|---|---|
| aktiv (`neu`, `warten`) | `#000000` | status=neu / status=warten |
| gedimmt (`in-bearbeitung`, `abgeschlossen`) | `#646A79` | status=in-bearbeitung / status=abgeschlossen |

Bearbeiter-Feld: wenn `bearbeiter` undefined → Text `[offen]` in `#9A9EA0`

**Spalten-Layout** (Grid, Gesamt 1542px, y-zentriert in 48px):

| Spalte | x-Offset | Inhalt | Typografie |
|---|---|---|---|
| ID | 23px | `#103` | Inter Medium 500, 15px |
| Ereignisart | 176px | z.B. `Strecke blockiert` | Inter Medium 500, 15px |
| Fahrzeug | 476px | z.B. `Routenzug A` | Inter Medium 500, 15px |
| Status | 703px | z.B. `neu` (Plaintext, kein Badge) | Inter Medium 500, 15px |
| Bearbeiter | 931px | Name oder `[offen]` | Inter Medium 500, 15px |
| Priorität | 1156px | `<PrioritätBadge>` 80×14px | — |
| Erstellt | 1382px | z.B. `14:28 Uhr` | Inter Medium 500, 15px |

**Grid-Klassen:**
```
grid grid-cols-[153px_300px_227px_228px_225px_226px_1fr] items-center h-[48px]
```

### Props-Interface

```ts
interface EreignisListRowProps {
  id: string;
  art: string;
  fahrzeug: string;
  status: EreignisStatus;
  bearbeiter?: string;
  priorität: 1 | 2 | 3 | 4;
  erstelltAt: string;
  onClick?: () => void;
}
```

### Implementierung

- Kein shadcn — natives `<div>` mit Grid
- `PrioritätBadge` aus `@/components/ui-custom/PrioritätBadge` importieren
- Farbzustand per `cn()`: aktiv = `text-black`, gedimmt = `text-[#646A79]`
- Bearbeiter-Sonderfall: `bearbeiter ?? <span className="text-[#9A9EA0]">[offen]</span>`
- `onClick` → ganzer Row ist klickbar (cursor-pointer, hover-Effekt dezent)

### Datei-Referenz

Neu anlegen: [EreignisListRow.tsx](src/components/features/EreignisListRow.tsx)

---

## OR-08 — EreignisListView

**Figma:** Screen `#516:19538` (Ereignisansicht mit Filter) und `#501:17241`

### Aufbau (Top → Bottom)

```
[Tabs: Alle | Offen | Archiv]          [SearchBar 353×32px]
─────────────────────────────────────────────────────────── (1px #9A9EA0)
[FilterBadge "Status: ..."] [FilterBadge "Fahrzeug: ..."]  [neuer Filter btn] [Ansicht speichern btn]
─────────────────────────────────────────────────────────── (1px #9A9EA0)
[ListHeader: ID | Ereignisart | Fahrzeug | Status | Bearbeiter | Priorität | Erstellt]
[EreignisListRow × n]
```

### Tabs

Drei Tabs per shadcn `<Tabs>` (CSS-Override bereits in globals.css):
- Labels: `"Alle"`, `"Offen"`, `"Archiv"`
- Werte: `"alle"`, `"offen"`, `"archiv"`
- Default aktiv: `"alle"`

### Toolbar (zweite Zeile nach Divider)

| Element | Figma | Maße | Farben |
|---|---|---|---|
| FilterBadge(s) | `#516:19752` | auto-width, h:27px | bg `#E5E5E5` |
| "neuer Filter"-Button | `#516:19750` | 138×27px | bg `rgba(20,106,161,0.1)`, text+icon `#146AA1`, SemiBold 600, 15px, radius 4px |
| "als Ansicht speichern" | `#516:19751` | 215×27px | gleiche Farben wie "neuer Filter" |

Der "neuer Filter"-Button hat ein Plus-Icon (14×14px, `#146AA1`) rechts.
"als Ansicht speichern" hat ein Speichern-Icon (16×16px, `#146AA1`) rechts.
Für Sprint 3: Buttons ohne Funktionalität (onClick = no-op), Filter-Badges als statische Demo.

### Column Headers (ListHeader-Zeile)

Aus `#516:19558`–`#516:19565` — Reihenfolge und Labels:

| x-Offset (relativ zur Content-Area) | Label |
|---|---|
| 0px | Ereignis-ID |
| 152px | Ereignisart |
| 453px | Fahrzeug |
| 680px | Status |
| 908px | Bearbeiter |
| 1132px | Priorität |
| 1359px | Erstellt |

Header-Row als `<div className="relative h-[18px]">` mit absolut positionierten
`<ListHeader>`-Instanzen, oder als Grid mit denselben Spalten wie EreignisListRow:

```
grid grid-cols-[153px_300px_227px_228px_225px_226px_1fr]
```

### Divider-Linien

Zwei horizontale Trennlinien (je 1px, Farbe `#9A9EA0`):
- Nach Tab-Zeile / vor Toolbar: `<hr className="border-t border-[#9A9EA0]" />`
- Nach Toolbar / vor Column Headers: gleich

### Props-Interface

```ts
interface EreignisListViewProps {
  ereignisse: Ereignis[];
  activeTab: "alle" | "offen" | "archiv";
  onTabChange: (tab: "alle" | "offen" | "archiv") => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}
```

### Implementierung

- shadcn `<Tabs>` für die Tab-Leiste (Tab-CSS-Override aus Sprint 2 greift)
- `SearchBar` aus `@/components/ui-custom/SearchBar`
- `FilterBadge` aus `@/components/ui-custom/FilterBadge` (2 Demo-Badges: Status, Fahrzeug)
- `ListHeader` aus `@/components/ui-custom/ListHeader` (sort=none für alle in Sprint 3)
- `EreignisListRow` aus `@/components/features/EreignisListRow`
- Tab-Filterung: filtere `ereignisse` nach `status` wenn Tab ≠ "alle"
  - `"offen"` → status `"neu"` oder `"warten"`
  - `"archiv"` → status `"abgeschlossen"`
- Suchfilterung: filtere nach `art` oder `fahrzeug` (case-insensitive `includes`)

### Datei-Referenz

Neu anlegen: [EreignisListView.tsx](src/components/features/EreignisListView.tsx)

---

## SC-03 — Ereignisansicht (Page)

**Figma:** `#501:17241` + `#516:19538`
**Datei:** `src/app/(operator)/ereignisse/page.tsx` (existiert, ausfüllen)

### Layout

```
<main class="px-[56px] pt-[64px]">
  <h1 class="text-[42px] font-bold text-black mb-[109px]">Ereignisse</h1>
  <EreignisListView ... />
</main>
```

Abstände aus Figma:
- Content-Padding links: 56px (322px Screen-x minus 266px Sidebar = 56px)
- Titel y: 64px → `pt-[64px]`
- Abstand Titel → Tab-Bar: Tab-Bar bei y:177, Titel bei y:64+50px Text ≈ y:114 → gap ~63px

Vereinfacht für Sprint 3: `pt-16 px-14` (Tailwind-Kanonisierung).

### Mock-Daten (in der Page-Datei direkt)

```ts
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
```

### State-Management

Page ist `"use client"` — braucht `useState` für Tab und Suche:
```ts
const [activeTab, setActiveTab] = useState<"alle" | "offen" | "archiv">("alle");
const [search, setSearch] = useState("");
```

### Datei-Referenz

Ausfüllen: [page.tsx](src/app/(operator)/ereignisse/page.tsx)

---

## Verifikation

```bash
# TypeScript-Check (muss 0 Fehler zeigen)
npx tsc --noEmit

# Tests (dürfen nicht brechen)
npm run test:run

# Dev-Server
npm run dev
# → http://localhost:3000/ereignisse aufrufen
```

**Manuelle Checks:**
- [ ] Titel "Ereignisse" (42px Bold) sichtbar
- [ ] 3 Tabs: Alle (aktiv, blauer Unterstrich), Offen, Archiv
- [ ] SearchBar rechts neben Tabs, funktioniert (live filter)
- [ ] 2 Demo-FilterBadges in Toolbar sichtbar
- [ ] 7 Spalten-Header mit ListHeader-Komponente
- [ ] 7 Mock-Zeilen rendern ohne Fehler
- [ ] Aktive Zeilen (neu/warten) = schwarzer Text
- [ ] Gedimmte Zeilen (in-bearbeitung/abgeschlossen) = grauer Text
- [ ] Zeilen ohne `bearbeiter` zeigen `[offen]` in Grau
- [ ] Tab "Offen" filtert auf status=neu/warten (4 Zeilen)
- [ ] Tab "Archiv" filtert auf status=abgeschlossen (1 Zeile)
- [ ] Suche filtert nach art und fahrzeug

---

## Nächste Session (Sprint 4)

Nach Sprint 3 weitermachen mit:
- **MO-05 — RoutenzugCard** (für Karte-Panel)
- **OR-09 — RoutenzugListPanel** (sliding panel, nutzt RoutenzugCard)
- **OR-10 — MapCanvas** (Leaflet, CRS.Simple, KarteIcon-Platzhalter)
- **SC-02 — Kartenansicht** (erster Map-Screen, nutzt KarteShell aus Sprint 2)

Figma-Refs für Sprint 4:
- Routenzug-Panel: `#508:19030`
- Routenzug-Card: `#508:19036`
- Kartenansicht-Screen: `#508:18941`
- Kartenansicht mit Suche: `#508:18664`
- KarteIcon Component Set: `#118:1198`
