# Sprint 4 — Kartenansicht

**Session-Einstieg:** Lies dieses Dokument vollständig bevor du irgendwas tust.
Alle Figma-Specs sind bereits extrahiert — kein MCP-Aufruf nötig für diese Tickets.

---

## Kontext

Industrielles Logistik-Management für Routenzüge. Stack: Next.js 16, TypeScript strict,
Tailwind v4, shadcn/ui v4.11. Figma-Datei: `6iHSHiZwZ7ouNQ3KVUy6OK`.

Relevante Dokumente:
- `BRIEFING.md` — Gesamtüberblick, Architekturentscheidungen
- `backlog.md` — Alle 47 Tickets mit Schichten AT/MO/OR/TM/SC
- `sprint-3.md` — Sprint 3 ✅ (MO-04, OR-08, SC-03)
- `decisions.md` — Entscheidung #1: react-leaflet mit CRS.Simple

**Projektstand nach Sprint 3:**

| Layer | Abgeschlossen |
|---|---|
| Atoms | PrioritätBadge, StatusBadge, FilterBadge, ListHeader, SearchBar, Tab (CSS) |
| Molecules | NavItem, UserCard, EreignisListRow |
| Organisms | Sidebar, SidebarKarte, EreignisListView |
| Templates | ProtectedShell (role-aware), KarteShell |
| Screens | Ereignisansicht (`/ereignisse`) |
| Tests | 60 Tests grün |
| Routing | Alle Routes unter `(protected)/` — kein Parallelkonflikt |

**Vorhandene Dateien die in Sprint 4 genutzt werden:**
- `components/layout/KarteShell.tsx` — SidebarKarte + main area
- `components/ui-custom/StatusBadge.tsx` — für RoutenzugCard
- `app/(protected)/karte/page.tsx` — existiert als Stub, ausfüllen

---

## Sprint-Scope (5 Tickets)

| ID | Name | Datei | Status |
|---|---|---|---|
| AT-08 | KarteIcon | `components/features/KarteIcon.tsx` | Neu |
| MO-05 | RoutenzugCard | `components/features/RoutenzugCard.tsx` | Neu |
| OR-09 | RoutenzugListPanel | `components/features/RoutenzugListPanel.tsx` | Neu |
| OR-10 | MapCanvas | `components/features/MapCanvas.tsx` | Neu |
| SC-02 | Kartenansicht | `app/(protected)/karte/page.tsx` | Stub, ausfüllen |

**Implementierungsreihenfolge:** AT-08 → MO-05 → OR-09 → OR-10 → SC-02

---

## Konventionen (nicht vergessen)

- Kein Default Export außer bei Next.js Page/Layout-Dateien
- Props-Interface direkt über der Komponente
- Keine Kommentare außer wenn das Warum nicht offensichtlich ist
- `cn()` aus `@/lib/utils`
- Mock-Daten direkt in der Page-Datei definieren — kein separates `data/`-Verzeichnis
- `MapCanvas` muss SSR-disabled sein (Leaflet läuft nicht im Node-Kontext)

---

## Shared Types

**`src/types/routenzug.ts`** (neu anlegen):

```ts
import type { StatusBadgeType } from "@/types/statusBadge";

export type FahrtStatus = Extract<
  StatusBadgeType,
  "fahrt-unterbrochen" | "fährt-automatisiert" | "lädt"
>;

export interface Routenzug {
  id: string;
  name: string;
  aufträge: string[];
  status: FahrtStatus;
  ladestand?: number;    // 0–100, nur wenn status="lädt"
  position: { x: number; y: number };
}
```

> **Hinweis zu `StatusBadgeType`:** Falls der StatusBadge kein eigenes exportiertes Type hat,
> die FahrtStatus-Union manuell ausschreiben:
> `export type FahrtStatus = "fahrt-unterbrochen" | "fährt-automatisiert" | "lädt";`

---

## AT-08 — KarteIcon

**Figma:** Component Set `#118:1198`

### Varianten

