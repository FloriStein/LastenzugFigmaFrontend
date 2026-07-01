# Sprint 14 — Statistiken Rollen-Views, Anzeigetafel-Polishing & Gast-Dashboard

## Ziel

Die letzten drei verbleibenden Screens aus dem Backlog abschließen: Statistiken für Schichtleitung und Gast role-differenziert implementieren, die Anzeigetafel mit Echtzeit-Uhr und Figma-konformer Typografie polishen.

Tests kommen **nach** der Implementierung — dieses Dokument enthält keine Testblöcke.

## Scope

| # | Ticket | Beschreibung | Zieldatei(en) |
|---|--------|--------------|---------------|
| 1 | ANZ-02 | Anzeigetafel: Echtzeit-Uhr + Font-Korrekturen + Umleitung | `anzeigetafel/page.tsx` |
| 2 | ST-02 | Statistiken SL: Filter-Badge + neuer-Filter-Button | `statistiken/page.tsx` |
| 3 | GS-01 | Statistiken Gast: Vollständig neue Dashboard-Ansicht | `statistiken/page.tsx` |

## Abhängigkeiten / Vorbereitung

- `useRole()` aus Sprint 13 (RG-01) ist Voraussetzung für ST-02 und GS-01
- Keine neuen npm-Packages nötig (recharts ist bereits installiert)
- Keine neuen shadcn-Komponenten nötig

## Implementierungsreihenfolge

1. ANZ-02 (eigenständig, kein useRole nötig)
2. ST-02 (braucht useRole)
3. GS-01 (braucht useRole, komplex)

---

## Ticket 1 — ANZ-02: Anzeigetafel Polishing

**Figma:** `484:16547` (Anzeigetafel)

### Problem

Die aktuelle `anzeigetafel/page.tsx` ist ein guter Stub, hat aber drei Abweichungen vom Figma-Design:
1. **Richtung-Schriftgröße:** 28px statt 54px (`text-[28px]` → `text-[54px]`)
2. **Umleitung-Darstellung:** Orangener "Umleitung"-Badge → im Figma nur Text ohne Badge, direkt in der Richtungsspalte
3. **Statische Uhrzeit:** "11:35" ist hardcoded statt echter Systemzeit
4. **Linie-Spalte:** Grauer Kreis statt Bus-Icon

### Vollständige neue Version

```tsx
"use client";

import { useEffect, useState } from "react";

interface Abfahrt {
  id: string;
  richtung: string;
  via: string;
  abfahrt: string;
  verspaetung?: string;
  hinweis?: string;
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
    hinweis: "Haltestelle Halle A entfällt",
  },
  {
    id: "3",
    richtung: "Lager M",
    via: "via Lager H → Hauptgebäude → Lager L",
    abfahrt: "in 3h 9min",
  },
];

function BusIcon() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="90" height="60" rx="10" fill="#9A9EA0" />
      <rect x="18" y="28" width="30" height="22" rx="4" fill="#E0E8EF" />
      <rect x="62" y="28" width="30" height="22" rx="4" fill="#E0E8EF" />
      <rect x="10" y="68" width="90" height="16" rx="4" fill="#646A79" />
      <circle cx="27" cy="92" r="10" fill="#2A2F3B" />
      <circle cx="83" cy="92" r="10" fill="#2A2F3B" />
    </svg>
  );
}

function formatTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export default function AnzeigetafelPage() {
  const [uhrzeit, setUhrzeit] = useState(formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setUhrzeit(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-dark-surface flex items-end justify-between px-14 pb-8 shrink-0" style={{ height: "220px" }}>
        <div>
          <p className="text-white text-[24px] font-medium">Haltestelle</p>
          <p className="text-white text-[96px] font-bold leading-none">Lager A</p>
        </div>
        <p className="text-white text-[96px] font-normal tabular-nums">{uhrzeit}</p>
      </div>

      {/* Spalten-Header */}
      <div className="bg-[#646A79] h-[72px] flex items-center px-14 text-white text-[28px] font-semibold shrink-0">
        <span className="w-[214px]">Linie</span>
        <span className="flex-1">Richtung</span>
        <span className="w-[300px] text-right">Abfahrt</span>
      </div>

      {/* Abfahrts-Reihen */}
      <div className="flex-1">
        {MOCK_ABFAHRTEN.map((abfahrt) => (
          <div
            key={abfahrt.id}
            className="flex items-center px-14 border-b border-gray-300 bg-[#E6E6E6]"
            style={{ height: "198px" }}
          >
            {/* Linie */}
            <div className="w-[214px] shrink-0 flex items-center">
              <BusIcon />
            </div>

            {/* Richtung */}
            <div className="flex-1">
              <p className="text-black font-bold text-[54px] leading-tight">{abfahrt.richtung}</p>
              <p className="text-dark-surface font-medium text-[34px] leading-tight">{abfahrt.via}</p>
              {abfahrt.hinweis && (
                <p className="text-black font-medium text-[28px] mt-1">{abfahrt.hinweis}</p>
              )}
            </div>

            {/* Abfahrt */}
            <div className="w-[300px] text-right shrink-0">
              <p className="text-black text-[54px] font-medium leading-tight">{abfahrt.abfahrt}</p>
              {abfahrt.verspaetung && (
                <p className="text-dark-surface text-[32px] font-medium">{abfahrt.verspaetung}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Hinweise

- `"use client"` ist nötig wegen `useState` + `useEffect` für die Echtzeit-Uhr.
- `tabular-nums` verhindert das Layout-Springen beim Wechsel von "11:08" → "11:09" (Zifferbreite bleibt konstant).
- `BusIcon` ist eine datei-lokale SVG-Komponente — kein eigener File nötig, da nur in dieser Route verwendet.
- `hinweis` ersetzt `umleitung` (das Feld wurde umbenannt und der orange Badge entfernt). Die Figma-Darstellung zeigt den Hinweis als einfachen Text ohne Badge.
- Die Row-Höhe `198px` entspricht exakt dem Figma-Maß (`height: 198`).

---

## Ticket 2 — ST-02: Statistiken Schichtleitung

**Figma:** `512:19782` (Statistiken - Strecke blockiert groß)

### Problem

`statistiken/page.tsx` zeigt für alle Rollen dasselbe Layout. Die Schichtleitung sieht laut Figma:
- **Filter-Badge** am Seitenanfang: "Art: Strecke blockiert" (blau, `#4EA7DF`, mit X zum Entfernen)
- **"neuer Filter"-Button** neben dem Filter-Badge
- Ansonsten identische Panels (Ereignisaufkommen, Nach Ereignisart, Betroffener Routenzug, Nach Ort)

