# Sprint 9 — Stub-Seiten ausbauen

## Ziel

Die vier verbleibenden Stub-Seiten durch vollständige Implementierungen ersetzen.
Tests kommen **nach** der Implementierung — dieses Dokument enthält keine Testblöcke.

## Scope

| # | Ticket | Seite | Zieldatei |
|---|--------|-------|-----------|
| 1 | AT-01 | Auftrags-Detail | `src/app/(protected)/auftraege/[id]/page.tsx` |
| 2 | EI-01 | Einstellungen | `src/app/(protected)/einstellungen/page.tsx` |
| 3 | ST-01 | Statistiken | `src/app/(protected)/statistiken/page.tsx` |
| 4 | ANZ-01 | Anzeigetafel | `src/app/(protected)/anzeigetafel/page.tsx` |

## Abhängigkeiten / Vorbereitung

- `recharts` installieren: `npm install recharts`
- Kein neues Layout-File nötig — alle Seiten nutzen das bestehende `(protected)/layout.tsx` mit Sidebar

## Implementierungsreihenfolge

1. AT-01 (höchste Komplexität — neue Komponenten für Timeline und Aktionsleiste)
2. EI-01 (Formularlayout mit bestehenden shadcn-Komponenten)
3. ST-01 (Chart-Integration mit recharts)
4. ANZ-01 (eigenständiges Full-Screen-Design)

---

## Ticket 1 — AT-01: Auftrags-Detail

**Datei:** `src/app/(protected)/auftraege/[id]/page.tsx`
**Figma:** `506:17953`

### Neue Komponenten (in `src/components/features/`)

#### `AuftragDetailHeader.tsx`

Props:
```ts
interface AuftragDetailHeaderProps {
  id: string;
  art: string;
  status: AuftragStatus;
  onBack: () => void;
}
```

Rendert:
- Zurück-Pfeil-Button (`onClick={onBack}`, navigiert zu `/auftraege`)
- Breadcrumb: `<span className="text-black">Aufträge</span> / <span className="text-[#146AA1]">{art} #{id}</span>`
- Status-Badge rechts (grüner Hintergrund für "aktiv", analog zu `PrioritätBadge`)

#### `AuftragDetailFields.tsx`

Props:
```ts
interface AuftragDetailFieldsProps {
  artikel: string;
  start: string;
  ziel: string;
  routenzug: string;
  ankunft: string;
  auftraggeber: string;
  erstellt: string;
  priorität: 1 | 2 | 3 | 4;
}
```

Rendert je Feld: Label (grau, klein) über Wert (schwarz, normal). Priorität als `<PrioritätBadge />`.

#### `AuftragAktionsleiste.tsx`

Props:
```ts
interface AuftragAktionsleistenProps {
  onBearbeiten: () => void;
  onStornieren: () => void;
}
```

Rendert graue Leiste (Hintergrund `rgba(158,172,182,0.1)`) mit zwei Buttons:
- "Auftrag bearbeiten" — blauer Button (`bg-[#146AA1] text-white`)
- "Auftrag stornieren" — roter Button (`bg-red-600 text-white`)

#### `LieferungTimeline.tsx`

Props:
```ts
interface TimelineSchritt {
  label: string;
  zeit: string;
  aktuell?: boolean;
}
interface LieferungTimelineProps {
  schritte: TimelineSchritt[];
}
```

Rendert `<ol>` mit je einem `<li>` pro Schritt. Aktueller Schritt hat blauen Marker (`bg-[#146AA1]`), vergangene Schritte grau, zukünftige weiß mit grauem Rand. Verbindungslinie zwischen den Schritten als vertikale Border.

### Mock-Daten in `page.tsx`

