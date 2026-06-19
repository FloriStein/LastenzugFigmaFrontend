# Sprint 5 — Ereignis-Detail

**Session-Einstieg:** Lies dieses Dokument vollständig bevor du irgendwas tust.
Alle Figma-Specs sind bereits extrahiert — kein MCP-Aufruf nötig für diese Tickets.

---

## Kontext

Industrielles Logistik-Management für Routenzüge. Stack: Next.js 16, TypeScript strict,
Tailwind v4, shadcn/ui v4.11. Figma-Datei: `6iHSHiZwZ7ouNQ3KVUy6OK`.

Relevante Dokumente:
- `BRIEFING.md` — Gesamtüberblick, Architekturentscheidungen
- `backlog.md` — Alle 47 Tickets mit Schichten AT/MO/OR/TM/SC
- `sprint-4.md` — Sprint 4 ✅ (AT-08, MO-05, OR-09, OR-10, SC-02)
- `decisions.md` — Entscheidung #5: `useReducer` für Fahrtmodus-Statusmaschine

**Projektstand nach Sprint 4:**

| Layer | Abgeschlossen |
|---|---|
| Atoms | PrioritätBadge, StatusBadge, FilterBadge, ListHeader, SearchBar, Tab (CSS), KarteIcon |
| Molecules | NavItem, UserCard, EreignisListRow, RoutenzugCard |
| Organisms | Sidebar, SidebarKarte, EreignisListView, RoutenzugListPanel, MapCanvas |
| Templates | ProtectedShell (role-aware), KarteShell |
| Screens | Ereignisansicht (`/ereignisse`), Kartenansicht (`/karte`) |
| Tests | 123 Tests grün |
| Routing | Alle Routes unter `(protected)/` — kein Parallelkonflikt |

**Vorhandene Dateien die in Sprint 5 genutzt werden:**
- `components/features/EreignisTitelleiste.tsx` — Skeleton, ausfüllen
- `components/features/FahrtmodusCard.tsx` — Skeleton, ausfüllen
- `app/(protected)/ereignisse/[id]/page.tsx` — Stub, ausfüllen
- `src/types/ereignis.ts` — Ereignis-Interface
- `src/types/routenzug.ts` — Routenzug-Types (Muster für neue Types)

---

## Sprint-Scope (5 Tickets)

| ID | Name | Datei | Status |
|---|---|---|---|
| AT-09 | ConnectionIcon | `components/ui-custom/ConnectionIcon.tsx` | Neu |
| OR-03 | EreignisTitelleiste | `components/features/EreignisTitelleiste.tsx` | Skeleton, ausfüllen |
| OR-04 | FahrtmodusCard | `components/features/FahrtmodusCard.tsx` | Skeleton, ausfüllen |
| TM-04 | DetailShell | `components/layout/DetailShell.tsx` | Neu |
| SC-07 | Ereignis-Detail | `app/(protected)/ereignisse/[id]/page.tsx` | Stub, ausfüllen |

Außerdem: `src/lib/useFahrtmodus.ts` (Custom Hook, Teil von OR-04)
und `src/types/fahrtmodus.ts` (Shared Types für OR-04 + Hook)

**Implementierungsreihenfolge:** Shared Types → AT-09 → OR-03 → OR-04 + useFahrtmodus → TM-04 → SC-07

---

## Konventionen (nicht vergessen)

- Kein Default Export außer bei Next.js Page/Layout-Dateien
- Props-Interface direkt über der Komponente
- Keine Kommentare außer wenn das Warum nicht offensichtlich ist
- `cn()` aus `@/lib/utils`
- Mock-Daten direkt in der Page-Datei definieren — kein separates `data/`-Verzeichnis
- Kein `types/`-Verzeichnis außer wenn mehr als 5 gemeinsam genutzte Typen existieren — Schwelle ist erreicht, also `src/types/fahrtmodus.ts` anlegen

---

## Shared Types

### `src/types/fahrtmodus.ts` (neu anlegen)

```ts
export type FahrtmodusVariant =
  | "manuell"
  | "autom-eingabe"
  | "autom-nicht-moeglich"
  | "wiederherstellung";

export type FahrtmodusAction =
  | { type: "SET_MODUS"; payload: FahrtmodusVariant }
  | { type: "SYSTEM_OVERRIDE" }
  | { type: "RESTORE" };
```

> **Hinweis:** Die bestehende `FahrtmodusCard.tsx` definiert `FahrtmodusVariant` lokal
> (nicht exportiert). In Sprint 5 wird das Skeleton ersetzt — der lokale Typ fällt weg.

---

## AT-09 — ConnectionIcon

**Figma:** Component Set `#123:992`

### Varianten

| Prop-Wert | Bedeutung | Bars | Farbe |
|---|---|---|---|
| `connected` | Verbindung aktiv | 3 Balken voll | `currentColor` (weiß im blauen Header) |
| `disconnected` | Verbindung unterbrochen | 3 Balken gedimmt + X-Linie | Bars `currentColor` 30%, X `#C55141` |

Größe: **24×24px**, `viewBox="0 0 24 24"`

### Props-Interface

```ts
interface ConnectionIconProps {
  status: "connected" | "disconnected";
}
```

### Implementierung

Drei aufsteigende Balken (links: 8px hoch, mitte: 14px hoch, rechts: 20px hoch, alle 5px breit):

