# Sprint 2 — Sidebar-Organisms & Layout-Templates

**Session-Einstieg:** Lies dieses Dokument vollständig bevor du irgendwas tust.
Alle Figma-Specs sind bereits extrahiert — kein MCP-Aufruf nötig für diese Tickets.

---

## Kontext

Industrielles Logistik-Management für Routenzüge. Stack: Next.js 16, TypeScript strict,
Tailwind v4, shadcn/ui v4.11. Figma-Datei: `6iHSHiZwZ7ouNQ3KVUy6OK`.

Relevante Dokumente:
- `BRIEFING.md` — Gesamtüberblick, Architekturentscheidungen
- `backlog.md` — Alle 47 Tickets mit Schichten AT/MO/OR/TM/SC
- `design-audit.md` — Screens, Routing, Token-Übersicht
- `sprint-1.md` — Sprint 1 (abgeschlossen): AT-01..05, MO-01..03

**Voraussetzung:** Sprint 1 ist vollständig abgeschlossen. Folgende Komponenten existieren:
`PrioritätBadge`, `StatusBadge`, `FilterBadge`, `ListHeader`, `SearchBar`, `NavItem`, `UserCard`.

Skeleton-Dateien für OR-01 und OR-02 existieren bereits — ausfüllen, nicht neu erstellen.

---

## Sprint-Scope (8 Tickets)

| ID | Name | Datei | Status |
|---|---|---|---|
| OR-01 | Sidebar | `components/layout/Sidebar.tsx` | Skeleton vorhanden |
| OR-02 | SidebarKarte | `components/layout/SidebarKarte.tsx` | Skeleton vorhanden |
| TM-01 | OperatorShell | `app/(operator)/layout.tsx` | Existiert, updaten |
| TM-02 | KarteShell | `components/layout/KarteShell.tsx` | Neu anlegen |
| TS-00 | Test-Setup | `vitest.config.ts`, `src/test/setup.ts` | Neu |
| TS-01 | PrioritätBadge Tests | `ui-custom/PrioritätBadge.test.tsx` | Neu |
| TS-02 | StatusBadge Tests | `ui-custom/StatusBadge.test.tsx` | Neu |
| TS-03 | SearchBar Tests | `ui-custom/SearchBar.test.tsx` | Neu |

**Implementierungsreihenfolge:** OR-01 → OR-02 → TM-01 → TM-02 → TS-00 → TS-01 → TS-02 → TS-03

---

## Konventionen (nicht vergessen)

- Kein Default Export außer bei Next.js Page/Layout-Dateien
- Props-Interface direkt über der Komponente, kein `types/`-Verzeichnis
- shadcn-Komponenten nie direkt in `components/ui/` editieren
- Keine Kommentare außer wenn das Warum nicht offensichtlich ist
- `cn()` aus `@/lib/utils` für Klassen-Kombination nutzen
- Icons als Inline-SVG — keine Icon-Library in diesem Projekt

---

## OR-01 — Sidebar

**Figma:** Component Set `#59:534` — 7 Varianten (je Rolle + aktiver Nav-State)

### Visuell

- Gesamt: 266×1080px, `bg-[#2A2F3B]` (= `bg-dark-surface`)
- UserCard: absolut bei `x:29, y:116` → `mt-[116px] ml-[29px]`
- Nav-Bereich: startet bei absolutem `y:283` → `mt-[120px] ml-[47px]`
  (120px = 283 minus UserCard-Ende bei y:163)
- Abstände zwischen NavItems: `gap-8` (32px)

Sub-Items (sichtbar wenn NavItem aktiv):
- Frame: `padding-left: 55px`, `gap: 10px`, column
- Text: Inter Medium 500, 16px, weiß

### Rollen-Konfiguration

Figma-Varianten per Rolle (aus `#59:534`):

| Rolle | Nav-Items (Reihenfolge) |
|---|---|
| `operator` | Ereignisse (+ sub), Aufträge, Einstellungen |
| `schichtleitung` | Ereignisse (+ sub), Aufträge, Karte, Linien, Statistiken, Einstellungen |
| `mitarbeiter` | Aufträge, Linien |

Ereignisse-Sub-Items (aus Figma Variant 2, `#102:698`): `["Offen", "Archiv"]`

### Icons

