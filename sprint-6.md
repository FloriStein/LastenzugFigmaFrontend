# Sprint 6 — Routenzug-Detail

**Session-Einstieg:** Lies dieses Dokument vollständig bevor du irgendwas tust.
Alle Figma-Specs sind bereits extrahiert — kein MCP-Aufruf nötig für diese Tickets.

---

## Kontext

Industrielles Logistik-Management für Routenzüge. Stack: Next.js 16, TypeScript strict,
Tailwind v4, shadcn/ui v4.11. Figma-Datei: `6iHSHiZwZ7ouNQ3KVUy6OK`.

Relevante Dokumente:
- `BRIEFING.md` — Gesamtüberblick, Architekturentscheidungen
- `backlog.md` — Alle 47 Tickets mit Schichten AT/MO/OR/TM/SC
- `sprint-5.md` — Sprint 5 ✅ (AT-09, OR-03, OR-04, TM-04, SC-07)
- `decisions.md` — Entscheidung #5: `useReducer` für Fahrtmodus-Statusmaschine

**Projektstand nach Sprint 5:**

| Layer | Abgeschlossen |
|---|---|
| Atoms | PrioritätBadge, StatusBadge, FilterBadge, ListHeader, SearchBar, Tab (CSS), KarteIcon, ConnectionIcon |
| Molecules | NavItem, UserCard, EreignisListRow, RoutenzugCard |
| Organisms | Sidebar, SidebarKarte, EreignisListView, RoutenzugListPanel, MapCanvas, EreignisTitelleiste, FahrtmodusCard |
| Templates | ProtectedShell (role-aware), KarteShell, DetailShell |
| Screens | Ereignisansicht (`/ereignisse`), Kartenansicht (`/karte`), Ereignis-Detail (`/ereignisse/[id]`) |
| Types | `fahrtmodus.ts`, `ereignis.ts`, `routenzug.ts` |
| Hooks | `useFahrtmodus` |
| Tests | 204 Tests grün |

**Vorhandene Dateien die in Sprint 6 geändert oder gefüllt werden:**
- `src/components/features/EreignisListView.tsx` — `onRowClick`-Prop ergänzen (Carry-over)
- `src/app/(protected)/ereignisse/page.tsx` — Router-Verlinkung ergänzen (Carry-over)
- `src/app/(protected)/routenzug/[id]/page.tsx` — Stub, ausfüllen

---

## Sprint-Scope

| ID | Name | Datei | Status |
|---|---|---|---|
| — | EreignisListView Verlinkung | `EreignisListView.tsx` + `ereignisse/page.tsx` | Carry-over, klein |
| AT-07 | Beschleunigungsanzeige | `components/ui-custom/Beschleunigungsanzeige.tsx` | Neu |
| MO-07 | AuftragListItemKurz | `components/features/AuftragListItemKurz.tsx` | Neu |
| MO-08 | FahrzeugAktionCard | `components/features/FahrzeugAktionCard.tsx` | Neu |
| OR-05 | KameraPanel | `components/features/KameraPanel.tsx` | Neu |
| OR-06 | FahrtInfoPanel | `components/features/FahrtInfoPanel.tsx` | Neu |
| OR-07 | AktionenPanel | `components/features/AktionenPanel.tsx` | Neu |
| TM-03 | RoutenzugDetailShell | `components/layout/RoutenzugDetailShell.tsx` | Neu |
| SC-05 | Routenzug-Detail | `app/(protected)/routenzug/[id]/page.tsx` | Stub, ausfüllen |

**Implementierungsreihenfolge:**
Carry-over → AT-07 → MO-07 → MO-08 → OR-05 → OR-06 → OR-07 → TM-03 → SC-05

---

## Konventionen (nicht vergessen)

- Kein Default Export außer bei Next.js Page/Layout-Dateien
- Props-Interface direkt über der Komponente
- Keine Kommentare außer wenn das Warum nicht offensichtlich ist
- `cn()` aus `@/lib/utils`
- Mock-Daten direkt in der Page-Datei — kein separates `data/`-Verzeichnis
- `"use client"` nur in Komponenten die `useState`/`useReducer`/`useRouter` nutzen
- Kanonische Tailwind-Klassen nutzen wo vorhanden (z.B. `bg-dark-surface`, `text-gray-muted`, `bg-blue-primary`)
- Hex-Werte beibehalten wenn Tests via `[class*="XXXXXX"]` darauf prüfen

---

## Carry-over — EreignisListView Verlinkung

**Ziel:** Klick auf eine Zeile in der Ereignisliste navigiert zu `/ereignisse/[id]`.

### Änderung 1: `src/components/features/EreignisListView.tsx`

`onRowClick` als optionale Prop hinzufügen und an `EreignisListRow.onClick` weiterleiten:

```ts
interface EreignisListViewProps {
  ereignisse: Ereignis[];
  activeTab: "alle" | "offen" | "archiv";
  onTabChange: (tab: "alle" | "offen" | "archiv") => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRowClick?: (id: string) => void;   // NEU
}
```

In der Liste:
```tsx
<EreignisListRow
  ...
  onClick={onRowClick ? () => onRowClick(e.id) : undefined}
/>
```

### Änderung 2: `src/app/(protected)/ereignisse/page.tsx`

`useRouter` importieren, `"use client"` ist bereits gesetzt:

```ts
import { useRouter } from "next/navigation";
// ...
const router = useRouter();
// ...
<EreignisListView
  ...
  onRowClick={(id) => router.push(`/ereignisse/${encodeURIComponent(id)}`)}
/>
```

### Tests — Carry-over

**Neue Tests in:** `src/components/features/EreignisListView.test.tsx`