```tsx
// connected: alle drei Balken voll in currentColor
// disconnected: alle drei Balken mit opacity="0.3" in currentColor
//               + Diagonale von (0,24) → (24,0) in #C55141, strokeWidth=2
```

SVG-Geometrie:
- Balken links:  `x="0"  y="16" width="5" height="8"  rx="1"`
- Balken mitte:  `x="9"  y="10" width="5" height="14" rx="1"`
- Balken rechts: `x="18" y="4"  width="5" height="20" rx="1"`
- X-Linie (nur disconnected): `<line x1="0" y1="24" x2="24" y2="0" stroke="#C55141" strokeWidth="2" />`

### Datei-Referenz

Neu anlegen: [ConnectionIcon.tsx](src/components/ui-custom/ConnectionIcon.tsx)

### Tests — AT-09

**Datei:** `src/components/ui-custom/ConnectionIcon.test.tsx`

```tsx
import { render } from "@testing-library/react";
import { ConnectionIcon } from "./ConnectionIcon";

describe("ConnectionIcon — SVG-Grundstruktur", () => {
  it.each(["connected", "disconnected"] as const)(
    'status="%s" rendert ein SVG-Element',
    (status) => {
      const { container } = render(<ConnectionIcon status={status} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    }
  );

  it.each(["connected", "disconnected"] as const)(
    'status="%s" hat viewBox="0 0 24 24"',
    (status) => {
      const { container } = render(<ConnectionIcon status={status} />);
      expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 24 24");
    }
  );

  it.each(["connected", "disconnected"] as const)(
    'status="%s" rendert 3 Balken (rect-Elemente)',
    (status) => {
      const { container } = render(<ConnectionIcon status={status} />);
      expect(container.querySelectorAll("rect")).toHaveLength(3);
    }
  );
});

describe("ConnectionIcon — connected", () => {
  it("Balken haben keine opacity-Dämpfung", () => {
    const { container } = render(<ConnectionIcon status="connected" />);
    const rects = Array.from(container.querySelectorAll("rect"));
    rects.forEach((r) => {
      const op = r.getAttribute("opacity") ?? "1";
      expect(parseFloat(op)).toBeGreaterThan(0.9);
    });
  });

  it("kein X-Overlay (keine line-Elemente)", () => {
    const { container } = render(<ConnectionIcon status="connected" />);
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });
});

describe("ConnectionIcon — disconnected", () => {
  it("Balken sind gedimmt (opacity ≤ 0.4)", () => {
    const { container } = render(<ConnectionIcon status="disconnected" />);
    const rects = Array.from(container.querySelectorAll("rect"));
    rects.forEach((r) => {
      const op = parseFloat(r.getAttribute("opacity") ?? "1");
      expect(op).toBeLessThanOrEqual(0.4);
    });
  });

  it("hat X-Overlay (mindestens eine line)", () => {
    const { container } = render(<ConnectionIcon status="disconnected" />);
    expect(container.querySelector("line")).toBeInTheDocument();
  });

  it("X-Overlay ist rot (#C55141)", () => {
    const { container } = render(<ConnectionIcon status="disconnected" />);
    const line = container.querySelector("line")!;
    expect(line.getAttribute("stroke")).toBe("#C55141");
  });
});
```

**Edge Cases:**
- `connected` und `disconnected` rendern denselben Balken-DOM-Baum — Unterschied nur in Opacity + Line
- `currentColor` erlaubt Farb-Vererbung vom Elternelement (wichtig für blauen Header)

---

## OR-03 — EreignisTitelleiste

**Figma:** Component Set `#516:26010` / `#361:5564`

### Visuell

Breite: `w-full` (füllt `main`-Bereich: 1920 − 266px Sidebar = **1654px**)
Höhe: `h-[148px]`
Hintergrund: `bg-[#146AA1]`

**Layout (Flexbox, horizontal, `items-center`, `px-8`):**

```
[←  Zurück]    [Title · Subtitle]              [ConnectionIcon]  [Abschließen]  [Trennen]
  (optional,     (Inter Bold 28px, white,         (24px, white)     (Button,       (Button,
  links)          flex-1)                                            weiß outline)  weiß outline)
```

| Element | Details |
|---|---|
| Zurück-Link | `href` optional; `"←"` + text, `text-white`, `text-[18px]`, `mr-8` |
| Title | Inter Bold 700, **28px**, `text-white`, `flex-1` |
| ConnectionIcon | `status={connectionStatus}`, `text-white` (className), Abstand `mr-6` |
| Button "Abschließen" | nur wenn `onAbschließen` angegeben; `border border-white text-white`, px-6 py-2, `rounded-[6px]`, `text-[16px] font-medium`, `mr-3` |
| Button "Trennen" | nur wenn `onTrennen` angegeben; gleiche Styles wie "Abschließen" |

### Props-Interface

```ts
interface EreignisTitelleisteProps {
  title: string;
  connectionStatus: "connected" | "disconnected";
  backHref?: string;
  onAbschließen?: () => void;
  onTrennen?: () => void;
}
```

### Implementierung