```ts
import type { AuftragStatus } from "@/types/auftrag";

const MOCK_AUFTRAG = {
  id: "212",
  art: "Lieferung",
  artikel: "Karosserieteil #12312 (4 Stk.)",
  start: "Lager B",
  ziel: "Lager A",
  routenzug: "Routenzug A",
  ankunft: "12:10 Uhr (in 12min)",
  auftraggeber: "Alex Auftrag",
  erstellt: "10:50 Uhr",
  priorität: 2 as 1 | 2 | 3 | 4,
  status: "aktiv" as AuftragStatus,
};

const MOCK_TIMELINE: TimelineSchritt[] = [
  { label: "In Auftrag gegeben", zeit: "10:50" },
  { label: "Auftrag verarbeitet", zeit: "10:58" },
  { label: "Scan Beladestation", zeit: "11:18" },
  { label: "Lieferung geladen", zeit: "11:28" },
  { label: "In Auslieferung", zeit: "", aktuell: true },
  { label: "Ankunft voraussichtlich", zeit: "12:10" },
];
```

### Layout der `page.tsx`

```tsx
"use client";

// Zweispaltiges Layout: linke Spalte (Detail) + rechte Spalte (Timeline)
export default function AuftragDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  return (
    <main className="px-14 pt-16">
      <AuftragDetailHeader
        id={MOCK_AUFTRAG.id}
        art={MOCK_AUFTRAG.art}
        status={MOCK_AUFTRAG.status}
        onBack={() => router.push("/auftraege")}
      />
      <div className="flex gap-8 mt-8">
        <div className="flex-1 flex flex-col gap-6">
          <AuftragDetailFields {...MOCK_AUFTRAG} />
          <AuftragAktionsleiste
            onBearbeiten={() => {}}
            onStornieren={() => {}}
          />
          <button className="text-[#146AA1] underline self-start">In Karte anzeigen</button>
        </div>
        <div className="w-[340px]">
          <h2 className="text-[20px] font-semibold mb-4">Lieferungsverlauf</h2>
          <LieferungTimeline schritte={MOCK_TIMELINE} />
        </div>
      </div>
    </main>
  );
}
```

---

## Ticket 2 — EI-01: Einstellungen

**Datei:** `src/app/(protected)/einstellungen/page.tsx`
**Figma:** `510:21086`

### Aufbau

Seitentitel: "Einstellungen" (h1, 42px bold)

Zweispaltiges Layout: linkes Panel "Programm" + rechtes Panel "Tastaturkürzel".
Darunter volles Panel "Sound".

### Linkes Panel — Programm

Sektion **Hilfen** (`<h2>Hilfen</h2>`):
- Toggle-Zeile mit `<Switch />` (shadcn): "Erweiterte Erklärungen für Bedienelemente"
- Toggle-Zeile mit `<Switch />` (shadcn): "Hinweise zu Tastaturkürzeln"

Sektion **Aussehen**:
- `<Select>` (shadcn): Label "Theme", Optionen: ["Hell"], default "Hell"

Sektion **Trainingsmodus**:
- Grauer Beschreibungstext (Platzhalterkopie)
- Button: "Trainingsmodus" (`variant="outline"`)

### Rechtes Panel — Tastaturkürzel

Statische Tabelle (`<table>`), kein State. Spalten: Kürzel (Badge/Code) | Beschreibung.

```
Ereignisbearbeitung
  n  Nächste Ansicht
  b  Vorherige Ansicht
  f  Filter
  m  Karte
  v  Linienübersicht
  z  Routenzüge
  u  RSUs
  k  Kameras
  l  Ladestationen

Kamera
  ←  Vorn
  →  Links / Rechts (je Richtungsvariant)
  ↑  Hinten
  r  Zoom zurücksetzen

Informationen
  q  Fahrzeuginformationen
  w  Betriebsstatus

Aktionen
  a  Fahrzeug
  s  Fahrt
  d  Kommunikation
```

Jedes Kürzel als `<kbd>` oder `<span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-sm">`.

### Unteres Panel — Sound

`useState` für die vier Slider-Werte.

```ts
const [lautstärke, setLautstärke] = useState(48);
const [benachrichtigungen, setBenachrichtigungen] = useState(40);
const [fahrgastkommunikation, setFahrgastkommunikation] = useState(60);
const [fahrzeug, setFahrzeug] = useState(50);
```