Alle als Inline-SVG inline in der Sidebar-Komponente übergeben. Die Icon-Formen
sind Figma-SVG-Exporte — für die Sprint-2-Implementierung Platzhalter-SVGs nutzen
und mit `TODO:` markieren (Export aus Figma erfolgt in Sprint 3).

| Nav-Item | Figma Component Set | Placeholder |
|---|---|---|
| Ereignisse | `#58:398` | Glocken-SVG 23×13px |
| Aufträge (Lieferungen) | `#58:408` | Box-SVG 20×16px |
| Karte | `#388:15127` | Karte-SVG 20×16px |
| Linien | `#388:15116` | Route-SVG 20×16px |
| Statistiken | `#58:422` | Balken-SVG 15×13px |
| Einstellungen | `#58:429` | Zahnrad-SVG 15×16px |

Icon-Farbe immer `#FFFFFF`. Abmessungen aus Figma-Instances ca. 15–23×13–18px je Icon.

### Props-Interface

```ts
type Role = "operator" | "schichtleitung" | "mitarbeiter";

interface SidebarProps {
  role: Role;
  userName: string;
  avatarUrl?: string;
  onLogout: () => void;
}
```

### Implementierung

- Kein shadcn — natives `<aside>` mit Tailwind
- `UserCard` aus `@/components/layout/UserCard` importieren
- `NavItem` aus `@/components/layout/NavItem` importieren
- Nav-Config als `const`-Map außerhalb der Komponente:
  ```ts
  const NAV_CONFIG: Record<Role, NavItemDef[]> = { ... }
  ```
- NavItem aktiver Zustand wird intern per `usePathname()` bestimmt (bereits in NavItem implementiert)
- Sidebar selbst kein `"use client"` nötig, da NavItem und UserCard schon Client-Komponenten sind

### Datei-Referenz

Skeleton: [Sidebar.tsx](src/components/layout/Sidebar.tsx)

---

## OR-02 — SidebarKarte

**Figma:** Component Set `#104:2186` — 8 Varianten (je aktiver Map-Ansicht)

### Visuell

- Gesamt: 92×1080px, `bg-[#2A2F3B]`
- Icon-Spalte: `x:20, y:160, w:52` — `flex flex-col items-center gap-[50px]`

**Struktur (Top → Bottom):**

```
┌─────────────────────────────┐  ← mt-[160px]
│  Logo-Icon  28×28px weiß   │
│  Nav-Icon   26×26px weiß   │  ← z.B. Settings o.ä.
│  ─ ─ ─ Divider 1px weiß ─ ─│
│  Nav-Icon   34×34px         │  ← aktiver Zustand: bg-Rect 34×34
│  Nav-Icon   34×34px         │
│  Nav-Icon   34×34px         │
│  Nav-Icon   34×34px         │
└─────────────────────────────┘
```

**Aktiver Zustand:** Icon wird in eine `<div class="relative">` mit absoluter 34×34px
Hintergrunds-Rect gewrapped (Farbe: subtil, z.B. `bg-white/10`). In Figma als
`EL-e0d1446b` (GROUP mit RECT `EL-5da671e8` 34×34px) dargestellt.

**Divider:** 1px horizontale Linie, volle Breite, `bg-white/40` zwischen Logo-Bereich
und Nav-Icons (aus `EL-78c22a7d`, stroke: weiß).

### Nav-Varianten (aus Figma-Variant-Namen)

| Variante | activeItem-Wert | Anzeige |
|---|---|---|
| `Property 1=map` | `"karte"` | Karte-Icon aktiv |
| `Property 1=routenzüge` | `"routenzüge"` | Routenzüge-Icon aktiv |
| `Property 1=rsu` | `"rsu"` | RSU-Icon aktiv |
| `Property 1=lines` | `"linien"` | Linien-Icon aktiv |
| `Property 1=lines stops` | `"linien-haltestellen"` | Linien+Stops aktiv |
| `Property 1=lines bus` | `"linien-bus"` | Bus-Icon aktiv |

### Props-Interface

```ts
interface SidebarKarteProps {
  activeItem?: "karte" | "routenzüge" | "rsu" | "linien" | "linien-haltestellen" | "linien-bus";
}
```

### Implementierung

- Kein shadcn — natives `<aside>`
- Icons: Inline-SVG Platzhalter, mit `TODO:` markieren
- Die `activeItem`-Prop steuert welcher Icon-Slot den Hintergrund-Rect bekommt
- Kein Next.js `<Link>` — SidebarKarte ist rein visuell (Map-Layer-Toggle, nicht Routing)