```tsx
describe("EreignisListView — Row-Verlinkung", () => {
  const BASE_EREIGNISSE = [
    { id: "#102", art: "Strecke blockiert", fahrzeug: "Routenzug A",
      status: "neu" as const, priorität: 3 as const, erstelltAt: "14:28 Uhr" },
    { id: "#99", art: "Weiterfahrt bestätigen", fahrzeug: "Routenzug A",
      status: "in-bearbeitung" as const, priorität: 1 as const, erstelltAt: "15:26 Uhr",
      bearbeiter: "Maxi Muster" },
  ];

  const BASE_PROPS = {
    ereignisse: BASE_EREIGNISSE,
    activeTab: "alle" as const,
    onTabChange: vi.fn(),
    searchValue: "",
    onSearchChange: vi.fn(),
  };

  it("ruft onRowClick mit der Ereignis-ID auf wenn Row geklickt", () => {
    const onRowClick = vi.fn();
    render(<EreignisListView {...BASE_PROPS} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByText("#102"));
    expect(onRowClick).toHaveBeenCalledWith("#102");
  });

  it("ruft onRowClick mit der richtigen ID auf (zweite Row)", () => {
    const onRowClick = vi.fn();
    render(<EreignisListView {...BASE_PROPS} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByText("#99"));
    expect(onRowClick).toHaveBeenCalledWith("#99");
  });

  it("kein Fehler wenn onRowClick nicht angegeben und Row geklickt", () => {
    render(<EreignisListView {...BASE_PROPS} />);
    expect(() => fireEvent.click(screen.getByText("#102"))).not.toThrow();
  });

  it("onRowClick wird nicht aufgerufen wenn nicht angegeben", () => {
    const onRowClick = vi.fn();
    render(<EreignisListView {...BASE_PROPS} />);
    fireEvent.click(screen.getByText("#102"));
    expect(onRowClick).not.toHaveBeenCalled();
  });
});
```

---

## AT-07 — Beschleunigungsanzeige

**Figma:** Component Set `#165:1657`

### Visuell

6 vertikale Balken aufsteigender Höhe (von links nach rechts), bottom-verankert.
`viewBox="0 0 66 24"`, jeder Balken 8px breit, 3px Abstand.

| Index | x | y | height | Farbe |
|---|---|---|---|---|
| 0 | 0 | 20 | 4 | `#51A135` (grün) |
| 1 | 11 | 16 | 8 | `#51A135` (grün) |
| 2 | 22 | 12 | 12 | `#DDB411` (gelb) |
| 3 | 33 | 8 | 16 | `#DDB411` (gelb) |
| 4 | 44 | 4 | 20 | `#C55141` (rot) |
| 5 | 55 | 0 | 24 | `#C55141` (rot) |

Alle Balken: `width="8" rx="1"`

**Aktivierungslogik:**
- `index < value` → `opacity="1"` (aktiv)
- `index >= value` → `opacity="0.25"` (gedimmt)

### Props-Interface

```ts
interface BeschleunigungsanzeigeProps {
  value: number; // 0–6
}
```

### Implementierung

```tsx
const BARS = [
  { x: 0,  y: 20, h: 4,  fill: "#51A135" },
  { x: 11, y: 16, h: 8,  fill: "#51A135" },
  { x: 22, y: 12, h: 12, fill: "#DDB411" },
  { x: 33, y: 8,  h: 16, fill: "#DDB411" },
  { x: 44, y: 4,  h: 20, fill: "#C55141" },
  { x: 55, y: 0,  h: 24, fill: "#C55141" },
] as const;
```

Balken rendern:
```tsx
<rect key={i} x={bar.x} y={bar.y} width="8" height={bar.h} rx="1"
  fill={bar.fill} opacity={i < value ? "1" : "0.25"} />
```

### Datei-Referenz

Neu anlegen: [Beschleunigungsanzeige.tsx](src/components/ui-custom/Beschleunigungsanzeige.tsx)

### Tests — AT-07

**Datei:** `src/components/ui-custom/Beschleunigungsanzeige.test.tsx`

```tsx
import { render } from "@testing-library/react";
import { Beschleunigungsanzeige } from "./Beschleunigungsanzeige";

describe("Beschleunigungsanzeige — Grundstruktur", () => {
  it("rendert ein SVG-Element", () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it('hat viewBox="0 0 66 24"', () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 66 24");
  });

  it("rendert genau 6 rect-Elemente", () => {
    const { container } = render(<Beschleunigungsanzeige value={3} />);
    expect(container.querySelectorAll("rect")).toHaveLength(6);
  });
});

describe("Beschleunigungsanzeige — Aktivierung", () => {
  it("value=0 → alle 6 Balken gedimmt (opacity ≤ 0.3)", () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    Array.from(container.querySelectorAll("rect")).forEach((r) => {
      expect(parseFloat(r.getAttribute("opacity") ?? "1")).toBeLessThanOrEqual(0.3);
    });
  });

  it("value=6 → alle 6 Balken aktiv (opacity > 0.9)", () => {
    const { container } = render(<Beschleunigungsanzeige value={6} />);
    Array.from(container.querySelectorAll("rect")).forEach((r) => {
      expect(parseFloat(r.getAttribute("opacity") ?? "0")).toBeGreaterThan(0.9);
    });
  });

  it("value=3 → erste 3 aktiv, letzte 3 gedimmt", () => {
    const { container } = render(<Beschleunigungsanzeige value={3} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    [0, 1, 2].forEach((i) =>
      expect(parseFloat(rects[i].getAttribute("opacity") ?? "0")).toBeGreaterThan(0.9)
    );
    [3, 4, 5].forEach((i) =>
      expect(parseFloat(rects[i].getAttribute("opacity") ?? "1")).toBeLessThanOrEqual(0.3)
    );
  });

  it("value=1 → nur erster Balken aktiv", () => {
    const { container } = render(<Beschleunigungsanzeige value={1} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    expect(parseFloat(rects[0].getAttribute("opacity") ?? "0")).toBeGreaterThan(0.9);
    expect(parseFloat(rects[1].getAttribute("opacity") ?? "1")).toBeLessThanOrEqual(0.3);
  });

  it("value=5 → erste 5 aktiv, letzter gedimmt", () => {
    const { container } = render(<Beschleunigungsanzeige value={5} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    [0, 1, 2, 3, 4].forEach((i) =>
      expect(parseFloat(rects[i].getAttribute("opacity") ?? "0")).toBeGreaterThan(0.9)
    );
    expect(parseFloat(rects[5].getAttribute("opacity") ?? "1")).toBeLessThanOrEqual(0.3);
  });
});

describe("Beschleunigungsanzeige — Farben", () => {
  it("Balken 1+2 (index 0, 1) sind grün (#51A135)", () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    expect(rects[0].getAttribute("fill")).toBe("#51A135");
    expect(rects[1].getAttribute("fill")).toBe("#51A135");
  });

  it("Balken 3+4 (index 2, 3) sind gelb (#DDB411)", () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    expect(rects[2].getAttribute("fill")).toBe("#DDB411");
    expect(rects[3].getAttribute("fill")).toBe("#DDB411");
  });

  it("Balken 5+6 (index 4, 5) sind rot (#C55141)", () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    expect(rects[4].getAttribute("fill")).toBe("#C55141");
    expect(rects[5].getAttribute("fill")).toBe("#C55141");
  });
});

describe("Beschleunigungsanzeige — Edge Cases", () => {
  it("value=0 rendert ohne Fehler", () => {
    expect(() => render(<Beschleunigungsanzeige value={0} />)).not.toThrow();
  });

  it("value=6 rendert ohne Fehler", () => {
    expect(() => render(<Beschleunigungsanzeige value={6} />)).not.toThrow();
  });

  it.each([0, 1, 2, 3, 4, 5, 6])("value=%i rendert immer 6 Balken", (v) => {
    const { container } = render(<Beschleunigungsanzeige value={v} />);
    expect(container.querySelectorAll("rect")).toHaveLength(6);
  });
});
```