Jede Zeile: Label links, `<Slider />` (shadcn) rechts, Wert daneben.

Geräteeinstellungen als `<Select>`:
- "Eingabegerät" → default "Mikrofon"
- "Ausgabegerät" → default "Lautsprecher"

### Hinweise

- Die gesamte Seite ist `"use client"` wegen Switch/Slider/Select-State
- Panel-Wrapper: `className="bg-white rounded-[10px] p-6"`

---

## Ticket 3 — ST-01: Statistiken

**Datei:** `src/app/(protected)/statistiken/page.tsx`
**Figma:** `512:19782`

### Vorbereitung

```bash
npm install recharts
```

### Aufbau

Seitentitel: "Statistiken" (h1, 42px bold)

#### Panel 1 — Ereignisaufkommen (volle Breite)

```tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
```

Mock-Daten (10 Tage):
```ts
const EREIGNISAUFKOMMEN = [
  { tag: "Mo", abgeschlossen: 8, einkommend: 4 },
  { tag: "Di", abgeschlossen: 12, einkommend: 6 },
  { tag: "Mi", abgeschlossen: 7, einkommend: 3 },
  { tag: "Do", abgeschlossen: 10, einkommend: 5 },
  { tag: "Fr", abgeschlossen: 14, einkommend: 8 },
  { tag: "Sa", abgeschlossen: 11, einkommend: 5 },
  { tag: "So", abgeschlossen: 16, einkommend: 6 },
  { tag: "Mo", abgeschlossen: 9, einkommend: 4 },
  { tag: "Di", abgeschlossen: 13, einkommend: 7 },
  { tag: "Mi", abgeschlossen: 10, einkommend: 5 },
];
```

`<AreaChart>` mit zwei `<Area>`-Elementen:
- `abgeschlossen`: `stroke="#22c55e"` (grün)
- `einkommend`: `stroke="#ef4444"` (rot)

Rechts oben im Panel: `<Select>` mit "10 Tage" als default.

#### Panel 2 — Nach Ereignisart (linke Hälfte der zweiten Zeile)

```tsx
import { PieChart, Pie, Cell, Legend } from "recharts";
```

Mock-Daten:
```ts
const NACH_ART = [
  { name: "Strecke blockiert", value: 23, color: "#146AA1" },
  { name: "Weiterfahrt", value: 16, color: "#22c55e" },
  { name: "Sensordefekt", value: 12, color: "#f59e0b" },
  { name: "Kommunikationsanfrage", value: 12, color: "#8b5cf6" },
  { name: "Verlassen Betriebsgelände", value: 5, color: "#ef4444" },
];
```

`<PieChart>` mit `innerRadius` für Donut-Effekt. Im Zentrum die Summe "68" als absolut positionierter Text.

#### Panel 3 — Betroffener Routenzug (rechte Hälfte der zweiten Zeile)

```tsx
import { BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
```

Mock-Daten:
```ts
const NACH_ROUTENZUG = [
  { name: "Routenzug A", abgeschlossen: 18, einkommend: 9 },
  { name: "Routenzug B", abgeschlossen: 14, einkommend: 6 },
  { name: "Routenzug C", abgeschlossen: 10, einkommend: 5 },
  { name: "Routenzug D", abgeschlossen: 8, einkommend: 3 },
];
```

`<BarChart>` mit zwei `<Bar>` pro Routenzug (grouped, kein `stackId`).

#### Panel 4 — Nach Ort

Statisches Placeholder-Layout:
- Graues Rechteck als Fabrik-Karte (`bg-gray-200 rounded-[10px]`)
- 3 Blasen (absolut positioniert oder mit Flex): je ein `<span>` mit Zahl und blauem Kreis-Hintergrund
  - Position links: 8
  - Position mitte: 22
  - Position rechts: 1

### Hinweise

- `"use client"` wegen Select-State (10-Tage-Dropdown)
- `<ResponsiveContainer width="100%" height={300}>` um alle Charts
- Panel-Wrapper: `className="bg-white rounded-[10px] p-6"`