| Prop-Wert | Figma-Name | Größe | Farbe | Bedeutung |
|---|---|---|---|---|
| `routenzug` | Property 1=routenzug | 28×31px | `#2A2F3B` | Fahrzeug normal |
| `routenzug-selected` | Property 1=routenzug selected | 28×31px | `#146AA1` | Fahrzeug ausgewählt |
| `routenzug-problem` | Property 1=routenzug problem | 28×31px | `#C55141` | Fahrzeug mit Problem |
| `rsu` | Property 1=rsu | 36×40px | (SVG-intern) | RSU-Station |
| `kamera` | Property 1=kamera | 36×40px | (SVG-intern) | Kamera |

### Props-Interface

```ts
interface KarteIconProps {
  variant: "routenzug" | "routenzug-selected" | "routenzug-problem" | "rsu" | "kamera";
}
```

### Implementierung

Jede Variante ist ein inline SVG. Die `routenzug`-Familie nutzt denselben Pfad in
unterschiedlichen Farben (Pin-Form). `rsu` und `kamera` haben eigene Formen.

```tsx
// Routenzug: Pin-Form 28×31px
// Für Sprint 4: stilisierter Pfeil als Platzhalter
// SVG viewBox="0 0 28 31"
// Pfad: abgerundeter Pin (Kreis oben + Dreieck unten)

// RSU: 36×40px
// Für Sprint 4: Quadrat mit Antenne als Platzhalter

// Kamera: 36×40px
// Für Sprint 4: Linse-Icon als Platzhalter
```

**Sprint-4-Strategie:** Keine exakten Figma-SVG-Pfade nötig — gut erkennbare
geometrische Platzhalter-SVGs reichen. In Sprint 5 durch echte Exports ersetzt.

### Datei-Referenz

Neu anlegen: [KarteIcon.tsx](src/components/features/KarteIcon.tsx)

---

## MO-05 — RoutenzugCard

**Figma:** `#508:19036` (in Panel `#508:19030` bei y:140, y:271, y:402)

### Visuell

Maße: `437×111px`, `bg-[rgba(255,255,255,0.9)]`, `rounded-[10px]`

**Layout (absolut innerhalb der Card):**

| Element | Position | Größe | Typografie | Inhalt |
|---|---|---|---|---|
| Name | x:23, y:12 | 126×24 | Inter Bold 700, 20px, `#000000` | z.B. `Routenzug A` |
| StatusBadge | x:228, y:10 | 195×27 | — | `<StatusBadge type={status} ...>` |
| Aufträge | x:23, y:68 | 234×24 | Inter Medium 500, 20px | z.B. `Lieferungen: #212, #209` |

**Aufträge-Zeile:**
- `aufträge.length > 0` → `"Lieferungen: #212, #209"` in `#000000`
- `aufträge.length === 0` → `"keine Lieferungen"` in `#353535`

**StatusBadge-Mapping** (aus bestehender StatusBadge-Komponente):
| `status` | `StatusBadge type` | Farbe |
|---|---|---|
| `fahrt-unterbrochen` | `"fahrt-unterbrochen"` | `#C55141` |
| `fährt-automatisiert` | `"fährt-automatisiert"` | `#51A135` |
| `lädt` | `"lädt"` mit `percent={ladestand}` | `#2D5D7B` |

### Props-Interface

```ts
interface RoutenzugCardProps {
  name: string;
  aufträge: string[];
  status: FahrtStatus;
  ladestand?: number;
  onClick?: () => void;
}
```

### Implementierung

- Natives `<div>` mit `relative` Positionierung (keine Grid/Flex, exakte Offsets via `absolute`)
- `StatusBadge` aus `@/components/ui-custom/StatusBadge` importieren
- `onClick` → ganze Card klickbar (`cursor-pointer`, dezenter Hover)

### Datei-Referenz

Neu anlegen: [RoutenzugCard.tsx](src/components/features/RoutenzugCard.tsx)

---

## OR-09 — RoutenzugListPanel

**Figma:** `#508:19030` (Teil des Kartenansicht-Screens)

### Visuell

```
[Panel 505×1080px, bg #353B4A]
┌──────────────────────────────────────┐
│  ←  (close, x:442, y:27, 28×28px)   │
│  Routenzüge  (x:34, y:55, 32px Bold)│
│                                      │
│  [RoutenzugCard] (x:34, y:140)       │
│  [RoutenzugCard] (x:34, y:271)       │
│  [RoutenzugCard] (x:34, y:402)       │
│  ...                                 │
└──────────────────────────────────────┘
```