---

## MO-07 — AuftragListItemKurz

**Figma:** `#509:20782` — "Auftrag Listeneintrag kurz" im Routenzug-Detail-Panel

### Visuell

Breite: `w-full`. Hintergrund: `bg-dark-surface` (`#2A2F3B`), `rounded-[8px]`, `px-3 py-2`.

**Layout (Flex, horizontal, `items-center`, `gap-3`):**
```
[PrioritätBadge (color="blue")]  [typ, flex-1, weiß, 13px]  [id, grau, 12px]
```

### Props-Interface

```ts
interface AuftragListItemKurzProps {
  id: string;
  typ: string;
  priorität: 1 | 2 | 3 | 4;
}
```

### Implementierung

```tsx
import { PrioritätBadge } from "@/components/ui-custom/PrioritätBadge";

export function AuftragListItemKurz({ id, typ, priorität }: AuftragListItemKurzProps) {
  return (
    <div className="flex items-center gap-3 bg-dark-surface rounded-[8px] px-3 py-2">
      <PrioritätBadge prio={priorität} color="blue" />
      <span className="text-white text-[13px] font-medium flex-1">{typ}</span>
      <span className="text-gray-muted text-[12px]">{id}</span>
    </div>
  );
}
```

### Datei-Referenz

Neu anlegen: [AuftragListItemKurz.tsx](src/components/features/AuftragListItemKurz.tsx)

### Tests — MO-07

**Datei:** `src/components/features/AuftragListItemKurz.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { AuftragListItemKurz } from "./AuftragListItemKurz";

const BASE_PROPS = { id: "AUF-01", typ: "Lieferung", priorität: 2 as const };

describe("AuftragListItemKurz — Rendering", () => {
  it("zeigt die Auftrags-ID", () => {
    render(<AuftragListItemKurz {...BASE_PROPS} />);
    expect(screen.getByText("AUF-01")).toBeInTheDocument();
  });

  it("zeigt den Typ", () => {
    render(<AuftragListItemKurz {...BASE_PROPS} />);
    expect(screen.getByText("Lieferung")).toBeInTheDocument();
  });

  it("rendert PrioritätBadge als SVG", () => {
    const { container } = render(<AuftragListItemKurz {...BASE_PROPS} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("hat bg-dark-surface auf dem Wrapper", () => {
    const { container } = render(<AuftragListItemKurz {...BASE_PROPS} />);
    expect(container.querySelector('[class*="dark-surface"]')).toBeInTheDocument();
  });
});

describe("AuftragListItemKurz — Priorität-Varianten", () => {
  it.each([1, 2, 3, 4] as const)(
    "priorität=%i rendert ohne Fehler",
    (priorität) => {
      expect(() =>
        render(<AuftragListItemKurz id="X" typ="Lieferung" priorität={priorität} />)
      ).not.toThrow();
    }
  );
});

describe("AuftragListItemKurz — Typ-Varianten", () => {
  it('zeigt "Mitarbeitertransport"', () => {
    render(<AuftragListItemKurz id="AUF-02" typ="Mitarbeitertransport" priorität={1} />);
    expect(screen.getByText("Mitarbeitertransport")).toBeInTheDocument();
  });
});

describe("AuftragListItemKurz — Edge Cases", () => {
  it("leere ID rendert ohne Fehler", () => {
    expect(() =>
      render(<AuftragListItemKurz id="" typ="Lieferung" priorität={1} />)
    ).not.toThrow();
  });

  it("sehr langer Typ rendert ohne Fehler", () => {
    expect(() =>
      render(<AuftragListItemKurz id="X" typ={"A".repeat(100)} priorität={1} />)
    ).not.toThrow();
  });
});
```

---

## MO-08 — FahrzeugAktionCard

**Figma:** `#509:20867` (danger) / `#509:20859` (warning) — "Fahrzeug-Aktionen"

### Varianten

| `variant` | Hintergrund | Textfarbe |
|---|---|---|
| `danger` | `bg-[#C55141]/20` | `text-[#C55141]` |
| `warning` | `bg-[#DDB411]/20` | `text-[#DDB411]` |

### Visuell

`w-full`, `h-[80px]`, `rounded-[10px]`, `p-4`
Flex-Spalte, `items-center justify-center gap-2`

**Layout:**
```
[icon (ReactNode, 20×20)]
[label, 13px, font-medium]
```

### Props-Interface

```ts
interface FahrzeugAktionCardProps {
  label: string;
  icon: React.ReactNode;
  variant: "danger" | "warning";
  onClick: () => void;
}
```

### Implementierung

```tsx
<button
  onClick={onClick}
  className={cn(
    "flex flex-col items-center justify-center gap-2 rounded-[10px] p-4 w-full h-[80px]",
    variant === "danger"
      ? "bg-[#C55141]/20 text-[#C55141]"
      : "bg-[#DDB411]/20 text-[#DDB411]"
  )}
>
  {icon}
  <span className="text-[13px] font-medium">{label}</span>
</button>
```

### Datei-Referenz

Neu anlegen: [FahrzeugAktionCard.tsx](src/components/features/FahrzeugAktionCard.tsx)

### Tests — MO-08