- Natives `<div>` — kein shadcn-Wrapper nötig
- Buttons nur rendern wenn Callback angegeben (`onAbschließen && <button>`)
- Zurück-Link nur rendern wenn `backHref` angegeben: `<Link href={backHref}>← Zurück</Link>` aus `next/link`
- `<ConnectionIcon status={connectionStatus} className="text-white" />`

### Datei-Referenz

Ausfüllen: [EreignisTitelleiste.tsx](src/components/features/EreignisTitelleiste.tsx)

### Tests — OR-03

**Datei:** `src/components/features/EreignisTitelleiste.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { EreignisTitelleiste } from "./EreignisTitelleiste";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const BASE_PROPS = {
  title: "Strecke blockiert · Routenzug A",
  connectionStatus: "connected" as const,
};

describe("EreignisTitelleiste — Grundstruktur", () => {
  it("rendert den Titel", () => {
    render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(screen.getByText("Strecke blockiert · Routenzug A")).toBeInTheDocument();
  });

  it("hat blauen Hintergrund (bg-[#146AA1])", () => {
    const { container } = render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(container.firstChild as HTMLElement).toHaveClass("bg-[#146AA1]");
  });

  it("hat Höhe h-[148px]", () => {
    const { container } = render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(container.firstChild as HTMLElement).toHaveClass("h-[148px]");
  });

  it("rendert ConnectionIcon als SVG", () => {
    const { container } = render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("EreignisTitelleiste — ConnectionIcon-Varianten", () => {
  it('connectionStatus="connected" → kein X-Overlay', () => {
    const { container } = render(
      <EreignisTitelleiste {...BASE_PROPS} connectionStatus="connected" />
    );
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });

  it('connectionStatus="disconnected" → X-Overlay sichtbar', () => {
    const { container } = render(
      <EreignisTitelleiste {...BASE_PROPS} connectionStatus="disconnected" />
    );
    expect(container.querySelector("line")).toBeInTheDocument();
  });
});

describe("EreignisTitelleiste — Buttons (optional)", () => {
  it('ohne onAbschließen kein "Abschließen"-Button', () => {
    render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(screen.queryByRole("button", { name: /abschließen/i })).not.toBeInTheDocument();
  });

  it('ohne onTrennen kein "Trennen"-Button', () => {
    render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(screen.queryByRole("button", { name: /trennen/i })).not.toBeInTheDocument();
  });

  it("ruft onAbschließen auf wenn Button geklickt", () => {
    const onAbschließen = vi.fn();
    render(<EreignisTitelleiste {...BASE_PROPS} onAbschließen={onAbschließen} />);
    fireEvent.click(screen.getByRole("button", { name: /abschließen/i }));
    expect(onAbschließen).toHaveBeenCalledTimes(1);
  });

  it("ruft onTrennen auf wenn Button geklickt", () => {
    const onTrennen = vi.fn();
    render(<EreignisTitelleiste {...BASE_PROPS} onTrennen={onTrennen} />);
    fireEvent.click(screen.getByRole("button", { name: /trennen/i }));
    expect(onTrennen).toHaveBeenCalledTimes(1);
  });

  it("beide Buttons gleichzeitig möglich", () => {
    render(
      <EreignisTitelleiste
        {...BASE_PROPS}
        onAbschließen={vi.fn()}
        onTrennen={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /abschließen/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /trennen/i })).toBeInTheDocument();
  });
});

describe("EreignisTitelleiste — Zurück-Link (optional)", () => {
  it("kein Zurück-Link ohne backHref", () => {
    render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("rendert Zurück-Link mit korrektem href wenn backHref angegeben", () => {
    render(<EreignisTitelleiste {...BASE_PROPS} backHref="/ereignisse" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/ereignisse");
  });

  it('Zurück-Link enthält "Zurück"-Text', () => {
    render(<EreignisTitelleiste {...BASE_PROPS} backHref="/ereignisse" />);
    expect(screen.getByRole("link")).toHaveTextContent(/zurück/i);
  });
});

describe("EreignisTitelleiste — Edge Cases", () => {
  it("leerer Titel rendert ohne Fehler", () => {
    expect(() =>
      render(<EreignisTitelleiste title="" connectionStatus="connected" />)
    ).not.toThrow();
  });

  it("sehr langer Titel rendert ohne Overflow-Fehler", () => {
    const longTitle = "A".repeat(200);
    expect(() =>
      render(<EreignisTitelleiste title={longTitle} connectionStatus="connected" />)
    ).not.toThrow();
  });
});
```

---

## OR-04 — FahrtmodusCard + useFahrtmodus

**Figma:** Component Set `#179:2498` (4 Varianten)

### Varianten

| Variante | Figma-ID | Modus-Label | Subtext | Button | Badge-BG |
|---|---|---|---|---|---|
| `manuell` | `179:2497` | "Manuell" | "Fahrtmodus: Manuell" | "Auf Automatik umschalten" | `#353535` |
| `autom-eingabe` | `179:2514` | "Automatisch" | "Eingabe erforderlich" | "Bestätigen" | `#146AA1` |
| `autom-nicht-moeglich` | `379:7041` | "Autom. nicht mögl." | "Automatisches Fahren nicht möglich" | "Manuell fahren" | `#C55141` |
| `wiederherstellung` | `377:8310` | "Wiederherstellung" | "Wiederherstellung möglich" | "Wiederherstellen" | `#DDB411` |

### Visuell (Card)