### Datei-Referenz

Skeleton: [SidebarKarte.tsx](src/components/layout/SidebarKarte.tsx)

---

## TM-01 — OperatorShell

**Figma:** Kein eigenes Component Set — Layout-Template
**Datei:** `src/app/(operator)/layout.tsx` (existiert, updaten)

### Was fehlt

Das Skeleton existiert bereits:
```tsx
import { Sidebar } from "@/components/layout/Sidebar";

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
```

**Änderungen:**
1. `Sidebar` bekommt jetzt Props (`role`, `userName`, `onLogout`)
2. Für Sprint 2: `role="operator"` als Hardcode, `userName="Operator"` als Platzhalter
3. `onLogout` als No-Op (`() => {}`) — Auth-Integration kommt in Sprint 5

### Implementierung

Minimal-Update — Sidebar-Props verdrahten, sonst nichts ändern.
`"use client"` ist NICHT nötig — `onLogout` als Prop wird serverside als Funktion übergeben,
aber da layout.tsx ein Server Component ist, muss `onLogout` als serialisierbarer Wert
behandelt werden. Lösung: `Sidebar` in einen separaten `SidebarWrapper`-Client-Komponenten
auslagern wenn nötig, oder `onLogout` als `() => {}` direkt im Server Component übergeben
(funktioniert nicht — Server Components können keine Funktionen an Client Components übergeben).

**Korrekte Lösung:**
- `SidebarWrapper.tsx` als `"use client"` anlegen, der `onLogout` definiert und `Sidebar` rendert
- `layout.tsx` importiert `SidebarWrapper` (Server → Client boundary hier)

```ts
// src/components/layout/SidebarWrapper.tsx ("use client")
// Definiert onLogout-Handler und rendert Sidebar
```

### Datei-Referenz

[layout.tsx](src/app/(operator)/layout.tsx)

---

## TM-02 — KarteShell

**Figma:** Kartenansicht-Screen `#508:18941`
**Datei:** `src/components/layout/KarteShell.tsx` (neu anlegen)

### Zweck

KarteShell ist ein Layout-Wrapper für die Karten-Seite. Anders als OperatorShell
verwendet es SidebarKarte (92px kompakt) statt der vollen Sidebar (266px).

**Wichtig:** Die `/karte`-Route fällt aktuell unter `(operator)/layout.tsx`, das die
volle Sidebar zeigt. KarteShell ersetzt dieses Layout NICHT direkt — die Karte-Page
(`karte/page.tsx`) wird KarteShell als Component wrapper verwenden und den vollen
Screen-Bereich der Main-Section füllen.

Alternativ (Refaktor in Sprint 3): `/karte` in eigene Route-Gruppe auslagern
(`(operator-karte)/karte`) mit eigenem layout.tsx das KarteShell als Page-Template nutzt.
Für Sprint 2 reicht KarteShell als Komponente.

### Visuell

```
┌──────────┬─────────────────────────────┐
│ Sidebar  │                             │
│  Karte   │    Map-Content (flex-1)     │
│  92px    │    overflow: hidden         │
│  h:100vh │    h:100vh                  │
└──────────┴─────────────────────────────┘
```

- Kein Scroll, kein Overflow auf dem Map-Bereich
- `h-screen overflow-hidden` für den Root-Container

### Props-Interface

```ts
interface KarteShellProps {
  children: React.ReactNode;
  activeItem?: SidebarKarteProps["activeItem"];
}
```

### Implementierung

```tsx
import { SidebarKarte } from "@/components/layout/SidebarKarte";

interface KarteShellProps {
  children: React.ReactNode;
  activeItem?: "karte" | "routenzüge" | "rsu" | "linien" | "linien-haltestellen" | "linien-bus";
}

export function KarteShell({ children, activeItem }: KarteShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarKarte activeItem={activeItem} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
```

### Datei-Referenz

Neu: [KarteShell.tsx](src/components/layout/KarteShell.tsx) (noch nicht vorhanden)

---

---

## TS-00 — Test Setup

**Kein Figma-Bezug** — Infrastruktur-Ticket.