### Änderungen in `statistiken/page.tsx`

Füge `useRole()` und einen `filterArt`-State ein. Zeige Filter-Badge und Button nur wenn `isSL === true`:

```tsx
"use client";

import { useState } from "react";
import { useRole } from "@/lib/useRole";
// ... bestehende Imports bleiben ...

export default function StatistikenPage() {
  const [zeitraum, setZeitraum] = useState("10");
  const role = useRole();
  const isSL = role === "schichtleitung";
  const [filterArt, setFilterArt] = useState<string | null>("Strecke blockiert");

  if (role === "gast") {
    return <GastStatistikenView />;  // → Ticket GS-01
  }

  return (
    <main className="px-14 pt-16 pb-16 flex flex-col gap-6">
      <h1 className="text-[42px] font-bold">Statistiken</h1>

      {/* SL-spezifisch: Filter-Badge + neuer-Filter-Button */}
      {isSL && (
        <div className="flex items-center gap-3">
          {filterArt && (
            <div className="flex items-center gap-2 bg-[#4EA7DF] text-white rounded px-3 py-1.5">
              <span className="text-[18px] font-medium">Art: {filterArt}</span>
              <button
                onClick={() => setFilterArt(null)}
                className="text-white/80 hover:text-white text-[20px] leading-none"
                aria-label="Filter entfernen"
              >
                ×
              </button>
            </div>
          )}
          <button className="flex items-center gap-2 bg-[rgba(20,106,161,0.1)] text-[#146AA1] rounded px-3 py-1.5 text-[18px] font-semibold hover:bg-[rgba(20,106,161,0.15)] transition-colors">
            neuer Filter
          </button>
        </div>
      )}

      {/* ... bestehende Panels unverändert ... */}
    </main>
  );
}
```

### Hinweise

- `filterArt` startet mit `"Strecke blockiert"` für SL-Nutzer — das spiegelt den Figma-Zustand wider (aktiver Filter ist Standard, nicht "kein Filter").
- Der "neuer Filter"-Button ist vorerst funktionslos (`onClick` → undefined) — kein Dialog nötig im Sprint 14.
- Die `useRole()`-Guard-Logik: `if (role === "gast") return <GastStatistikenView />` muss **vor** dem normalen Return stehen, aber **nach** allen `useState`-Hooks (Hook-Reihenfolge).
- Für nicht-SL Rollen (Operator, Mitarbeiter) ist der Filter-Badge einfach nicht gerendert — keine Bedingungslogik nötig in den Panels selbst.