**Datei:** `src/components/features/FahrzeugAktionCard.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { FahrzeugAktionCard } from "./FahrzeugAktionCard";

const ICON = <svg data-testid="test-icon" />;
const BASE_PROPS = { label: "Nothalt", icon: ICON, variant: "danger" as const, onClick: vi.fn() };

describe("FahrzeugAktionCard — Rendering", () => {
  it("zeigt das Label", () => {
    render(<FahrzeugAktionCard {...BASE_PROPS} />);
    expect(screen.getByText("Nothalt")).toBeInTheDocument();
  });

  it("rendert den Icon-Slot", () => {
    render(<FahrzeugAktionCard {...BASE_PROPS} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("ist ein Button", () => {
    render(<FahrzeugAktionCard {...BASE_PROPS} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Button ist durch den Label-Text zugänglich", () => {
    render(<FahrzeugAktionCard {...BASE_PROPS} />);
    expect(screen.getByRole("button", { name: /nothalt/i })).toBeInTheDocument();
  });
});

describe("FahrzeugAktionCard — Varianten", () => {
  it('variant="danger" enthält rote Farbe (#C55141)', () => {
    const { container } = render(<FahrzeugAktionCard {...BASE_PROPS} variant="danger" />);
    expect(container.querySelector('[class*="C55141"]')).toBeInTheDocument();
  });

  it('variant="warning" enthält gelbe Farbe (#DDB411)', () => {
    const { container } = render(
      <FahrzeugAktionCard {...BASE_PROPS} variant="warning" label="Langsam fahren" />
    );
    expect(container.querySelector('[class*="DDB411"]')).toBeInTheDocument();
  });

  it('variant="danger" enthält keine gelbe Farbe', () => {
    const { container } = render(<FahrzeugAktionCard {...BASE_PROPS} variant="danger" />);
    expect(container.querySelector('[class*="DDB411"]')).not.toBeInTheDocument();
  });

  it('variant="warning" enthält keine rote Farbe', () => {
    const { container } = render(
      <FahrzeugAktionCard {...BASE_PROPS} variant="warning" />
    );
    expect(container.querySelector('[class*="C55141"]')).not.toBeInTheDocument();
  });
});

describe("FahrzeugAktionCard — Interaktion", () => {
  it("ruft onClick auf wenn geklickt", () => {
    const onClick = vi.fn();
    render(<FahrzeugAktionCard {...BASE_PROPS} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("onClick wird exakt einmal pro Klick aufgerufen", () => {
    const onClick = vi.fn();
    render(<FahrzeugAktionCard {...BASE_PROPS} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

describe("FahrzeugAktionCard — Edge Cases", () => {
  it("leerer Label rendert ohne Fehler", () => {
    expect(() =>
      render(<FahrzeugAktionCard label="" icon={ICON} variant="danger" onClick={vi.fn()} />)
    ).not.toThrow();
  });

  it("kein Icon (null) rendert ohne Fehler", () => {
    expect(() =>
      render(<FahrzeugAktionCard label="Nothalt" icon={null} variant="danger" onClick={vi.fn()} />)
    ).not.toThrow();
  });

  it("beide Varianten rendern ohne Fehler", () => {
    for (const v of ["danger", "warning"] as const) {
      expect(() =>
        render(<FahrzeugAktionCard label="X" icon={null} variant={v} onClick={vi.fn()} />)
      ).not.toThrow();
    }
  });
});
```

---

## OR-05 — KameraPanel

**Figma:** `#509:19876` / `#509:19885` — Kamera-Bereich im Routenzug-Detail

### Visuell

Hintergrund: `bg-black`, `rounded-[10px]`, `overflow-hidden`

**Layout:**
```
<div class="relative bg-black rounded-[10px] overflow-hidden">
  <img alt="Kamera Vorne" class="w-full aspect-video object-cover" />

  <!-- Speed-HUD: unten links, weißer Text -->
  <div class="absolute bottom-3 left-3 flex items-end gap-1">
    <span class="text-white text-[32px] font-bold leading-none">{speedKmh}</span>
    <span class="text-gray-muted text-[16px] pb-1">km/h</span>
  </div>

  <!-- Icons: oben rechts -->
  <div class="absolute top-3 right-3">
    <ConnectionIcon status={connectionStatus ?? "connected"} className="text-white" />
  </div>

  <!-- Beschleunigungsanzeige: unten rechts -->
  <div class="absolute bottom-3 right-3">
    <Beschleunigungsanzeige value={acceleration} />
  </div>

  <!-- Kamera Seite: nur wenn sideImageUrl angegeben -->
  {sideImageUrl && (
    <img alt="Kamera Seite" class="w-full h-[120px] object-cover mt-1" />
  )}
</div>
```

### Props-Interface

```ts
interface KameraPanelProps {
  frontImageUrl: string;
  sideImageUrl?: string;
  speedKmh: number;
  acceleration: number;
  connectionStatus?: "connected" | "disconnected";
}
```

### Datei-Referenz

Neu anlegen: [KameraPanel.tsx](src/components/features/KameraPanel.tsx)

### Tests — OR-05

**Datei:** `src/components/features/KameraPanel.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { KameraPanel } from "./KameraPanel";

const BASE_PROPS = {
  frontImageUrl: "/mock/front.jpg",
  speedKmh: 12,
  acceleration: 2,
};

describe("KameraPanel — Grundstruktur", () => {
  it("rendert Kamera-Vorne-Bild (img mit alt='Kamera Vorne')", () => {
    render(<KameraPanel {...BASE_PROPS} />);
    expect(screen.getByAltText("Kamera Vorne")).toBeInTheDocument();
  });

  it("img Kamera Vorne hat korrekte src", () => {
    render(<KameraPanel {...BASE_PROPS} />);
    expect(screen.getByAltText("Kamera Vorne")).toHaveAttribute("src", "/mock/front.jpg");
  });

  it("zeigt Geschwindigkeit als Zahl", () => {
    render(<KameraPanel {...BASE_PROPS} />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("zeigt 'km/h' Einheit", () => {
    render(<KameraPanel {...BASE_PROPS} />);
    expect(screen.getByText("km/h")).toBeInTheDocument();
  });

  it("rendert ConnectionIcon (SVG)", () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("rendert Beschleunigungsanzeige (6 rect-Elemente)", () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} />);
    expect(container.querySelectorAll("rect")).toHaveLength(6);
  });

  it("hat schwarzen Hintergrund", () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} />);
    expect(container.querySelector('[class*="bg-black"]')).toBeInTheDocument();
  });
});

describe("KameraPanel — Kamera Seite", () => {
  it("kein Seite-Bild wenn sideImageUrl nicht angegeben", () => {
    render(<KameraPanel {...BASE_PROPS} />);
    expect(screen.queryByAltText("Kamera Seite")).not.toBeInTheDocument();
  });

  it("rendert Seite-Bild wenn sideImageUrl angegeben", () => {
    render(<KameraPanel {...BASE_PROPS} sideImageUrl="/mock/side.jpg" />);
    expect(screen.getByAltText("Kamera Seite")).toBeInTheDocument();
  });

  it("Seite-Bild hat korrekte src", () => {
    render(<KameraPanel {...BASE_PROPS} sideImageUrl="/mock/side.jpg" />);
    expect(screen.getByAltText("Kamera Seite")).toHaveAttribute("src", "/mock/side.jpg");
  });
});

describe("KameraPanel — ConnectionIcon-Status", () => {
  it('connectionStatus="connected" → kein X-Overlay', () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} connectionStatus="connected" />);
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });

  it('connectionStatus="disconnected" → X-Overlay sichtbar', () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} connectionStatus="disconnected" />);
    expect(container.querySelector("line")).toBeInTheDocument();
  });

  it('kein connectionStatus → default "connected" (kein X-Overlay)', () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} />);
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });
});

describe("KameraPanel — Speed-HUD Varianten", () => {
  it("zeigt speedKmh=0", () => {
    render(<KameraPanel {...BASE_PROPS} speedKmh={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("zeigt speedKmh=120", () => {
    render(<KameraPanel {...BASE_PROPS} speedKmh={120} />);
    expect(screen.getByText("120")).toBeInTheDocument();
  });
});

describe("KameraPanel — Beschleunigung", () => {
  it("acceleration=0 → alle Balken gedimmt", () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} acceleration={0} />);
    Array.from(container.querySelectorAll("rect")).forEach((r) => {
      expect(parseFloat(r.getAttribute("opacity") ?? "1")).toBeLessThanOrEqual(0.3);
    });
  });

  it("acceleration=6 → alle Balken aktiv", () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} acceleration={6} />);
    Array.from(container.querySelectorAll("rect")).forEach((r) => {
      expect(parseFloat(r.getAttribute("opacity") ?? "0")).toBeGreaterThan(0.9);
    });
  });
});

describe("KameraPanel — Edge Cases", () => {
  it("leere frontImageUrl rendert ohne Fehler", () => {
    expect(() => render(<KameraPanel {...BASE_PROPS} frontImageUrl="" />)).not.toThrow();
  });

  it("speedKmh und acceleration kombiniert rendert ohne Fehler", () => {
    expect(() =>
      render(<KameraPanel frontImageUrl="/x.jpg" speedKmh={0} acceleration={0} />)
    ).not.toThrow();
  });
});
```