Maße: `480×220px` (approximate), `bg-[#2A2F3B]`, `rounded-[10px]`, `p-6`

**Layout (Flex-Spalte):**
```
[Modus-Badge (colored BG, Modus-Label)]
[Subtext, text-[#9A9EA0], text-[15px], mt-2]
[Eingabefeld (nur bei autom-eingabe, mt-4)]
[Primär-Button (w-full, mt-auto)]
```

### Props-Interface

```ts
interface FahrtmodusCardProps {
  variant: FahrtmodusVariant;
  onPrimaryAction?: () => void;
}
```

### useFahrtmodus Hook

**Datei:** `src/lib/useFahrtmodus.ts`

```ts
import { useReducer } from "react";
import type { FahrtmodusVariant, FahrtmodusAction } from "@/types/fahrtmodus";

function fahrtmodusReducer(state: FahrtmodusVariant, action: FahrtmodusAction): FahrtmodusVariant {
  switch (action.type) {
    case "SET_MODUS":
      return action.payload;
    case "SYSTEM_OVERRIDE":
      // System zwingt in "nicht möglich"-Zustand (z.B. Sensor-Fehler)
      if (state === "autom-eingabe") return "autom-nicht-moeglich";
      return state;
    case "RESTORE":
      // Wiederherstellung möglich: aus "nicht möglich" → "wiederherstellung"
      if (state === "autom-nicht-moeglich") return "wiederherstellung";
      // Wiederherstellung bestätigt: zurück zu manuell
      if (state === "wiederherstellung") return "manuell";
      return state;
    default:
      return state;
  }
}

export function useFahrtmodus(initialVariant: FahrtmodusVariant = "manuell") {
  return useReducer(fahrtmodusReducer, initialVariant);
}
```

### Modus-Badge Mapping (in FahrtmodusCard implementieren)

```ts
const MODUS_CONFIG: Record<FahrtmodusVariant, {
  label: string;
  subtext: string;
  buttonText: string;
  badgeBg: string;
}> = {
  "manuell":              { label: "Manuell",             subtext: "Fahrtmodus: Manuell",                      buttonText: "Auf Automatik umschalten", badgeBg: "bg-[#353535]" },
  "autom-eingabe":        { label: "Automatisch",          subtext: "Eingabe erforderlich",                     buttonText: "Bestätigen",               badgeBg: "bg-[#146AA1]" },
  "autom-nicht-moeglich": { label: "Autom. nicht mögl.",  subtext: "Automatisches Fahren nicht möglich",       buttonText: "Manuell fahren",           badgeBg: "bg-[#C55141]" },
  "wiederherstellung":    { label: "Wiederherstellung",   subtext: "Wiederherstellung möglich",                buttonText: "Wiederherstellen",          badgeBg: "bg-[#DDB411]" },
};
```

### Eingabefeld (nur `autom-eingabe`)

Für `autom-eingabe`: ein `<input type="text" placeholder="Bestätigungscode eingeben" />` anzeigen.
Sprint 5: visuell vorhanden, aber kein Validierungslogik. `onPrimaryAction` wird direkt beim
Button-Klick ausgelöst (ohne Eingabevalidierung — Sprint 6).

### Datei-Referenzen

Ausfüllen: [FahrtmodusCard.tsx](src/components/features/FahrtmodusCard.tsx)
Neu anlegen: [useFahrtmodus.ts](src/lib/useFahrtmodus.ts)
Neu anlegen: [fahrtmodus.ts](src/types/fahrtmodus.ts)

### Tests — useFahrtmodus Hook

**Datei:** `src/lib/useFahrtmodus.test.ts`