Abstand zwischen Cards: `y:140 → y:271 → y:402` = jeweils **131px** ab Oberkante
(Card-Höhe 111px + 20px gap)

### Close-Button (Pfeil-Icon)

Position: x:442, y:27 in Panel (= rechts oben).
Figma-Element: "Subtract" SVG-Icon, Farbe `rgba(255, 255, 255, 0.62)`, 28×28px.
Für Sprint 4: `←` Chevron-Icon als Platzhalter, gleiche Farbe.

### Props-Interface

```ts
interface RoutenzugListPanelProps {
  routenzüge: Routenzug[];
  onSelect: (id: string) => void;
  onClose?: () => void;
}
```

### Implementierung

- Natives `<div>` mit `w-[505px] h-screen flex-shrink-0 bg-[#353B4A] relative`
- Header: `<h2>` mit "Routenzüge", Inter Bold 32px, `text-white`, `absolute left-[34px] top-[55px]`
- Close-Button: `absolute right-[34px] top-[27px]` (442px ist x im 505px Panel → 505-442-28 = 35px von rechts)
- Cards: `absolute left-[34px]`, erster Card bei `top-[140px]`, weitere über `top={140 + index * 131}px`
- Sprint 4: kein Slide-Animation (kommt in Sprint 5)

### Datei-Referenz

Neu anlegen: [RoutenzugListPanel.tsx](src/components/features/RoutenzugListPanel.tsx)

---

## OR-10 — MapCanvas

**Figma:** `#508:18941` (Kartenansicht-Screen, Map-Bereich)
**Figma KarteIcon:** `#118:1198`

### Technisches Setup

Leaflet läuft nicht im SSR-Kontext. Der Import in der Page erfolgt via dynamic:

```ts
// In karte/page.tsx:
import dynamic from "next/dynamic";
const MapCanvas = dynamic(
  () => import("@/components/features/MapCanvas").then(m => ({ default: m.MapCanvas })),
  { ssr: false }
);
```

### Leaflet-Konfiguration

```ts
// CRS.Simple: keine Geo-Projektion
// Bounds: [[0, 0], [1080, 1920]] — Figma-Frame-Maße als Koordinatenraum
// Center: [540, 960]
// Zoom: 0 (default), zoomControl: true
// Background: #E4E8E4 (via CSS auf .leaflet-container)
```

### Map-Layer-Aufbau (Sprint 4: Platzhalter)

In Figma liegen die Layer-SVGs (gelände, straßen, gebäude) als IMAGE-SVG-Elemente.
Für Sprint 4 werden diese als **farbige SVGOverlay-Platzhalter** implementiert:

| Layer | Figma-Farbe | Sprint-4-Umsetzung |
|---|---|---|
| gelände | `#EEEEEE` | `<SVGOverlay>` mit solidem Rechteck in `#EEEEEE` |
| straßen | `#FFFFFF` | `<SVGOverlay>` mit gestrichelten weißen Linien |
| gebäude | (SVG-Komponente) | Weggelassen (Sprint 5) |

### KarteIcon-Marker

Fahrzeug-Marker werden als Leaflet `DivIcon` implementiert:

```ts
const routenzugIcon = L.divIcon({
  html: renderToStaticMarkup(<KarteIcon variant="routenzug" />),
  className: "",
  iconSize: [28, 31],
  iconAnchor: [14, 31],
});
```

> Alternativ: `dangerouslySetInnerHTML` via DOM in der Leaflet-Map-Ebene.
> `react-dom/server` steht in Next.js zur Verfügung.

### Fahrzeug-Positionen

Im Figma-Screen bei:
- Routenzug-Icon 1: x:1356, y:626 (Screen-Koordinaten, Offset 92px Sidebar abziehen → Map-x: 1264)
- Routenzug-Icon 2: x:866, y:768

Für Sprint 4: Mock-Positionen aus Page-Datei, konvertiert in Leaflet-LatLng:
`L.latLng(y, x)` bei CRS.Simple (Leaflet dreht y-Achse um).

### Props-Interface

```ts
interface MapCanvasProps {
  routenzüge: Routenzug[];
  selectedId?: string;
  onSelect: (id: string) => void;
}
```

### Implementierung-Hinweise