---

## OR-06 — FahrtInfoPanel

**Figma:** `#509:20742` — "fahrz+status" Panel im Routenzug-Detail

### Visuell

Hintergrund: `bg-dark-surface`, `rounded-[10px]`, `p-4`, `flex flex-col gap-4`

**Layout:**
```
[Abschnittstitel "Fahrzeugstatus" + StatusBadge]
[Abschnittstitel "Aufträge" + Liste von AuftragListItemKurz]
[Falls keine Aufträge: "Keine Aufträge" grau]
```

### Props-Interface

```ts
interface FahrtInfoPanelProps {
  fahrtStatus: FahrtStatus;
  aufträge: { id: string; typ: string; priorität: 1 | 2 | 3 | 4 }[];
}
```

`FahrtStatus` aus `@/types/routenzug` importieren.

### Datei-Referenz

Neu anlegen: [FahrtInfoPanel.tsx](src/components/features/FahrtInfoPanel.tsx)

### Tests — OR-06

**Datei:** `src/components/features/FahrtInfoPanel.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { FahrtInfoPanel } from "./FahrtInfoPanel";

const MOCK_AUFTRÄGE = [
  { id: "AUF-01", typ: "Lieferung", priorität: 2 as const },
  { id: "AUF-02", typ: "Mitarbeitertransport", priorität: 1 as const },
];

describe("FahrtInfoPanel — Fahrzeugstatus", () => {
  it('rendert StatusBadge für "fährt-automatisiert"', () => {
    render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={[]} />);
    expect(screen.getByText(/fährt automatisiert/i)).toBeInTheDocument();
  });

  it('rendert StatusBadge für "fahrt-unterbrochen"', () => {
    render(<FahrtInfoPanel fahrtStatus="fahrt-unterbrochen" aufträge={[]} />);
    expect(screen.getByText(/fahrt unterbrochen/i)).toBeInTheDocument();
  });

  it('rendert StatusBadge für "lädt"', () => {
    render(<FahrtInfoPanel fahrtStatus="lädt" aufträge={[]} />);
    expect(screen.getByText(/lädt/i)).toBeInTheDocument();
  });
});

describe("FahrtInfoPanel — Auftragsliste", () => {
  it("rendert alle Aufträge", () => {
    render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={MOCK_AUFTRÄGE} />);
    expect(screen.getByText("AUF-01")).toBeInTheDocument();
    expect(screen.getByText("AUF-02")).toBeInTheDocument();
  });

  it("zeigt Auftrags-Typ", () => {
    render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={MOCK_AUFTRÄGE} />);
    expect(screen.getByText("Lieferung")).toBeInTheDocument();
    expect(screen.getByText("Mitarbeitertransport")).toBeInTheDocument();
  });

  it('zeigt "Keine Aufträge" wenn Liste leer', () => {
    render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={[]} />);
    expect(screen.getByText(/keine aufträge/i)).toBeInTheDocument();
  });

  it('kein "Keine Aufträge" wenn Aufträge vorhanden', () => {
    render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={MOCK_AUFTRÄGE} />);
    expect(screen.queryByText(/keine aufträge/i)).not.toBeInTheDocument();
  });

  it("rendert PrioritätBadge für jeden Auftrag", () => {
    const { container } = render(
      <FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={MOCK_AUFTRÄGE} />
    );
    expect(container.querySelectorAll("svg")).toHaveLength(
      MOCK_AUFTRÄGE.length + 1 // +1 für StatusBadge-Icon falls vorhanden, sonst gleich MOCK_AUFTRÄGE.length
    );
  });
});

describe("FahrtInfoPanel — Einzelauftrag", () => {
  it("ein Auftrag wird korrekt gerendert", () => {
    render(
      <FahrtInfoPanel
        fahrtStatus="lädt"
        aufträge={[{ id: "AUF-99", typ: "Lieferung", priorität: 4 }]}
      />
    );
    expect(screen.getByText("AUF-99")).toBeInTheDocument();
  });
});

describe("FahrtInfoPanel — Edge Cases", () => {
  it("leere Auftragsliste rendert ohne Fehler", () => {
    expect(() =>
      render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={[]} />)
    ).not.toThrow();
  });

  it("alle FahrtStatus-Werte rendern ohne Fehler", () => {
    for (const status of ["fährt-automatisiert", "fahrt-unterbrochen", "lädt"] as const) {
      expect(() =>
        render(<FahrtInfoPanel fahrtStatus={status} aufträge={[]} />)
      ).not.toThrow();
    }
  });
});
```