### Pakete installieren

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/dom @testing-library/jest-dom jsdom
```

### `vitest.config.ts` (Projektwurzel, neu anlegen)

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### `src/test/setup.ts` (neu anlegen)

```ts
import "@testing-library/jest-dom";
```

### `package.json` — Scripts ergänzen

```json
"test": "vitest",
"test:run": "vitest run"
```

### `tsconfig.json` — Types ergänzen

Im `compilerOptions.types`-Array `"vitest/globals"` hinzufügen, damit `describe`,
`it`, `expect`, `vi` ohne Import verfügbar sind.

---

## TS-01 — PrioritätBadge Tests

**Datei:** `src/components/ui-custom/PrioritätBadge.test.tsx`

### Was getestet wird

Die Kernlogik ist das Mapping `prio → Anzahl gefüllter Circles`. Ein gefüllter Circle
hat `fill=<Farbe>`, ein Rahmen-Circle hat `fill="none"` + `stroke=<Farbe>`.

### Test-Cases

```tsx
import { render } from "@testing-library/react";
import { PrioritätBadge } from "./PrioritätBadge";

describe("PrioritätBadge", () => {
  it("rendert immer 4 Circles", () => {
    const { container } = render(<PrioritätBadge prio={0} />);
    expect(container.querySelectorAll("circle")).toHaveLength(4);
  });

  it("prio=0: keine gefüllten Circles", () => {
    const { container } = render(<PrioritätBadge prio={0} />);
    const filled = [...container.querySelectorAll("circle")].filter(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled).toHaveLength(0);
  });

  it("prio=2: genau 2 gefüllte und 2 Rahmen-Circles", () => {
    const { container } = render(<PrioritätBadge prio={2} />);
    const circles = [...container.querySelectorAll("circle")];
    expect(circles.filter((c) => c.getAttribute("fill") !== "none")).toHaveLength(2);
    expect(circles.filter((c) => c.getAttribute("fill") === "none")).toHaveLength(2);
  });

  it("prio=4: alle 4 Circles gefüllt", () => {
    const { container } = render(<PrioritätBadge prio={4} />);
    const filled = [...container.querySelectorAll("circle")].filter(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled).toHaveLength(4);
  });

  it("color=dark: gefüllte Circles verwenden #2A2F3B", () => {
    const { container } = render(<PrioritätBadge prio={1} color="dark" />);
    const filled = [...container.querySelectorAll("circle")].find(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled?.getAttribute("fill")).toBe("#2A2F3B");
  });

  it("color=blue: gefüllte Circles verwenden #146AA1", () => {
    const { container } = render(<PrioritätBadge prio={1} color="blue" />);
    const filled = [...container.querySelectorAll("circle")].find(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled?.getAttribute("fill")).toBe("#146AA1");
  });

  it("color=dark ist Default wenn nicht angegeben", () => {
    const { container } = render(<PrioritätBadge prio={1} />);
    const filled = [...container.querySelectorAll("circle")].find(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled?.getAttribute("fill")).toBe("#2A2F3B");
  });
});
```

---

## TS-02 — StatusBadge Tests

**Datei:** `src/components/ui-custom/StatusBadge.test.tsx`

### Was getestet wird

Das Label-Mapping (18 type-Werte → korrekter Text) und die `percent`-Sonderlogik
für `type="lädt"`. Das ist der anfälligste Teil — ein Tippfehler im `config`-Objekt
wäre sonst stumm.

### Test-Cases

```tsx
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

const LABEL_MAP = [
  ["fahrt-unterbrochen",        "Fahrt unterbrochen"],
  ["autom-fahren-unterbrochen", "automatisiertes Fahren unterbrochen"],
  ["fährt-automatisiert",       "fährt automatisiert"],
  ["lädt",                      "lädt"],
  ["pause",                     "automatisierte Fahrt pausiert"],
  ["aktiv",                     "aktiv"],
  ["offen",                     "offen"],
  ["frei",                      "frei"],
  ["in-bearbeitung",            "in Bearbeitung"],
  ["geplant",                   "geplant"],
  ["abgeschlossen",             "abgeschlossen"],
  ["warten",                    "warten zur Erinnerung"],
  ["belegt",                    "belegt"],
  ["unterbrochen-gelb",         "unterbrochen"],
  ["fehlermeldung",             "Fehlermeldung"],
  ["lieferung",                 "Lieferung"],
  ["mitarbeitertransport",      "Mitarbeitertransport"],
  ["auftrag-abgeschlossen",     "abgeschlossen"],
] as const;