---

## Ticket 4 — ANZ-01: Anzeigetafel

**Datei:** `src/app/(protected)/anzeigetafel/page.tsx`
**Figma:** `484:16547`

### Aufbau

Die Anzeigetafel ist eine Vollbild-Abfahrtstafel. Sie nutzt das normale `(protected)/layout.tsx` mit Sidebar, füllt aber den verbleibenden `<main>`-Bereich vollständig aus (kein horizontales Padding).

#### Header-Bereich

Hintergrund `#2A2F3B`, Höhe 220px.

```tsx
<div className="bg-[#2A2F3B] h-[220px] flex items-end justify-between px-14 pb-8">
  <div>
    <p className="text-white text-[24px] font-medium">Haltestelle</p>
    <p className="text-white text-[96px] font-bold leading-none">Lager A</p>
  </div>
  <p className="text-white text-[96px] font-normal">{MOCK_UHRZEIT}</p>
</div>
```

`MOCK_UHRZEIT = "11:35"` als Konstante (kein Live-Update nötig).

#### Spalten-Header

Hintergrund `#646A79`, Höhe 72px.

```tsx
<div className="bg-[#646A79] h-[72px] flex items-center px-14 gap-0 text-white text-[28px] font-semibold">
  <span className="w-[214px]">Linie</span>
  <span className="flex-1">Richtung</span>
  <span className="w-[300px] text-right">Abfahrt</span>
</div>
```

#### Abfahrts-Reihen

Mock-Daten:
```ts
interface Abfahrt {
  id: string;
  richtung: string;
  via: string;
  abfahrt: string;
  verspaetung?: string;
  umleitung?: string;
}

const MOCK_ABFAHRTEN: Abfahrt[] = [
  {
    id: "1",
    richtung: "Hauptgebäude",
    via: "via Lager H → Halle A → Lager F → Lager E",
    abfahrt: "in 9min",
    verspaetung: "1min verspätet",
  },
  {
    id: "2",
    richtung: "Hauptgebäude",
    via: "via Lager H → Lager F → Lager E",
    abfahrt: "in 2h 9min",
    umleitung: "Haltestelle Halle A entfällt",
  },
  {
    id: "3",
    richtung: "Lager M",
    via: "via Lager H → Hauptgebäude → Lager L",
    abfahrt: "in 3h 9min",
  },
];
```

Jede Reihe: Höhe 198px, Hintergrund `#E6E6E6`, horizontale Linie als Trennlinie.

```tsx
<div className="flex items-center h-[198px] px-14 border-b border-gray-300">
  {/* Linie-Spalte: Routenzug-Icon Placeholder */}
  <div className="w-[214px]">
    <div className="w-[110px] h-[110px] bg-gray-300 rounded-full" />
  </div>
  {/* Richtung */}
  <div className="flex-1">
    <p className="text-black font-bold text-[28px]">{abfahrt.richtung}</p>
    <p className="text-[#2A2F3B] font-medium text-[34px]">{abfahrt.via}</p>
    {abfahrt.umleitung && (
      <div className="flex items-center gap-3 mt-2">
        <span className="bg-[rgba(233,119,6,0.8)] text-white text-[28px] font-semibold px-4 py-1 rounded-[10px]">
          Umleitung
        </span>
        <span className="text-black font-medium text-[34px]">{abfahrt.umleitung}</span>
      </div>
    )}
  </div>
  {/* Abfahrt */}
  <div className="w-[300px] text-right">
    <p className="text-black text-[54px] font-medium">{abfahrt.abfahrt}</p>
    {abfahrt.verspaetung && (
      <p className="text-[#2A2F3B] text-[32px] font-medium">{abfahrt.verspaetung}</p>
    )}
  </div>
</div>
```

### Hinweise

- Server Component (kein `"use client"` nötig — keine Interaktivität)
- `overflow-auto` auf `<main>` im Layout sorgt dafür, dass weitere Reihen scrollbar sind