> **Hinweis zu SVG-Test:** Die Anzahl der SVGs hängt von der StatusBadge-Implementierung ab.
> Falls StatusBadge kein SVG rendert, einfach `MOCK_AUFTRÄGE.length` statt `+1` verwenden.
> Den Test ggf. auf `toBeGreaterThanOrEqual(MOCK_AUFTRÄGE.length)` anpassen.

---

## OR-07 — AktionenPanel

**Figma:** `#509:20808` — "aktionen+komm" Panel im Routenzug-Detail

### Visuell

Hintergrund: `bg-dark-surface`, `rounded-[10px]`, `p-4`, `flex flex-col gap-4`

**Tabs (intern verwaltet):** `"fahrt"` | `"fahrzeug"` | `"kommunikation"`
- Initial aktiv: `"fahrt"`
- Aktiver Tab: `text-white`, Unterstrich `border-b-2 border-blue-primary`
- Inaktiver Tab: `text-gray-muted`

**Tab-Inhalte:**
- `"fahrt"` → `<FahrtmodusCard variant={fahrtmodus} onPrimaryAction={onFahrtmodusAction} />`
- `"fahrzeug"` → zwei `<FahrzeugAktionCard>` (Nothalt + Langsam fahren)
- `"kommunikation"` → Platzhaltertext `"Kommunikation"` (folgt in Sprint 7)

**Fahrzeug-Tab Karten:**
```tsx
<FahrzeugAktionCard label="Nothalt"        icon={<NothaltIcon />}  variant="danger"  onClick={() => {}} />
<FahrzeugAktionCard label="Langsam fahren" icon={<LangsamIcon />}  variant="warning" onClick={() => {}} />
```

`NothaltIcon` und `LangsamIcon` als einfache inline SVGs definieren (kein eigener Atom nötig).

### Props-Interface

```ts
interface AktionenPanelProps {
  fahrtmodus: FahrtmodusVariant;
  onFahrtmodusAction?: () => void;
}
```

`"use client"` wegen `useState` für Tab-Zustand.

### Datei-Referenz

Neu anlegen: [AktionenPanel.tsx](src/components/features/AktionenPanel.tsx)

### Tests — OR-07

**Datei:** `src/components/features/AktionenPanel.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AktionenPanel } from "./AktionenPanel";

describe("AktionenPanel — Initial-Zustand (Fahrt-Tab)", () => {
  it('zeigt initial den "Fahrt" Tab', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(screen.getByRole("button", { name: /^fahrt$/i })).toBeInTheDocument();
  });

  it("zeigt initial FahrtmodusCard", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });

  it("zeigt initial keinen Nothalt-Button", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(screen.queryByRole("button", { name: /nothalt/i })).not.toBeInTheDocument();
  });
});

describe("AktionenPanel — Tab-Wechsel zu Fahrzeug", () => {
  it('Klick auf "Fahrzeug" Tab zeigt FahrzeugAktionCards', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^fahrzeug$/i }));
    expect(screen.getByRole("button", { name: /nothalt/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /langsam fahren/i })).toBeInTheDocument();
  });

  it('Fahrzeug-Tab versteckt FahrtmodusCard', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^fahrzeug$/i }));
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });
});

describe("AktionenPanel — Tab-Wechsel zu Kommunikation", () => {
  it('Klick auf "Kommunikation" Tab zeigt Platzhalter', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
    expect(screen.getByText(/kommunikation/i)).toBeInTheDocument();
  });

  it('Kommunikation-Tab versteckt FahrtmodusCard', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });
});

describe("AktionenPanel — Zurück zum Fahrt-Tab", () => {
  it('Klick zurück auf "Fahrt" zeigt FahrtmodusCard wieder', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^fahrzeug$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^fahrt$/i }));
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });
});

describe("AktionenPanel — fahrtmodus-Varianten", () => {
  it.each([
    ["manuell" as const,              "Manuell"],
    ["autom-eingabe" as const,        "Automatisch"],
    ["autom-nicht-moeglich" as const, "Autom. nicht mögl."],
    ["wiederherstellung" as const,    "Wiederherstellung"],
  ])('fahrtmodus="%s" zeigt Label "%s"', (fahrtmodus, label) => {
    render(<AktionenPanel fahrtmodus={fahrtmodus} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

describe("AktionenPanel — onFahrtmodusAction", () => {
  it("ruft onFahrtmodusAction auf wenn FahrtmodusCard-Button geklickt", () => {
    const onFahrtmodusAction = vi.fn();
    render(<AktionenPanel fahrtmodus="manuell" onFahrtmodusAction={onFahrtmodusAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }));
    expect(onFahrtmodusAction).toHaveBeenCalledTimes(1);
  });

  it("kein Fehler wenn onFahrtmodusAction nicht angegeben", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }))
    ).not.toThrow();
  });
});

describe("AktionenPanel — Edge Cases", () => {
  it("alle drei Tabs klicken wirft keine Fehler", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(() => {
      fireEvent.click(screen.getByRole("button", { name: /^fahrzeug$/i }));
      fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
      fireEvent.click(screen.getByRole("button", { name: /^fahrt$/i }));
    }).not.toThrow();
  });
});
```

> **Achtung Tab-Button-Namen:** Die Tests verwenden `{ name: /^fahrt$/i }` (Regex mit `^$` = exakter Match).
> Das verhindert Konflikte mit anderen Buttons die "Fahrt" im Namen enthalten könnten (z.B. im FahrtmodusCard).
> Die Tab-Labels in der Implementierung müssen genau "Fahrt", "Fahrzeug", "Kommunikation" lauten.

---

## TM-03 — RoutenzugDetailShell

**Figma:** Layout-Pattern aus `#509:19875` (Routenzug-Detail 1)

### Visuell

```
<div class="flex flex-col h-screen overflow-hidden">
  {titelleiste}                    ← 148px blau (EreignisTitelleiste)
  <div class="grid grid-cols-3 flex-1 overflow-hidden bg-[#1E2229]">
    <div class="overflow-auto p-4">{kameraPanel}</div>
    <div class="overflow-auto p-4 border-x border-[#4A4F5B]">{fahrtInfoPanel}</div>
    <div class="overflow-auto p-4">{aktionenPanel}</div>
  </div>
</div>
```

Hintergrund des Grid-Bereichs: `#1E2229` (dunkler als `dark-surface`)

### Props-Interface

```ts
interface RoutenzugDetailShellProps {
  titelleiste: React.ReactNode;
  kameraPanel: React.ReactNode;
  fahrtInfoPanel: React.ReactNode;
  aktionenPanel: React.ReactNode;
}
```