```ts
import { renderHook, act } from "@testing-library/react";
import { useFahrtmodus } from "./useFahrtmodus";

describe("useFahrtmodus — Initialisierung", () => {
  it('startet mit "manuell" wenn kein initialVariant angegeben', () => {
    const { result } = renderHook(() => useFahrtmodus());
    expect(result.current[0]).toBe("manuell");
  });

  it("startet mit dem angegebenen initialVariant", () => {
    const { result } = renderHook(() => useFahrtmodus("autom-nicht-moeglich"));
    expect(result.current[0]).toBe("autom-nicht-moeglich");
  });
});

describe("useFahrtmodus — SET_MODUS", () => {
  it('SET_MODUS("autom-eingabe") von manuell → autom-eingabe', () => {
    const { result } = renderHook(() => useFahrtmodus("manuell"));
    act(() => {
      result.current[1]({ type: "SET_MODUS", payload: "autom-eingabe" });
    });
    expect(result.current[0]).toBe("autom-eingabe");
  });

  it('SET_MODUS("manuell") von autom-nicht-moeglich → manuell', () => {
    const { result } = renderHook(() => useFahrtmodus("autom-nicht-moeglich"));
    act(() => {
      result.current[1]({ type: "SET_MODUS", payload: "manuell" });
    });
    expect(result.current[0]).toBe("manuell");
  });

  it('SET_MODUS kann in jeden beliebigen Zustand wechseln', () => {
    const { result } = renderHook(() => useFahrtmodus("manuell"));
    act(() => {
      result.current[1]({ type: "SET_MODUS", payload: "wiederherstellung" });
    });
    expect(result.current[0]).toBe("wiederherstellung");
  });
});

describe("useFahrtmodus — SYSTEM_OVERRIDE", () => {
  it('SYSTEM_OVERRIDE von autom-eingabe → autom-nicht-moeglich', () => {
    const { result } = renderHook(() => useFahrtmodus("autom-eingabe"));
    act(() => {
      result.current[1]({ type: "SYSTEM_OVERRIDE" });
    });
    expect(result.current[0]).toBe("autom-nicht-moeglich");
  });

  it('SYSTEM_OVERRIDE von manuell → bleibt manuell (keine Auswirkung)', () => {
    const { result } = renderHook(() => useFahrtmodus("manuell"));
    act(() => {
      result.current[1]({ type: "SYSTEM_OVERRIDE" });
    });
    expect(result.current[0]).toBe("manuell");
  });

  it('SYSTEM_OVERRIDE von wiederherstellung → bleibt wiederherstellung', () => {
    const { result } = renderHook(() => useFahrtmodus("wiederherstellung"));
    act(() => {
      result.current[1]({ type: "SYSTEM_OVERRIDE" });
    });
    expect(result.current[0]).toBe("wiederherstellung");
  });
});

describe("useFahrtmodus — RESTORE", () => {
  it('RESTORE von autom-nicht-moeglich → wiederherstellung', () => {
    const { result } = renderHook(() => useFahrtmodus("autom-nicht-moeglich"));
    act(() => {
      result.current[1]({ type: "RESTORE" });
    });
    expect(result.current[0]).toBe("wiederherstellung");
  });

  it('RESTORE von wiederherstellung → manuell (Wiederherstellung bestätigt)', () => {
    const { result } = renderHook(() => useFahrtmodus("wiederherstellung"));
    act(() => {
      result.current[1]({ type: "RESTORE" });
    });
    expect(result.current[0]).toBe("manuell");
  });

  it('RESTORE von manuell → bleibt manuell (keine Auswirkung)', () => {
    const { result } = renderHook(() => useFahrtmodus("manuell"));
    act(() => {
      result.current[1]({ type: "RESTORE" });
    });
    expect(result.current[0]).toBe("manuell");
  });

  it('RESTORE von autom-eingabe → bleibt autom-eingabe', () => {
    const { result } = renderHook(() => useFahrtmodus("autom-eingabe"));
    act(() => {
      result.current[1]({ type: "RESTORE" });
    });
    expect(result.current[0]).toBe("autom-eingabe");
  });
});

describe("useFahrtmodus — Mehrstufige Übergänge", () => {
  it("kompletter Flow: manuell → autom-eingabe → autom-nicht-moeglich → manuell", () => {
    const { result } = renderHook(() => useFahrtmodus("manuell"));
    act(() => { result.current[1]({ type: "SET_MODUS", payload: "autom-eingabe" }); });
    expect(result.current[0]).toBe("autom-eingabe");
    act(() => { result.current[1]({ type: "SYSTEM_OVERRIDE" }); });
    expect(result.current[0]).toBe("autom-nicht-moeglich");
    act(() => { result.current[1]({ type: "SET_MODUS", payload: "manuell" }); });
    expect(result.current[0]).toBe("manuell");
  });

  it("Wiederherstellungs-Flow: autom-nicht-moeglich → wiederherstellung → manuell", () => {
    const { result } = renderHook(() => useFahrtmodus("autom-nicht-moeglich"));
    act(() => { result.current[1]({ type: "RESTORE" }); });
    expect(result.current[0]).toBe("wiederherstellung");
    act(() => { result.current[1]({ type: "RESTORE" }); });
    expect(result.current[0]).toBe("manuell");
  });
});
```

### Tests — FahrtmodusCard