- `"use client"` am Anfang der Datei
- Leaflet CSS importieren: `import "leaflet/dist/leaflet.css"` (direkt in der Datei)
- `L.CRS.Simple` als `crs`-Prop auf `<MapContainer>`
- `bounds` mit `L.latLngBounds([[0, 0], [1080, 1920]])`
- `<TileLayer>` entfällt — keine Tiles bei CRS.Simple
- `<SVGOverlay>` für Hintergrund-Ebenen
- `<Marker>` mit DivIcon für jedes Fahrzeug

### Datei-Referenz

Neu anlegen: [MapCanvas.tsx](src/components/features/MapCanvas.tsx)

---

## SC-02 — Kartenansicht (Page)

**Figma:** `#508:18941` (Basis) + `#508:18664` (mit Suche)
**Datei:** `src/app/(protected)/karte/page.tsx` (Stub, ausfüllen)

### Layout

```
<KarteShell activeItem="karte">       ← SidebarKarte (92px) + main
  <div class="flex h-full">
    <RoutenzugListPanel ... />         ← 505px, dunkel
    <div class="flex-1 relative">      ← Map-Bereich
      <MapCanvas ... />                ← SSR-disabled
      [SearchOverlay]                  ← Sprint 5 (vorerst weglassen)
    </div>
  </div>
</KarteShell>
```

### Mock-Daten (direkt in der Page-Datei)

```ts
const MOCK_ROUTENZÜGE: Routenzug[] = [
  {
    id: "rz-a",
    name: "Routenzug A",
    aufträge: ["#212", "#209"],
    status: "fahrt-unterbrochen",
    position: { x: 1264, y: 626 },
  },
  {
    id: "rz-b",
    name: "Routenzug B",
    aufträge: ["#210"],
    status: "fährt-automatisiert",
    position: { x: 774, y: 768 },
  },
  {
    id: "rz-c",
    name: "Routenzug C",
    aufträge: [],
    status: "lädt",
    ladestand: 71,
    position: { x: 500, y: 400 },
  },
];
```

### State-Management

Page ist `"use client"` (wegen `useState`):

```ts
const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
```

### Datei-Referenz

Ausfüllen: [karte/page.tsx](src/app/(protected)/karte/page.tsx)

---

## Verifikation

```bash
# TypeScript-Check (muss 0 Fehler zeigen)
npx tsc --noEmit

# Tests (dürfen nicht brechen)
npm run test:run

# Dev-Server
npm run dev
# → http://localhost:3000/karte aufrufen
```

**Manuelle Checks:**
- [ ] SidebarKarte (92px, dunkel) links sichtbar
- [ ] RoutenzugListPanel (505px, dunkel) rechts daneben mit Titel "Routenzüge"
- [ ] 3 RoutenzugCards im Panel mit Namen, Aufträgen und StatusBadge
- [ ] StatusBadge-Farben korrekt: rot/grün/blau je nach Status
- [ ] Leere Auftrags-Liste zeigt "keine Lieferungen" in grau
- [ ] Leaflet-Karte füllt verbleibenden Bereich (bg `#E4E8E4`)
- [ ] 2–3 Routenzug-Marker auf der Karte
- [ ] Karte ist zoom- und panbar
- [ ] Klick auf RoutenzugCard → `selectedId` aktualisiert sich (Marker-Icon wechselt zu `selected`)
- [ ] TypeScript: keine `any`-Typen

---

## Nächste Session (Sprint 5)

Nach Sprint 4 weitermachen mit:
- **SC-07 — Ereignis-Detail** (Klick auf EreignisListRow → Detail-View)
- **OR-03 — EreignisTitelleiste** (blauer Header-Bar, Skeleton existiert)
- **OR-04 — FahrtmodusCard** (Skeleton existiert, `useReducer`-State-Machine)
- **SC-05 — Routenzug-Detail** (3-Panel-Layout: Kamera + FahrtInfo + Aktionen)

Alternativ (wenn Karte Prio hat):
- **MapCanvas-SVG-Layer** — Echte gelände/straßen/gebäude SVGs einbinden
- **SearchOverlay** auf Kartenansicht (`#508:18664`)
- **Routenzug-Slide-Panel** — Einfahrts-Animation für RoutenzugListPanel