### Datei-Referenz

Neu anlegen: [RoutenzugDetailShell.tsx](src/components/layout/RoutenzugDetailShell.tsx)

### Tests — TM-03

**Datei:** `src/components/layout/RoutenzugDetailShell.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { RoutenzugDetailShell } from "./RoutenzugDetailShell";

const SHELL_PROPS = {
  titelleiste: <div data-testid="titelleiste">Header</div>,
  kameraPanel: <div data-testid="kamera">Kamera</div>,
  fahrtInfoPanel: <div data-testid="fahrtinfo">FahrtInfo</div>,
  aktionenPanel: <div data-testid="aktionen">Aktionen</div>,
};

describe("RoutenzugDetailShell — Rendering", () => {
  it("rendert den Titelleiste-Slot", () => {
    render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(screen.getByTestId("titelleiste")).toBeInTheDocument();
  });

  it("rendert den KameraPanel-Slot", () => {
    render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(screen.getByTestId("kamera")).toBeInTheDocument();
  });

  it("rendert den FahrtInfoPanel-Slot", () => {
    render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(screen.getByTestId("fahrtinfo")).toBeInTheDocument();
  });

  it("rendert den AktionenPanel-Slot", () => {
    render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(screen.getByTestId("aktionen")).toBeInTheDocument();
  });

  it("alle 4 Slots gleichzeitig sichtbar", () => {
    render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Kamera")).toBeInTheDocument();
    expect(screen.getByText("FahrtInfo")).toBeInTheDocument();
    expect(screen.getByText("Aktionen")).toBeInTheDocument();
  });
});

describe("RoutenzugDetailShell — Layout-Klassen", () => {
  it("äußerer Wrapper hat h-screen und flex-col", () => {
    const { container } = render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("h-screen");
    expect(outer.className).toContain("flex-col");
  });

  it("Grid-Bereich hat grid-cols-3", () => {
    const { container } = render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(container.querySelector('[class*="grid-cols-3"]')).toBeInTheDocument();
  });
});

describe("RoutenzugDetailShell — Edge Cases", () => {
  it("leere Slots (null) rendern ohne Fehler", () => {
    expect(() =>
      render(
        <RoutenzugDetailShell
          titelleiste={null}
          kameraPanel={null}
          fahrtInfoPanel={null}
          aktionenPanel={null}
        />
      )
    ).not.toThrow();
  });

  it("Text-Children werden gerendert", () => {
    render(
      <RoutenzugDetailShell
        titelleiste={<span>T</span>}
        kameraPanel={<span>K</span>}
        fahrtInfoPanel={<span>F</span>}
        aktionenPanel={<span>A</span>}
      />
    );
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
```

---

## SC-05 — Routenzug-Detail (Page)

**Figma:** `#509:19875`
**Datei:** `src/app/(protected)/routenzug/[id]/page.tsx` (Stub, ausfüllen)

### Layout

```
(ProtectedLayout: Sidebar 266px + main)
  main:
    <RoutenzugDetailShell>
      titelleiste:
        <EreignisTitelleiste
          title={routenzug.name}
          connectionStatus="connected"
          backHref="/karte"
          onAbschließen={() => router.back()}
        />
      kameraPanel:
        <KameraPanel
          frontImageUrl={routenzug.frontImageUrl}
          speedKmh={routenzug.speedKmh}
          acceleration={routenzug.acceleration}
        />
      fahrtInfoPanel:
        <FahrtInfoPanel
          fahrtStatus={routenzug.status}
          aufträge={routenzug.aufträge}
        />
      aktionenPanel:
        <AktionenPanel
          fahrtmodus={fahrtmodus}
          onFahrtmodusAction={handlePrimaryAction}
        />
    </RoutenzugDetailShell>
```

### Mock-Daten (direkt in der Page-Datei)

```ts
type RoutenzugDetail = {
  id: string;
  name: string;
  status: FahrtStatus;
  frontImageUrl: string;
  speedKmh: number;
  acceleration: number;
  aufträge: { id: string; typ: string; priorität: 1 | 2 | 3 | 4 }[];
};

const MOCK_ROUTENZUG_DETAILS: Record<string, RoutenzugDetail> = {
  "RZ-A": {
    id: "RZ-A", name: "Routenzug A", status: "fährt-automatisiert",
    frontImageUrl: "/mock/kamera-front-a.jpg", speedKmh: 12, acceleration: 2,
    aufträge: [
      { id: "AUF-01", typ: "Lieferung", priorität: 2 },
      { id: "AUF-02", typ: "Mitarbeitertransport", priorität: 1 },
    ],
  },
  "RZ-B": {
    id: "RZ-B", name: "Routenzug B", status: "lädt",
    frontImageUrl: "/mock/kamera-front-b.jpg", speedKmh: 0, acceleration: 0,
    aufträge: [
      { id: "AUF-03", typ: "Lieferung", priorität: 3 },
    ],
  },
};
```

### State-Management

`"use client"` — verwendet `useParams`, `useRouter`, `useFahrtmodus`.

```ts
const params = useParams<{ id: string }>();
const router = useRouter();
const routenzug = MOCK_ROUTENZUG_DETAILS[decodeURIComponent(params.id)] ?? null;
const [fahrtmodus, dispatch] = useFahrtmodus("manuell");
```

`handlePrimaryAction` identisch zu SC-07 — basierend auf aktuellem `fahrtmodus`
den passenden `dispatch`-Aufruf ableiten (vgl. `primaryActionFor` in SC-07).

### Nicht gefunden — Fallback

```tsx
<RoutenzugDetailShell
  titelleiste={<div className="h-37 bg-blue-primary" />}
  kameraPanel={null}
  fahrtInfoPanel={null}
  aktionenPanel={null}
>
  <div className="p-8 col-span-3">
    <p className="text-[20px] font-bold">Routenzug nicht gefunden.</p>
    <Link href="/karte" className="text-blue-primary underline mt-2 inline-block">
      ← Zurück zur Karte
    </Link>
  </div>
</RoutenzugDetailShell>
```

> **Hinweis:** RoutenzugDetailShell hat keinen `children`-Slot. Der Fallback nutzt stattdessen
> den `kameraPanel`-Slot für die Fehlermeldung (oder einen der anderen Slots) — alternativ
> den Fallback ohne Shell rendern (analog zu SC-07).
> Am einfachsten: Fallback ohne RoutenzugDetailShell, direkt mit DetailShell rendern.

**Empfehlung für Fallback:**