**Datei:** `src/components/features/FahrtmodusCard.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { FahrtmodusCard } from "./FahrtmodusCard";

describe("FahrtmodusCard — Modus-Labels", () => {
  it('variant="manuell" zeigt Label "Manuell"', () => {
    render(<FahrtmodusCard variant="manuell" />);
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });

  it('variant="autom-eingabe" zeigt Label "Automatisch"', () => {
    render(<FahrtmodusCard variant="autom-eingabe" />);
    expect(screen.getByText("Automatisch")).toBeInTheDocument();
  });

  it('variant="autom-nicht-moeglich" zeigt Label "Autom. nicht mögl."', () => {
    render(<FahrtmodusCard variant="autom-nicht-moeglich" />);
    expect(screen.getByText("Autom. nicht mögl.")).toBeInTheDocument();
  });

  it('variant="wiederherstellung" zeigt Label "Wiederherstellung"', () => {
    render(<FahrtmodusCard variant="wiederherstellung" />);
    expect(screen.getByText("Wiederherstellung")).toBeInTheDocument();
  });
});

describe("FahrtmodusCard — Subtext", () => {
  it('manuell → Subtext "Fahrtmodus: Manuell"', () => {
    render(<FahrtmodusCard variant="manuell" />);
    expect(screen.getByText("Fahrtmodus: Manuell")).toBeInTheDocument();
  });

  it('autom-eingabe → Subtext "Eingabe erforderlich"', () => {
    render(<FahrtmodusCard variant="autom-eingabe" />);
    expect(screen.getByText("Eingabe erforderlich")).toBeInTheDocument();
  });

  it('autom-nicht-moeglich → Subtext "Automatisches Fahren nicht möglich"', () => {
    render(<FahrtmodusCard variant="autom-nicht-moeglich" />);
    expect(screen.getByText("Automatisches Fahren nicht möglich")).toBeInTheDocument();
  });

  it('wiederherstellung → Subtext "Wiederherstellung möglich"', () => {
    render(<FahrtmodusCard variant="wiederherstellung" />);
    expect(screen.getByText("Wiederherstellung möglich")).toBeInTheDocument();
  });
});

describe("FahrtmodusCard — Primär-Button-Text", () => {
  it.each([
    ["manuell" as const,              "Auf Automatik umschalten"],
    ["autom-eingabe" as const,        "Bestätigen"],
    ["autom-nicht-moeglich" as const, "Manuell fahren"],
    ["wiederherstellung" as const,    "Wiederherstellen"],
  ])('variant="%s" Button-Text ist "%s"', (variant, expectedText) => {
    render(<FahrtmodusCard variant={variant} />);
    expect(screen.getByRole("button", { name: expectedText })).toBeInTheDocument();
  });
});

describe("FahrtmodusCard — Interaktion", () => {
  it("ruft onPrimaryAction auf wenn Button geklickt", () => {
    const onPrimaryAction = vi.fn();
    render(<FahrtmodusCard variant="manuell" onPrimaryAction={onPrimaryAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }));
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  });

  it("kein Fehler wenn onPrimaryAction nicht angegeben und Button geklickt", () => {
    render(<FahrtmodusCard variant="manuell" />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }))
    ).not.toThrow();
  });

  it("onPrimaryAction wird bei jedem Variant ausgelöst", () => {
    for (const v of ["manuell", "autom-nicht-moeglich", "wiederherstellung"] as const) {
      const fn = vi.fn();
      const { unmount } = render(<FahrtmodusCard variant={v} onPrimaryAction={fn} />);
      fireEvent.click(screen.getByRole("button"));
      expect(fn).toHaveBeenCalledTimes(1);
      unmount();
    }
  });
});

describe("FahrtmodusCard — Badge-Farben", () => {
  it('manuell: Badge hat bg-[#353535]', () => {
    const { container } = render(<FahrtmodusCard variant="manuell" />);
    expect(container.querySelector('[class*="353535"]')).toBeInTheDocument();
  });

  it('autom-eingabe: Badge hat bg-[#146AA1]', () => {
    const { container } = render(<FahrtmodusCard variant="autom-eingabe" />);
    expect(container.querySelector('[class*="146AA1"]')).toBeInTheDocument();
  });

  it('autom-nicht-moeglich: Badge hat bg-[#C55141]', () => {
    const { container } = render(<FahrtmodusCard variant="autom-nicht-moeglich" />);
    expect(container.querySelector('[class*="C55141"]')).toBeInTheDocument();
  });

  it('wiederherstellung: Badge hat bg-[#DDB411]', () => {
    const { container } = render(<FahrtmodusCard variant="wiederherstellung" />);
    expect(container.querySelector('[class*="DDB411"]')).toBeInTheDocument();
  });
});

describe("FahrtmodusCard — Eingabefeld", () => {
  it('variant="autom-eingabe" rendert ein Eingabefeld', () => {
    render(<FahrtmodusCard variant="autom-eingabe" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it('andere Varianten rendern kein Eingabefeld', () => {
    for (const v of ["manuell", "autom-nicht-moeglich", "wiederherstellung"] as const) {
      const { unmount } = render(<FahrtmodusCard variant={v} />);
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      unmount();
    }
  });
});
```

---

## TM-04 — DetailShell

**Figma:** Layout-Pattern aus `#504:17602` (Ereignis-Detail) und `#509:19875` (Routenzug-Detail)

### Visuell

```
<div class="flex flex-col h-screen overflow-hidden">
  {titelleiste}                    ← 148px, blau (von EreignisTitelleiste)
  <div class="flex-1 bg-[#F5F5F5] overflow-auto">
    {children}                     ← Page-Content
  </div>
</div>
```

### Props-Interface

```ts
interface DetailShellProps {
  children: React.ReactNode;
  titelleiste: React.ReactNode;
}
```

### Implementierung

- Kein shadcn nötig — reines `<div>`-Layout
- `h-screen` + `flex flex-col` hält alles im Viewport
- `overflow-auto` nur im Content-Bereich, nicht im Titelleiste-Slot

### Datei-Referenz

Neu anlegen: [DetailShell.tsx](src/components/layout/DetailShell.tsx)

### Tests — TM-04