describe("StatusBadge", () => {
  it.each(LABEL_MAP)('type="%s" zeigt Label "%s"', (type, expectedLabel) => {
    render(<StatusBadge type={type} />);
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it('type="lädt" mit percent zeigt Prozentangabe', () => {
    render(<StatusBadge type="lädt" percent={42} />);
    expect(screen.getByText("lädt (42%)")).toBeInTheDocument();
  });

  it('type="lädt" ohne percent zeigt nur "lädt"', () => {
    render(<StatusBadge type="lädt" />);
    expect(screen.getByText("lädt")).toBeInTheDocument();
  });

  it("rendert ein <span>-Element", () => {
    const { container } = render(<StatusBadge type="aktiv" />);
    expect(container.querySelector("span")).toBeInTheDocument();
  });
});
```

---

## TS-03 — SearchBar Tests

**Datei:** `src/components/ui-custom/SearchBar.test.tsx`

### Was getestet wird

Kontrolliertes Input-Verhalten: `value`-Prop, `onChange`-Callback, `placeholder`.
Keine Größen-Tests (CSS-Klassen sind kein sinnvoller Unit-Test-Gegenstand).

### Test-Cases

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("rendert ein Input-Element", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("zeigt den übergebenen value an", () => {
    render(<SearchBar value="Routenzug 4" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("Routenzug 4");
  });

  it("ruft onChange mit dem neuen Wert auf", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Test" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("Test");
  });

  it("zeigt den Placeholder-Text", () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Fahrzeug suchen..." />);
    expect(screen.getByPlaceholderText("Fahrzeug suchen...")).toBeInTheDocument();
  });

  it("kein Placeholder wenn nicht angegeben", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("placeholder");
  });
});
```

---

## Verifikation

Nach Implementierung aller Tickets:

```bash
# TypeScript-Check (muss 0 Fehler zeigen)
npx tsc --noEmit

# Tests ausführen (muss 0 Failures zeigen)
npm run test:run

# Dev-Server starten und visuell prüfen
npm run dev
```

**Manuelle Checks:**
- [ ] Sidebar: bg `#2A2F3B`, Breite 266px, UserCard oben sichtbar
- [ ] Sidebar Operator: zeigt Ereignisse / Aufträge / Einstellungen
- [ ] Sidebar Schichtleitung: zeigt mehr Nav-Items (Karte, Linien, Statistiken)
- [ ] Sidebar: aktiver NavItem fett (via `usePathname()`), inaktive Medium
- [ ] Sidebar: Ereignisse zeigt Sub-Items Offen/Archiv wenn aktiv
- [ ] SidebarKarte: bg `#2A2F3B`, Breite 92px, Icons zentriert
- [ ] SidebarKarte: Divider zwischen Logo-Bereich und Nav-Icons sichtbar
- [ ] SidebarKarte: aktiver Nav-Icon hat Hintergrund-Rect
- [ ] OperatorShell: Sidebar + Main nebeneinander, Main `overflow-auto`
- [ ] KarteShell: SidebarKarte kompakt + Map-Bereich füllt Rest, kein Scroll
- [ ] Tests: `npm run test:run` → alle 3 Suites grün, 0 Failures
- [ ] PrioritätBadge: 7 Test-Cases pass
- [ ] StatusBadge: 20 Test-Cases pass (18 Label-Cases + 2 percent-Cases)
- [ ] SearchBar: 5 Test-Cases pass

---

## Hinweis: Icon-Platzhalter

Für Sprint 2 werden alle Nav-Icons als einfache Platzhalter-SVGs implementiert
(z.B. Rechteck oder Kreis). Die korrekten SVG-Pfade kommen per Figma-Export in
Sprint 3, wenn die Screens implementiert werden. Alle Platzhalter mit `{/* TODO: Icon Figma #<node-id> */}` markieren.

---

## Nächste Session (Sprint 3)

Nach Sprint 2 weitermachen mit:
- **OR-08 — EreignisListView** (SearchBar + Tab + ListHeader + EreignisListRow)
- **MO-04 — EreignisListRow** (Deps: AT-01 PrioritätBadge, AT-02 StatusBadge)
- **SC-03 — Ereignisansicht** (erster vollständiger Screen: TM-01 + OR-08)

Figma-Refs für Sprint 3:
- Ereignisansicht: `#501:17241`
- EreignisListRow Template: `EL-80d30c45` (in `#501:17243`)
- Toolbar-Bereich: `#516:19538` (Ereignisansicht mit Filter)