```tsx
if (!routenzug) {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-37 bg-blue-primary" />
      <div className="flex-1 bg-gray-light p-8">
        <p className="text-[20px] font-bold text-black">Routenzug nicht gefunden.</p>
        <Link href="/karte" className="text-blue-primary underline mt-2 inline-block">
          ← Zurück zur Karte
        </Link>
      </div>
    </div>
  );
}
```

### Datei-Referenz

Ausfüllen: [routenzug/[id]/page.tsx](src/app/(protected)/routenzug/[id]/page.tsx)

### Tests — SC-05

**Datei:** `src/app/(protected)/routenzug/[id]/RoutenzugDetailPage.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import RoutenzugDetailPage from "./page";

const mockBack = vi.hoisted(() => vi.fn());
const mockUseParams = vi.hoisted(() => vi.fn(() => ({ id: "RZ-A" })));

vi.mock("next/navigation", () => ({
  useParams: mockUseParams,
  useRouter: () => ({ back: mockBack }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ id: "RZ-A" });
});

describe("SC-05 — RoutenzugDetailPage — Happy Path (RZ-A)", () => {
  it("rendert Routenzug-Name im Titel", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("Routenzug A")).toBeInTheDocument();
  });

  it("rendert blaue Titelleiste (bg-[#146AA1])", () => {
    const { container } = render(<RoutenzugDetailPage />);
    expect(container.querySelector('[class*="146AA1"]')).toBeInTheDocument();
  });

  it("rendert KameraPanel (km/h Einheit sichtbar)", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("km/h")).toBeInTheDocument();
  });

  it("rendert Kamera-Vorne-Bild", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByAltText("Kamera Vorne")).toBeInTheDocument();
  });

  it("rendert FahrtInfoPanel mit StatusBadge", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText(/fährt automatisiert/i)).toBeInTheDocument();
  });

  it("rendert Aufträge aus Mock-Daten", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("AUF-01")).toBeInTheDocument();
    expect(screen.getByText("AUF-02")).toBeInTheDocument();
  });

  it("rendert AktionenPanel mit FahrtmodusCard (initial 'Manuell')", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });

  it("rendert Zurück-Link zur Karte", () => {
    render(<RoutenzugDetailPage />);
    const link = screen.getByRole("link", { name: /zurück/i });
    expect(link).toHaveAttribute("href", "/karte");
  });
});

describe("SC-05 — RoutenzugDetailPage — Zweiter Routenzug (RZ-B)", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "RZ-B" });
  });

  it("rendert 'Routenzug B' im Titel", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("Routenzug B")).toBeInTheDocument();
  });

  it("rendert StatusBadge 'lädt'", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText(/lädt/i)).toBeInTheDocument();
  });

  it("rendert Auftrag AUF-03", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("AUF-03")).toBeInTheDocument();
  });
});

describe("SC-05 — RoutenzugDetailPage — Nicht gefunden", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "unbekannt" });
  });

  it('zeigt "Routenzug nicht gefunden" für unbekannte ID', () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText(/routenzug nicht gefunden/i)).toBeInTheDocument();
  });

  it("zeigt Zurück-Link zur Karte im Fallback", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/karte");
  });

  it("zeigt keinen Routenzug-Namen im Fallback", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.queryByText("Routenzug A")).not.toBeInTheDocument();
    expect(screen.queryByText("Routenzug B")).not.toBeInTheDocument();
  });

  it("zeigt keine FahrtmodusCard im Fallback", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });
});

describe("SC-05 — RoutenzugDetailPage — FahrtmodusCard Interaktion", () => {
  it("Klick auf 'Auf Automatik umschalten' wechselt Modus zu 'Automatisch'", () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }));
    expect(screen.getByText("Automatisch")).toBeInTheDocument();
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });

  it("Klick auf 'Abschließen' ruft router.back() auf", () => {
    render(<RoutenzugDetailPage />);
    const abschließenBtn = screen.queryByRole("button", { name: /abschließen/i });
    if (abschließenBtn) {
      fireEvent.click(abschließenBtn);
      expect(mockBack).toHaveBeenCalledTimes(1);
    }
  });
});

describe("SC-05 — RoutenzugDetailPage — AktionenPanel Tab-Wechsel", () => {
  it('Tab "Fahrzeug" zeigt Nothalt-Button', () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: /^fahrzeug$/i }));
    expect(screen.getByRole("button", { name: /nothalt/i })).toBeInTheDocument();
  });

  it('Tab "Kommunikation" versteckt FahrtmodusCard', () => {
    render(<RoutenzugDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });
});
```

---

## Verifikation

```bash
# TypeScript-Check (muss 0 Fehler zeigen)
npx tsc --noEmit

# Tests (alle 204 + neue grün)
npm run test:run

# Dev-Server
npm run dev
```

**Manuelle Checks:**
- [ ] `/ereignisse` → Klick auf Ereignis-Row → navigiert zu `/ereignisse/%23102`
- [ ] `/routenzug/RZ-A` rendert ohne 404
- [ ] Blauer Header (148px) mit "Routenzug A" und ConnectionIcon sichtbar
- [ ] KameraPanel: Kamera-Placeholder + "12 km/h" Speed-HUD
- [ ] Beschleunigungsanzeige: 2 von 6 Balken aktiv (grün)
- [ ] FahrtInfoPanel: StatusBadge "fährt automatisiert" + Aufträge AUF-01, AUF-02
- [ ] AktionenPanel Fahrt-Tab: FahrtmodusCard "Manuell"
- [ ] AktionenPanel Fahrzeug-Tab: Nothalt (rot) + Langsam fahren (gelb)
- [ ] AktionenPanel Kommunikation-Tab: Platzhaltertext
- [ ] "Auf Automatik umschalten" → Card wechselt zu "Automatisch" + Eingabefeld
- [ ] `/routenzug/XYZ` → "Routenzug nicht gefunden" mit Zurück-Link zur Karte

---

## Nächste Session (Sprint 7)

Nach Sprint 6 weitermachen mit:
- **SC-06 — Linienansicht** (`/linien`) — statische Streckenkarte
- **SC-04 — Aufträge** (`/auftraege`) + `AuftragListRow` (MO-06)
- **AktionenPanel Kommunikation** — Kommunikations-Flow (4 States aus Figma `#516:37870–37996`)
- **FahrtmodusCard Eingabe-Validierung** — Bestätigungscode für `autom-eingabe` (weiter verschoben)
- **RoutenzugCard → SC-05 Verlinkung** — `onClick → router.push('/routenzug/${id}')`
- **SC-01 — Login** (`/login`) + JWT-Mock + Rollenweiterleitung