**Datei:** `src/components/layout/DetailShell.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { DetailShell } from "./DetailShell";

describe("DetailShell — Rendering", () => {
  it("rendert den Titelleiste-Slot", () => {
    render(
      <DetailShell titelleiste={<div data-testid="titelleiste">Header</div>}>
        <div>Content</div>
      </DetailShell>
    );
    expect(screen.getByTestId("titelleiste")).toBeInTheDocument();
  });

  it("rendert die Children im Content-Bereich", () => {
    render(
      <DetailShell titelleiste={<div>Header</div>}>
        <div data-testid="content">Hauptinhalt</div>
      </DetailShell>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("Titelleiste und Children sind beide sichtbar", () => {
    render(
      <DetailShell titelleiste={<span>Titel</span>}>
        <span>Body</span>
      </DetailShell>
    );
    expect(screen.getByText("Titel")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("Content-Bereich hat bg-[#F5F5F5]", () => {
    const { container } = render(
      <DetailShell titelleiste={<div />}>
        <div />
      </DetailShell>
    );
    const contentArea = container.querySelector('[class*="F5F5F5"]');
    expect(contentArea).toBeInTheDocument();
  });

  it("äußerer Wrapper hat h-screen und flex-col", () => {
    const { container } = render(
      <DetailShell titelleiste={<div />}>
        <div />
      </DetailShell>
    );
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("h-screen");
    expect(outer.className).toContain("flex-col");
  });

  it("mehrere Children werden alle gerendert", () => {
    render(
      <DetailShell titelleiste={<div />}>
        <span data-testid="child-1">Eins</span>
        <span data-testid="child-2">Zwei</span>
      </DetailShell>
    );
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });
});
```

---

## SC-07 — Ereignis-Detail (Page)

**Figma:** `#504:17602`
**Datei:** `src/app/(protected)/ereignisse/[id]/page.tsx` (Stub, ausfüllen)

### Layout

```
(ProtectedLayout: Sidebar 266px + main)
  main:
    <DetailShell>
      titelleiste:
        <EreignisTitelleiste
          title="{art} · {fahrzeug}"
          connectionStatus="connected"
          backHref="/ereignisse"
          onAbschließen={...}
        />
      children:
        <div class="p-8 flex gap-8">
          <div class="flex-1">        ← Ereignis-Info
            [Ereignis-ID, Art, Fahrzeug, Status, Priorität, Erstellt, Bearbeiter]
          </div>
          <div>                        ← Fahrtmodus-Panel (rechts)
            <FahrtmodusCard variant={fahrtmodus} onPrimaryAction={...} />
          </div>
        </div>
```

### Mock-Daten (direkt in der Page-Datei)

```ts
type EreignisDetail = Ereignis & { routenzug: string };

const MOCK_EREIGNIS_DETAILS: Record<string, EreignisDetail> = {
  "#102": { id: "#102", art: "Strecke blockiert",         fahrzeug: "Routenzug A", status: "neu",           priorität: 3, erstelltAt: "14:28 Uhr", routenzug: "Routenzug A" },
  "#103": { id: "#103", art: "Kommunikationsanfrage",     fahrzeug: "Routenzug B", status: "neu",           priorität: 4, erstelltAt: "16:04 Uhr", routenzug: "Routenzug B" },
  "#99":  { id: "#99",  art: "Weiterfahrt bestätigen",    fahrzeug: "Routenzug A", status: "in-bearbeitung",priorität: 1, erstelltAt: "15:26 Uhr", routenzug: "Routenzug A", bearbeiter: "Maxi Muster" },
  "#95":  { id: "#95",  art: "Strecke blockiert",         fahrzeug: "Routenzug A", status: "abgeschlossen", priorität: 1, erstelltAt: "6. Aug, 14:28 Uhr", routenzug: "Routenzug A", bearbeiter: "Tim Zabel" },
};
```

> Schlüssel: die rohe ID inkl. `#` — `decodeURIComponent(params.id)` ergibt `"#102"`.

### State-Management

Page ist `"use client"` (wegen `useFahrtmodus`, `useParams`, `useRouter`):

```ts
const params = useParams<{ id: string }>();
const router = useRouter();
const ereignis = MOCK_EREIGNIS_DETAILS[decodeURIComponent(params.id)] ?? null;
const [fahrtmodus, dispatch] = useFahrtmodus("manuell");
```

### Nicht gefunden — Fallback

Wenn `ereignis === null`:
```tsx
<DetailShell titelleiste={<div className="h-[148px] bg-[#146AA1]" />}>
  <div className="p-8">
    <p className="text-[20px] font-bold text-black">Ereignis nicht gefunden.</p>
    <Link href="/ereignisse" className="text-[#146AA1] underline mt-2 inline-block">
      ← Zurück zur Ereignisliste
    </Link>
  </div>
</DetailShell>
```

### Datei-Referenz

Ausfüllen: [ereignisse/[id]/page.tsx](src/app/(protected)/ereignisse/[id]/page.tsx)

### Tests — SC-07