---

## Ticket 3 — GS-01: Statistiken Gast

**Figma:** `513:21421` (Gast - Statistiken groß)

### Problem

Die Gast-Rolle sieht eine völlig andere Statistikseite als Schichtleitung und Operator. Laut Figma:
- **Titel:** "Automatisierte Routenzüge im Einsatz" (48px, nicht "Statistiken")
- **Linke Hauptfläche:** "Liveansicht Betriebsgelände" — Fabrik-Grundriss mit Routenlinien und Positionsmarkierungen
- **Rechte Spalte (770px):**
  - Panel "Bearbeitete Aufträge" — Area-Chart (Mo–So)
  - Panel "Vorteile" — 3 KPI-Karten: "3 min 20s", "+13", "20%"
  - Fußzeile: "im Vergleich zum herkömmlichen Einsatz von Gabelstaplern"

### Vollständige `GastStatistikenView`-Komponente

Diese Komponente wird datei-lokal in `statistiken/page.tsx` definiert und bei `role === "gast"` gerendert.

```tsx
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const BEARBEITETE_AUFTRAEGE = [
  { tag: "Mo", aufträge: 8  },
  { tag: "Di", aufträge: 12 },
  { tag: "Mi", aufträge: 7  },
  { tag: "Do", aufträge: 10 },
  { tag: "Fr", aufträge: 14 },
  { tag: "Sa", aufträge: 11 },
  { tag: "So", aufträge: 16 },
];

const GAST_KPIS = [
  { wert: "3 min 20s", label: "schnellere Lieferung von Aufträgen"                  },
  { wert: "+13",       label: "bearbeitete Aufträge am Tag"                         },
  { wert: "20%",       label: "geringeres innerbetriebliches Verkehrsaufkommen"     },
];

function KpiCard({ wert, label }: { wert: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 flex-1">
      <div className="w-[67px] h-[67px] bg-[#146AA1] rounded-full flex items-center justify-center shrink-0">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
          <circle cx="16" cy="16" r="12" stroke="white" strokeWidth="2.5" fill="none" />
          <path d="M16 10v6l4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <span className="text-[24px] font-bold text-black">{wert}</span>
      <span className="text-[18px] text-center text-black leading-snug">{label}</span>
    </div>
  );
}

function LiveansichtPlaceholder() {
  return (
    <div className="relative w-full h-full bg-[#E3EBE3] rounded-[10px] overflow-hidden">
      {/* Gebäude-Blöcke */}
      <div className="absolute" style={{ left: "20%", top: "20%", width: "15%", height: "12%" }}>
        <div className="w-full h-full bg-[#D9D9D9] rounded-sm" />
      </div>
      <div className="absolute" style={{ left: "45%", top: "25%", width: "20%", height: "15%" }}>
        <div className="w-full h-full bg-[#D9D9D9] rounded-sm" />
      </div>
      <div className="absolute" style={{ left: "65%", top: "18%", width: "12%", height: "18%" }}>
        <div className="w-full h-full bg-[#D9D9D9] rounded-sm" />
      </div>
      <div className="absolute" style={{ left: "15%", top: "55%", width: "18%", height: "14%" }}>
        <div className="w-full h-full bg-[#D9D9D9] rounded-sm" />
      </div>
      <div className="absolute" style={{ left: "45%", top: "60%", width: "22%", height: "12%" }}>
        <div className="w-full h-full bg-[#D9D9D9] rounded-sm" />
      </div>
      {/* Routenlinien */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 25 48 L 44 48 L 55 35 L 66 35" stroke="#146AA1" strokeWidth="0.8" fill="none" strokeDasharray="2,1" />
        <path d="M 66 60 L 55 60 L 44 48" stroke="#146AA1" strokeWidth="0.8" fill="none" strokeDasharray="2,1" />
      </svg>
      {/* Positionsmarker (aktive Routenzüge) */}
      <div
        className="absolute flex items-center justify-center text-white text-[12px] font-bold bg-[#146AA1] rounded-full"
        style={{ left: "30%", top: "44%", width: "28px", height: "28px", transform: "translate(-50%,-50%)" }}
      >
        A
      </div>
      <div
        className="absolute flex items-center justify-center text-white text-[12px] font-bold bg-[#146AA1] rounded-full"
        style={{ left: "58%", top: "57%", width: "28px", height: "28px", transform: "translate(-50%,-50%)" }}
      >
        B
      </div>
      {/* Labels */}
      <span className="absolute text-[10px] font-semibold text-[#2A2F3B] opacity-70"
        style={{ left: "21%", top: "34%" }}>Lager A</span>
      <span className="absolute text-[10px] font-semibold text-[#2A2F3B] opacity-70"
        style={{ left: "47%", top: "23%" }}>Hauptgebäude</span>
      <span className="absolute text-[10px] font-semibold text-[#2A2F3B] opacity-70"
        style={{ left: "16%", top: "53%" }}>Lager H</span>
      <span className="absolute text-[10px] font-semibold text-[#2A2F3B] opacity-70"
        style={{ left: "46%", top: "58%" }}>Halle A</span>
    </div>
  );
}

function GastStatistikenView() {
  return (
    <main className="px-14 pt-16 pb-16">
      <h1 className="text-[48px] font-bold mb-8">Automatisierte Routenzüge im Einsatz</h1>

      <div className="flex gap-6" style={{ minHeight: "867px" }}>
        {/* Linkes Panel: Liveansicht */}
        <div className="flex-1 bg-[#F2F2F2] rounded-[10px] p-6 flex flex-col">
          <h2 className="text-[32px] font-bold mb-4">Liveansicht Betriebsgelände</h2>
          <div className="flex-1">
            <LiveansichtPlaceholder />
          </div>
        </div>

        {/* Rechte Spalte */}
        <div className="flex flex-col gap-6 shrink-0" style={{ width: "770px" }}>
          {/* Bearbeitete Aufträge */}
          <div className="bg-[#F2F2F2] rounded-[10px] p-6 flex-1">
            <h2 className="text-[32px] font-bold mb-4">Bearbeitete Aufträge</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={BEARBEITETE_AUFTRAEGE}>
                <XAxis dataKey="tag" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="aufträge"
                  stroke="#E97706"
                  fill="#E97706"
                  fillOpacity={0.23}
                  name="Aufträge"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Vorteile */}
          <div className="bg-[#F2F2F2] rounded-[10px] p-6">
            <h2 className="text-[32px] font-bold mb-6">Vorteile</h2>
            <div className="flex gap-6 justify-around">
              {GAST_KPIS.map((kpi) => (
                <KpiCard key={kpi.wert} wert={kpi.wert} label={kpi.label} />
              ))}
            </div>
            <p className="text-[16px] text-[#515358] mt-6 text-center">
              im Vergleich zum herkömmlichen Einsatz von Gabelstaplern
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
```