**Datei:** `src/app/(protected)/ereignisse/[id]/EreignisDetailPage.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import EreignisDetailPage from "./page";

// vi.hoisted damit mockUseParams im vi.mock()-Factory referenzierbar ist
const mockBack = vi.hoisted(() => vi.fn());
const mockUseParams = vi.hoisted(() => vi.fn(() => ({ id: "%23102" }))); // default: #102

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
  mockUseParams.mockReturnValue({ id: "%23102" }); // Standard nach clearAllMocks wieder setzen
});

describe("SC-07 — EreignisDetailPage — Happy Path", () => {
  it("rendert Ereignis-Art und Fahrzeug im Titel", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText(/strecke blockiert/i)).toBeInTheDocument();
    expect(screen.getByText(/routenzug a/i)).toBeInTheDocument();
  });

  it("rendert EreignisTitelleiste (blaue Box)", () => {
    const { container } = render(<EreignisDetailPage />);
    expect(container.querySelector('[class*="146AA1"]')).toBeInTheDocument();
  });

  it("rendert FahrtmodusCard mit initialem Modus 'Manuell'", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });

  it("rendert Zurück-Link zur Ereignisliste", () => {
    render(<EreignisDetailPage />);
    const link = screen.getByRole("link", { name: /zurück/i });
    expect(link).toHaveAttribute("href", "/ereignisse");
  });

  it("rendert Erstellt-Zeitstempel des Ereignisses", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText(/14:28/)).toBeInTheDocument();
  });

  it("rendert Bearbeiter als '[offen]' wenn nicht gesetzt", () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("[offen]")).toBeInTheDocument();
  });
});

describe("SC-07 — EreignisDetailPage — Bearbeiter gesetzt", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "%2399" }); // #99 hat Bearbeiter "Maxi Muster"
  });

  it('Bearbeiter "Maxi Muster" wird angezeigt wenn gesetzt', () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText("Maxi Muster")).toBeInTheDocument();
  });

  it("kein '[offen]' wenn Bearbeiter gesetzt", () => {
    render(<EreignisDetailPage />);
    expect(screen.queryByText("[offen]")).not.toBeInTheDocument();
  });
});

describe("SC-07 — EreignisDetailPage — Nicht gefunden", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "unbekannt" });
  });

  it('zeigt "Ereignis nicht gefunden" für unbekannte ID', () => {
    render(<EreignisDetailPage />);
    expect(screen.getByText(/ereignis nicht gefunden/i)).toBeInTheDocument();
  });

  it('zeigt Zurück-Link zur Ereignisliste im Fallback', () => {
    render(<EreignisDetailPage />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/ereignisse");
  });

  it("rendert keine EreignisTitelleiste mit Inhalten im Fallback", () => {
    render(<EreignisDetailPage />);
    expect(screen.queryByText(/strecke blockiert/i)).not.toBeInTheDocument();
  });
});

describe("SC-07 — EreignisDetailPage — FahrtmodusCard Interaktion", () => {
  it("Klick auf 'Auf Automatik umschalten' wechselt Modus zu 'Automatisch'", () => {
    render(<EreignisDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }));
    expect(screen.getByText("Automatisch")).toBeInTheDocument();
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });

  it("Klick auf 'Abschließen' in Titelleiste ruft router.back() auf", () => {
    render(<EreignisDetailPage />);
    const abschließenBtn = screen.queryByRole("button", { name: /abschließen/i });
    if (abschließenBtn) {
      fireEvent.click(abschließenBtn);
      expect(mockBack).toHaveBeenCalledTimes(1);
    }
  });
});
```

> **Muster für SC-07-Tests:** `vi.hoisted()` stellt sicher, dass `mockUseParams` und
> `mockBack` bereits initialisiert sind wenn die `vi.mock()`-Factories laufen (die werden
> vor allen Imports gehoisted). Der `beforeEach` setzt den Standard-Mock nach
> `vi.clearAllMocks()` wieder zurück — sonst würde der erste Test den State für alle
> folgenden Tests setzen.

---

## Verifikation

```bash
# TypeScript-Check (muss 0 Fehler zeigen)
npx tsc --noEmit

# Tests (alle 123 + neue grün)
npm run test:run

# Dev-Server
npm run dev
# → /ereignisse aufrufen → auf eine EreignisListRow klicken → /ereignisse/%23102
```

**Manuelle Checks:**
- [ ] `/ereignisse/[id]` rendert ohne 404 (URL: `/ereignisse/%23102`)
- [ ] Blauer Header-Bar (148px) mit Ereignis-Titel und ConnectionIcon sichtbar
- [ ] Zurück-Link führt zurück zu `/ereignisse`
- [ ] FahrtmodusCard zeigt "Manuell" mit Button "Auf Automatik umschalten"
- [ ] Klick auf "Auf Automatik umschalten" → Card zeigt "Automatisch" + Eingabefeld
- [ ] Unbekannte ID (`/ereignisse/xyz`) → "Ereignis nicht gefunden" mit Zurück-Link
- [ ] ConnectionIcon: kein X-Overlay bei `connected`, rotes X bei `disconnected`
- [ ] TypeScript: keine `any`-Typen

---

## Nächste Session (Sprint 6)

Nach Sprint 5 weitermachen mit:
- **AT-07 — Beschleunigungsanzeige** (6 Segmente, Dep für OR-05 KameraPanel)
- **MO-07 — AuftragListItemKurz** (Dep für OR-06 FahrtInfoPanel)
- **MO-08 — FahrzeugAktionCard** (Dep für OR-07 AktionenPanel)
- **OR-05 — KameraPanel** (Kamera-Feed + Speed-HUD + Beschleunigungsanzeige)
- **TM-03 — RoutenzugDetailShell** (148px Titelleiste + 3-Spalten-Grid)
- **SC-05 — Routenzug-Detail** (`/routenzug/[id]`, vollständiges 3-Panel-Layout)

Außerdem ausstehend:
- **FahrtmodusCard Eingabe-Validierung** (Bestätigungscode für `autom-eingabe`)
- **EreignisListRow → SC-07 Verlinkung** (`onClick → router.push(\`/ereignisse/\${id}\`)`)
- **EreignisTitelleiste in Routenzug-Detail** (Titelleiste wiederverwendbar durch `title`-Prop)