### Integration in `statistiken/page.tsx`

Die Komponente `GastStatistikenView` wird datei-lokal definiert und im Haupt-Export bedingt gerendert:

```tsx
export default function StatistikenPage() {
  const [zeitraum, setZeitraum] = useState("10");
  const role = useRole();
  const isSL = role === "schichtleitung";
  const [filterArt, setFilterArt] = useState<string | null>("Strecke blockiert");

  if (role === "gast") {
    return <GastStatistikenView />;
  }

  return (
    // ... bestehende Panels + SL-Filter-Badge aus ST-02 ...
  );
}
```

### Hinweise

- `GastStatistikenView` und `LiveansichtPlaceholder` sowie `KpiCard` und `BEARBEITETE_AUFTRAEGE` sind alle datei-lokal — kein Export, keine eigenen Files.
- `LiveansichtPlaceholder` ist eine vereinfachte CSS/SVG-Visualisierung (kein Leaflet) — zeigt Gebäude-Blöcke + Routenlinien + Fahrzeug-Marker, ausreichend für einen Prototypen. Beim Übergang zu echten Daten würde hier der `MapCanvas` eingebaut.
- Die `KpiCard` nutzt ein generisches Uhren-/Pfeil-Icon als Platzhalter (der echte Figma-Icon-Satz für die Gast-View ist kein benanntes Component Set und daher nicht extrahierbar). Austausch gegen Lucide-Icons ist optional.
- Das `AreaChart` für "Bearbeitete Aufträge" übernimmt die orange Farbe aus dem Figma (`#E97706`). Die `dataKey` heißt `"aufträge"` — TypeScript-Warnung wegen Umlaut vermeiden, alternativ `"auftraege"` mit angepasstem Label-Prop.
- Der `if (role === "gast")` Early-Return muss nach allen `useState`-Aufrufen kommen — React Hook-Regeln erlauben keinen bedingten Hook-Aufruf vor dem Return. Wenn ein separates `GastStatistikenView`-File bevorzugt wird, können die Hooks herausgezogen werden.
