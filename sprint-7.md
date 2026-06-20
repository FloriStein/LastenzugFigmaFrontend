# Sprint 7 — Briefing

## Scope

7 Tickets mit vollständigen Tests und Edge Cases.

| # | Ticket | Typ | Zieldatei(en) |
|---|--------|-----|---------------|
| 1 | SC-05-Link | Kartennavigation → Detail | `karte/page.tsx` |
| 2 | OR-07 | KommunikationPanel | neu + AktionenPanel update |
| 3 | MO-06 | AuftragListRow | neu |
| 4 | OR-11 | AuftragListView | neu |
| 5 | SC-04 | /auftraege Page | Stub ersetzen |
| 6 | SC-06 | /linien Page | Stub ersetzen |
| 7 | SC-01 | /login Page | Stub ersetzen |

## Implementierungsreihenfolge

1. SC-05-Link (karte/page.tsx, kein neues File)
2. OR-07 KommunikationPanel + AktionenPanel
3. MO-06 AuftragListRow
4. OR-11 AuftragListView
5. SC-04 /auftraege
6. SC-06 /linien
7. SC-01 /login

---

## Ticket 1 — SC-05-Link: RoutenzugCard → Detail-Navigation

### Figma
Keine eigene Node — das ist die Verlinkung aus der Kartenansicht (Sprint 4) zur Routenzug-Detailseite (Sprint 6).

### Was sich ändert

**`src/app/(protected)/karte/page.tsx`**

Zwei Fixes:

1. IDs in `MOCK_ROUTENZÜGE` auf Uppercase umbenennen, damit sie mit den Mock-Daten in `routenzug/[id]/page.tsx` übereinstimmen (`"RZ-A"`, `"RZ-B"`, `"RZ-C"`).
2. `useRouter` importieren und `onSelect` so verdrahten, dass ein Klick auf eine Karte zur Detailseite navigiert.

```tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KarteShell } from "@/components/layout/KarteShell";
import { RoutenzugListPanel } from "@/components/features/RoutenzugListPanel";
import type { Routenzug } from "@/types/routenzug";

const MapCanvas = dynamic(
  () => import("@/components/features/MapCanvas").then((m) => ({ default: m.MapCanvas })),
  { ssr: false }
);

const MOCK_ROUTENZÜGE: Routenzug[] = [
  {
    id: "RZ-A",
    name: "Routenzug A",
    aufträge: ["#212", "#209"],
    status: "fahrt-unterbrochen",
    position: { x: 1264, y: 626 },
  },
  {
    id: "RZ-B",
    name: "Routenzug B",
    aufträge: ["#210"],
    status: "fährt-automatisiert",
    position: { x: 774, y: 768 },
  },
  {
    id: "RZ-C",
    name: "Routenzug C",
    aufträge: [],
    status: "lädt",
    ladestand: 71,
    position: { x: 500, y: 400 },
  },
];

export default function KartePage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  function handleSelect(id: string) {
    setSelectedId(id);
    router.push(`/routenzug/${encodeURIComponent(id)}`);
  }

  return (
    <KarteShell activeItem="karte">
      <div className="flex h-full">
        <RoutenzugListPanel
          routenzüge={MOCK_ROUTENZÜGE}
          onSelect={handleSelect}
        />
        <div className="flex-1 relative">
          <MapCanvas
            routenzüge={MOCK_ROUTENZÜGE}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </KarteShell>
  );
}
```

### Tests — `src/app/(protected)/karte/KartePage.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import KartePage from "./page";

const mockPush = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/components/features/MapCanvas", () => ({
  MapCanvas: () => <div data-testid="map-canvas" />,
}));

vi.mock("@/components/features/RoutenzugListPanel", () => ({
  RoutenzugListPanel: ({
    routenzüge,
    onSelect,
  }: {
    routenzüge: { id: string; name: string }[];
    onSelect: (id: string) => void;
  }) => (
    <div>
      {routenzüge.map((rz) => (
        <button key={rz.id} onClick={() => onSelect(rz.id)}>
          {rz.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("@/components/layout/KarteShell", () => ({
  KarteShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

beforeEach(() => vi.clearAllMocks());

describe("SC-05-Link — Karte navigiert zur Detailseite", () => {
  it("Klick auf Routenzug A navigiert zu /routenzug/RZ-A", () => {
    render(<KartePage />);
    fireEvent.click(screen.getByRole("button", { name: "Routenzug A" }));
    expect(mockPush).toHaveBeenCalledWith("/routenzug/RZ-A");
  });

  it("Klick auf Routenzug B navigiert zu /routenzug/RZ-B", () => {
    render(<KartePage />);
    fireEvent.click(screen.getByRole("button", { name: "Routenzug B" }));
    expect(mockPush).toHaveBeenCalledWith("/routenzug/RZ-B");
  });

  it("Klick auf Routenzug C navigiert zu /routenzug/RZ-C", () => {
    render(<KartePage />);
    fireEvent.click(screen.getByRole("button", { name: "Routenzug C" }));
    expect(mockPush).toHaveBeenCalledWith("/routenzug/RZ-C");
  });

  it("router.push wird genau einmal aufgerufen", () => {
    render(<KartePage />);
    fireEvent.click(screen.getByRole("button", { name: "Routenzug A" }));
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("alle drei Routenzüge werden angezeigt", () => {
    render(<KartePage />);
    expect(screen.getByRole("button", { name: "Routenzug A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Routenzug B" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Routenzug C" })).toBeInTheDocument();
  });
});
```

---

## Ticket 2 — OR-07: KommunikationPanel

### Figma-Spec — Figma `#271:3115` (aktionen+komm Component Set)

#### Kommunikation-Tab States

**State 1 — `idle` (Default, 271:3114):**
- Tab: "Kommunikation" (kein Badge, `active=false`)
- Linke Spalte (bis Divider bei x≈223):
  - Button "Durchsage tätigen" — `173×77px`, `bg-[#E1E1E1] rounded-[10px]`, Icon 25×25 bei x=16,y=26
  - Button "Fahrgastkommunikation starten" — gleiche Größe darunter
- Rechte Spalte (nach Divider):
  - Text "Fahrgastkommunikation" — Inter Light 300 20px, `text-gray-muted`
  - Text "Keine aktuellen Anfragen" — Inter Regular 20px, `text-gray-muted`
  - Beide zentriert

**State 2 — `eingehend` (Variant7, 385:11806):**
- Tab: "Kommunikation (1)" (Badge = aktiver Zustand)
- Linke Spalte: identisch wie idle
- Rechte Spalte:
  - Vorschau-Bild `112×168px`, `rounded-[10px] bg-gray-300` (Kamera-Thumbnail)
  - Text "eingehender **Videoanruf** ..." — Inter Medium 12px (bold für "Videoanruf")
  - Annehmen-Button — `55×39px`, grün `bg-[#51A135]`, Icon (Telefon-Check)
  - Ablehnen-Button — `55×39px`, rot `bg-[#C55141]`, Icon (Telefon-X)

**State 3 — `aktiv` (Variant2, 271:3116):**
- Tab: "Kommunikation (1)"
- Linke Spalte: identisch
- Rechte Spalte:
  - Haupt-Videobild `282×168px`, `rounded-[10px] bg-gray-300`
  - Seiten-Bild `112×168px`, `rounded-[10px] bg-gray-300`
  - Text "**Videoanruf** 2:10min" — Inter Medium 12px Bold
  - Auflegen-Button — `bg-[#C55141] text-white rounded-[10px]`

#### Divider
- Idle: `w-px bg-black/10`
- Eingehend/Aktiv: `w-px bg-[#2A2F3B]/20`

### Neue Datei: `src/components/features/KommunikationPanel.tsx`

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type KommState = "idle" | "eingehend" | "aktiv";

interface KommunikationPanelProps {
  onStateChange?: (state: KommState) => void;
}

function PhoneCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4c.5-1 2-2 4-1l2 3-2 2a10 10 0 004 4l2-2 3 2c1 2 0 3.5-1 4C6 19 1 6 4 4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneXIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4c.5-1 2-2 4-1l2 3-2 2a10 10 0 004 4l2-2 3 2c1 2 0 3.5-1 4C6 19 1 6 4 4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 3l4 4M17 3l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AktionsButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-[173px] h-[77px] bg-[#E1E1E1] rounded-[10px] text-left px-3 py-2 text-[13px] font-semibold text-black hover:bg-[#D5D5D5] transition-colors"
    >
      {label}
    </button>
  );
}

export function KommunikationPanel({ onStateChange }: KommunikationPanelProps) {
  const [state, setState] = useState<KommState>("idle");

  function transition(next: KommState) {
    setState(next);
    onStateChange?.(next);
  }

  return (
    <div className="flex gap-4 h-full min-h-[160px]">
      <div className="flex flex-col gap-2 shrink-0">
        <AktionsButton label="Durchsage tätigen" onClick={() => transition("eingehend")} />
        <AktionsButton label="Fahrgastkommunikation starten" onClick={() => transition("eingehend")} />
      </div>

      <div className={cn("w-px self-stretch", state === "idle" ? "bg-black/10" : "bg-[#2A2F3B]/20")} />

      {state === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-[20px] font-light text-gray-muted">Fahrgastkommunikation</p>
          <p className="text-[20px] text-gray-muted">Keine aktuellen Anfragen</p>
        </div>
      )}

      {state === "eingehend" && (
        <div className="flex-1 flex gap-4 items-center">
          <div className="w-[112px] h-[168px] bg-gray-300 rounded-[10px] shrink-0" aria-label="Kamera-Vorschau" />
          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-medium">
              eingehender <strong>Videoanruf</strong> ...
            </p>
            <div className="flex gap-3">
              <button
                aria-label="Annehmen"
                onClick={() => transition("aktiv")}
                className="w-[55px] h-[39px] bg-[#51A135] text-white rounded-[6px] flex items-center justify-center hover:bg-[#449D3C] transition-colors"
              >
                <PhoneCheckIcon />
              </button>
              <button
                aria-label="Ablehnen"
                onClick={() => transition("idle")}
                className="w-[55px] h-[39px] bg-[#C55141] text-white rounded-[6px] flex items-center justify-center hover:bg-[#A8392C] transition-colors"
              >
                <PhoneXIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {state === "aktiv" && (
        <div className="flex-1 flex gap-3 items-center">
          <div className="w-[282px] h-[168px] bg-gray-300 rounded-[10px] shrink-0" aria-label="Haupt-Video" />
          <div className="w-[112px] h-[168px] bg-gray-300 rounded-[10px] shrink-0" aria-label="Seiten-Video" />
          <div className="flex flex-col gap-3 justify-center">
            <p className="text-[12px] font-medium">
              <strong>Videoanruf</strong> 2:10min
            </p>
            <button
              aria-label="Auflegen"
              onClick={() => transition("idle")}
              className="px-4 py-2 bg-[#C55141] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#A8392C] transition-colors"
            >
              Auflegen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Update: `src/components/features/AktionenPanel.tsx`

Änderungen:
1. `import { KommunikationPanel } from "@/components/features/KommunikationPanel"` hinzufügen
2. `type KommState = "idle" | "eingehend" | "aktiv"` definieren
3. `kommState` via `useState<KommState>("idle")` tracken
4. Tab-Label für Kommunikation-Tab: `kommState !== "idle" ? "Kommunikation (1)" : "Kommunikation"`
5. Placeholder durch `<KommunikationPanel onStateChange={setKommState} />` ersetzen

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FahrtmodusCard } from "@/components/features/FahrtmodusCard";
import { FahrzeugAktionCard } from "@/components/features/FahrzeugAktionCard";
import { KommunikationPanel } from "@/components/features/KommunikationPanel";
import type { FahrtmodusVariant } from "@/types/fahrtmodus";

type Tab = "fahrt" | "fahrzeug" | "kommunikation";
type KommState = "idle" | "eingehend" | "aktiv";

interface AktionenPanelProps {
  fahrtmodus: FahrtmodusVariant;
  onFahrtmodusAction?: () => void;
}

function NothaltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="7" width="6" height="6" fill="currentColor" />
    </svg>
  );
}

function LangsamIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M7 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const BASE_TABS: { id: Tab; baseLabel: string }[] = [
  { id: "fahrt", baseLabel: "Fahrt" },
  { id: "fahrzeug", baseLabel: "Fahrzeug" },
  { id: "kommunikation", baseLabel: "Kommunikation" },
];

export function AktionenPanel({ fahrtmodus, onFahrtmodusAction }: AktionenPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("fahrt");
  const [kommState, setKommState] = useState<KommState>("idle");

  return (
    <div className="bg-dark-surface rounded-[10px] p-4 flex flex-col gap-4">
      <div className="flex gap-6 border-b border-[#4A4F5B]">
        {BASE_TABS.map((tab) => {
          const label =
            tab.id === "kommunikation" && kommState !== "idle"
              ? "Kommunikation (1)"
              : tab.baseLabel;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-2 text-[14px] font-medium",
                activeTab === tab.id
                  ? "text-white border-b-2 border-blue-primary"
                  : "text-gray-muted"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {activeTab === "fahrt" && (
        <FahrtmodusCard variant={fahrtmodus} onPrimaryAction={onFahrtmodusAction} />
      )}

      {activeTab === "fahrzeug" && (
        <div className="flex flex-col gap-3">
          <FahrzeugAktionCard
            label="Nothalt"
            icon={<NothaltIcon />}
            variant="danger"
            onClick={() => {}}
          />
          <FahrzeugAktionCard
            label="Langsam fahren"
            icon={<LangsamIcon />}
            variant="warning"
            onClick={() => {}}
          />
        </div>
      )}

      {activeTab === "kommunikation" && (
        <KommunikationPanel onStateChange={setKommState} />
      )}
    </div>
  );
}
```

### Tests — `src/components/features/KommunikationPanel.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { KommunikationPanel } from "./KommunikationPanel";

describe("KommunikationPanel — Idle-State (Standard)", () => {
  it("zeigt 'Fahrgastkommunikation' Text im Idle", () => {
    render(<KommunikationPanel />);
    expect(screen.getByText("Fahrgastkommunikation")).toBeInTheDocument();
  });

  it("zeigt 'Keine aktuellen Anfragen' im Idle", () => {
    render(<KommunikationPanel />);
    expect(screen.getByText("Keine aktuellen Anfragen")).toBeInTheDocument();
  });

  it("zeigt 'Durchsage tätigen' Button", () => {
    render(<KommunikationPanel />);
    expect(screen.getByRole("button", { name: "Durchsage tätigen" })).toBeInTheDocument();
  });

  it("zeigt 'Fahrgastkommunikation starten' Button", () => {
    render(<KommunikationPanel />);
    expect(
      screen.getByRole("button", { name: "Fahrgastkommunikation starten" })
    ).toBeInTheDocument();
  });

  it("kein Annehmen-Button im Idle", () => {
    render(<KommunikationPanel />);
    expect(screen.queryByRole("button", { name: "Annehmen" })).not.toBeInTheDocument();
  });

  it("kein Auflegen-Button im Idle", () => {
    render(<KommunikationPanel />);
    expect(screen.queryByRole("button", { name: "Auflegen" })).not.toBeInTheDocument();
  });
});

describe("KommunikationPanel — Eingehend-State", () => {
  it("Klick 'Fahrgastkommunikation starten' wechselt zu Eingehend", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByText(/eingehender/i)).toBeInTheDocument();
  });

  it("zeigt 'eingehender Videoanruf ...' Text", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByText(/eingehender/i)).toBeInTheDocument();
  });

  it("zeigt 'Videoanruf' als Bold-Text", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    const strong = screen.getByText("Videoanruf");
    expect(strong.tagName).toBe("STRONG");
  });

  it("zeigt Annehmen-Button im Eingehend-State", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByRole("button", { name: "Annehmen" })).toBeInTheDocument();
  });

  it("zeigt Ablehnen-Button im Eingehend-State", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByRole("button", { name: "Ablehnen" })).toBeInTheDocument();
  });

  it("zeigt Kamera-Vorschau (aria-label='Kamera-Vorschau')", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByLabelText("Kamera-Vorschau")).toBeInTheDocument();
  });

  it("'Keine aktuellen Anfragen' verschwindet im Eingehend-State", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.queryByText("Keine aktuellen Anfragen")).not.toBeInTheDocument();
  });
});

describe("KommunikationPanel — Aktiv-State (Annehmen)", () => {
  function renderAktiv() {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Annehmen" }));
  }

  it("Annehmen → zeigt 'Videoanruf' Timer-Text", () => {
    renderAktiv();
    expect(screen.getByText(/Videoanruf/)).toBeInTheDocument();
  });

  it("Annehmen → zeigt Haupt-Video (aria-label='Haupt-Video')", () => {
    renderAktiv();
    expect(screen.getByLabelText("Haupt-Video")).toBeInTheDocument();
  });

  it("Annehmen → zeigt Seiten-Video (aria-label='Seiten-Video')", () => {
    renderAktiv();
    expect(screen.getByLabelText("Seiten-Video")).toBeInTheDocument();
  });

  it("Annehmen → zeigt Auflegen-Button", () => {
    renderAktiv();
    expect(screen.getByRole("button", { name: "Auflegen" })).toBeInTheDocument();
  });

  it("Annehmen → Annehmen/Ablehnen-Buttons verschwinden", () => {
    renderAktiv();
    expect(screen.queryByRole("button", { name: "Annehmen" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ablehnen" })).not.toBeInTheDocument();
  });

  it("Auflegen → zurück zu Idle", () => {
    renderAktiv();
    fireEvent.click(screen.getByRole("button", { name: "Auflegen" }));
    expect(screen.getByText("Keine aktuellen Anfragen")).toBeInTheDocument();
  });
});

describe("KommunikationPanel — Ablehnen", () => {
  it("Ablehnen → zurück zu Idle", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Ablehnen" }));
    expect(screen.getByText("Keine aktuellen Anfragen")).toBeInTheDocument();
  });

  it("Ablehnen → kein Kamera-Vorschau mehr", () => {
    render(<KommunikationPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Ablehnen" }));
    expect(screen.queryByLabelText("Kamera-Vorschau")).not.toBeInTheDocument();
  });
});

describe("KommunikationPanel — onStateChange Callback", () => {
  it("ruft onStateChange('eingehend') beim Starten auf", () => {
    const onChange = vi.fn();
    render(<KommunikationPanel onStateChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(onChange).toHaveBeenCalledWith("eingehend");
  });

  it("ruft onStateChange('aktiv') beim Annehmen auf", () => {
    const onChange = vi.fn();
    render(<KommunikationPanel onStateChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Annehmen" }));
    expect(onChange).toHaveBeenCalledWith("aktiv");
  });

  it("ruft onStateChange('idle') beim Ablehnen auf", () => {
    const onChange = vi.fn();
    render(<KommunikationPanel onStateChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Ablehnen" }));
    expect(onChange).toHaveBeenCalledWith("idle");
  });

  it("ruft onStateChange('idle') beim Auflegen auf", () => {
    const onChange = vi.fn();
    render(<KommunikationPanel onStateChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Annehmen" }));
    fireEvent.click(screen.getByRole("button", { name: "Auflegen" }));
    expect(onChange).toHaveBeenCalledWith("idle");
  });

  it("kein Fehler ohne onStateChange-Prop", () => {
    expect(() => {
      render(<KommunikationPanel />);
    }).not.toThrow();
  });
});

describe("KommunikationPanel — AktionenPanel Tab-Badge Integration", () => {
  it("Kommunikation-Tab-Button existiert immer", () => {
    render(<KommunikationPanel />);
    expect(screen.getByRole("button", { name: "Fahrgastkommunikation starten" })).toBeInTheDocument();
  });
});
```

### Tests — AktionenPanel Update: `src/components/features/AktionenPanel.test.tsx`

Bestehende Tests bleiben unverändert. Neue `describe`-Blöcke anhängen:

```tsx
describe("AktionenPanel — OR-07 Kommunikation-Tab Badge", () => {
  it("Kommunikation-Tab zeigt kein Badge im Idle", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(screen.getByRole("button", { name: /^kommunikation$/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /kommunikation \(1\)/i })).not.toBeInTheDocument();
  });

  it("Kommunikation-Tab zeigt '(1)' nach Eingehend-Trigger", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    expect(screen.getByRole("button", { name: "Kommunikation (1)" })).toBeInTheDocument();
  });

  it("Kommunikation-Tab-Badge verschwindet nach Ablehnen", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: "Ablehnen" }));
    expect(screen.queryByRole("button", { name: "Kommunikation (1)" })).not.toBeInTheDocument();
  });

  it("Kommunikation-Tab-Badge bleibt beim Tab-Wechsel erhalten", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
    fireEvent.click(screen.getByRole("button", { name: "Fahrgastkommunikation starten" }));
    fireEvent.click(screen.getByRole("button", { name: /^fahrt$/i }));
    expect(screen.getByRole("button", { name: "Kommunikation (1)" })).toBeInTheDocument();
  });
});
```

---

## Ticket 3 — MO-06: AuftragListRow

### Figma-Spec — Figma `#506:17806`

- Zeilen-Höhe: `h-[48px]`
- Hintergrund: `bg-[rgba(158,172,182,0.1)]`
- Border-Radius: `rounded-[10px]`
- Layout: `grid` mit 7 Spalten (analog zu EreignisListRow)
- Spalten: ID | Linie | Art | Von/Ab | Ziel | Auftraggeber | Status | Ankunft

**Spaltenbreiten (analog zu Ereignis-Screen):**
`grid-cols-[120px_100px_130px_180px_160px_100px_1fr]`

**Status-Badges:**
- `"aktiv"` → StatusBadge type `"aktiv"` (grün)
- `"geplant"` → StatusBadge type `"geplant"` (grau)
- `"unterbrochen"` → StatusBadge type `"unterbrochen-gelb"` (gelb)

**Typo:** Inter Regular 15px, Farbe `#000` / `text-black`

### Neue Datei: `src/components/features/AuftragListRow.tsx`

```tsx
import { StatusBadge } from "@/components/ui-custom/StatusBadge";

type AuftragStatus = "aktiv" | "geplant" | "unterbrochen";

interface AuftragListRowProps {
  id: string;
  linie?: string;
  art: string;
  von: string;
  ab: string;
  ziel: string;
  auftraggeber: string;
  status: AuftragStatus;
  ankunft: string;
  onClick?: () => void;
}

const STATUS_BADGE_MAP: Record<AuftragStatus, "aktiv" | "geplant" | "unterbrochen-gelb"> = {
  aktiv: "aktiv",
  geplant: "geplant",
  unterbrochen: "unterbrochen-gelb",
};

export function AuftragListRow({
  id,
  linie,
  art,
  von,
  ab,
  ziel,
  auftraggeber,
  status,
  ankunft,
  onClick,
}: AuftragListRowProps) {
  return (
    <div
      role="row"
      onClick={onClick}
      className="grid grid-cols-[120px_100px_130px_180px_160px_100px_1fr] items-center h-[48px] bg-[rgba(158,172,182,0.1)] rounded-[10px] px-3 cursor-pointer hover:bg-[rgba(158,172,182,0.2)] transition-colors"
    >
      <span className="text-[15px] text-black font-medium truncate">{id}</span>
      <span className="text-[15px] text-black truncate">{linie ?? "—"}</span>
      <span className="text-[15px] text-black truncate">{art}</span>
      <div className="flex flex-col leading-tight">
        <span className="text-[13px] text-black">{von}</span>
        <span className="text-[12px] text-gray-muted">{ab}</span>
      </div>
      <span className="text-[15px] text-black truncate">{ziel}</span>
      <span className="text-[15px] text-black truncate">{auftraggeber}</span>
      <div className="flex items-center justify-between">
        <StatusBadge type={STATUS_BADGE_MAP[status]} />
        <span className="text-[13px] text-gray-muted">{ankunft}</span>
      </div>
    </div>
  );
}
```

### Tests — `src/components/features/AuftragListRow.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AuftragListRow } from "./AuftragListRow";

const BASE_PROPS = {
  id: "AUF-001",
  linie: "L1",
  art: "Lieferauftrag",
  von: "Lager A",
  ab: "08:00",
  ziel: "Hauptgebäude",
  auftraggeber: "Sabine M.",
  status: "aktiv" as const,
  ankunft: "08:45",
};

describe("AuftragListRow — Grundstruktur", () => {
  it("zeigt Auftrags-ID", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });

  it("zeigt Linie", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("L1")).toBeInTheDocument();
  });

  it("zeigt Art", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("Lieferauftrag")).toBeInTheDocument();
  });

  it("zeigt Von-Wert", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("Lager A")).toBeInTheDocument();
  });

  it("zeigt Ab-Zeit", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("08:00")).toBeInTheDocument();
  });

  it("zeigt Ziel", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("Hauptgebäude")).toBeInTheDocument();
  });

  it("zeigt Auftraggeber", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("Sabine M.")).toBeInTheDocument();
  });

  it("zeigt Ankunftszeit", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("08:45")).toBeInTheDocument();
  });

  it("hat h-[48px] Zeilen-Höhe", () => {
    const { container } = render(<AuftragListRow {...BASE_PROPS} />);
    expect(container.querySelector('[class*="h-\\[48px\\]"]')).toBeInTheDocument();
  });

  it("hat bg-[rgba(158,172,182,0.1)] Hintergrund", () => {
    const { container } = render(<AuftragListRow {...BASE_PROPS} />);
    expect(container.querySelector('[class*="158,172,182"]')).toBeInTheDocument();
  });

  it("hat role='row' für Accessibility", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByRole("row")).toBeInTheDocument();
  });
});

describe("AuftragListRow — Status-Badges", () => {
  it("status='aktiv' → Badge 'aktiv' sichtbar", () => {
    render(<AuftragListRow {...BASE_PROPS} status="aktiv" />);
    expect(screen.getByText("aktiv")).toBeInTheDocument();
  });

  it("status='geplant' → Badge 'geplant' sichtbar", () => {
    render(<AuftragListRow {...BASE_PROPS} status="geplant" />);
    expect(screen.getByText("geplant")).toBeInTheDocument();
  });

  it("status='unterbrochen' → Badge 'unterbrochen' sichtbar", () => {
    render(<AuftragListRow {...BASE_PROPS} status="unterbrochen" />);
    expect(screen.getByText("unterbrochen")).toBeInTheDocument();
  });
});

describe("AuftragListRow — Klick-Interaktion", () => {
  it("onClick wird aufgerufen", () => {
    const onClick = vi.fn();
    render(<AuftragListRow {...BASE_PROPS} onClick={onClick} />);
    fireEvent.click(screen.getByRole("row"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("kein Fehler ohne onClick", () => {
    expect(() => {
      render(<AuftragListRow {...BASE_PROPS} />);
      fireEvent.click(screen.getByRole("row"));
    }).not.toThrow();
  });
});

describe("AuftragListRow — Edge Cases", () => {
  it("fehlende Linie → zeigt '—'", () => {
    render(<AuftragListRow {...BASE_PROPS} linie={undefined} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("leere Ankunftszeit rendert ohne Fehler", () => {
    expect(() => render(<AuftragListRow {...BASE_PROPS} ankunft="" />)).not.toThrow();
  });

  it("sehr langer Auftraggeber-Name wird truncated (hat truncate-Klasse)", () => {
    const { container } = render(
      <AuftragListRow {...BASE_PROPS} auftraggeber="Sehr Langer Name Mit Vielen Zeichen" />
    );
    const spans = container.querySelectorAll(".truncate");
    expect(spans.length).toBeGreaterThan(0);
  });
});
```

---

## Ticket 4 — OR-11: AuftragListView

### Figma-Spec — Figma `#506:17806`

- Tabs: "Alle" | "Archiv" | "Offen" (Tab-Reihenfolge wie in Figma)
- Header-Zeile mit SearchBar (rechts) und "Lieferauftrag erstellen" Button (rechts)
- Trennlinie nach Tabs + nach Filterleiste
- Spalten-Header: ID | Linie | Art | Von/Ab | Ziel | Auftraggeber | Status | Ankunft
- Liste aus AuftragListRow-Einträgen
- Tab-Filter: "offen" → nur `status="aktiv"`, "archiv" → nur `status="geplant" | "unterbrochen"`, "alle" → alle

**"Lieferauftrag erstellen" Button:**
- `bg-[rgba(20,106,161,0.1)] text-[#146AA1] font-semibold text-[15px] rounded-[4px] h-[27px] px-3`
- PlusIcon (analog zu EreignisListView)

### Neue Datei: `src/components/features/AuftragListView.tsx`

```tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/ui-custom/SearchBar";
import { ListHeader } from "@/components/ui-custom/ListHeader";
import { AuftragListRow } from "@/components/features/AuftragListRow";

type AuftragStatus = "aktiv" | "geplant" | "unterbrochen";
type AuftragTab = "alle" | "offen" | "archiv";

interface Auftrag {
  id: string;
  linie?: string;
  art: string;
  von: string;
  ab: string;
  ziel: string;
  auftraggeber: string;
  status: AuftragStatus;
  ankunft: string;
}

interface AuftragListViewProps {
  aufträge: Auftrag[];
  activeTab: AuftragTab;
  onTabChange: (tab: AuftragTab) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRowClick?: (id: string) => void;
  onNeuErstellen?: () => void;
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="#146AA1" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
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
```

### Tests — `src/components/features/AuftragListView.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AuftragListView } from "./AuftragListView";

const MOCK_AUFTRÄGE = [
  {
    id: "AUF-001",
    linie: "L1",
    art: "Lieferauftrag",
    von: "Lager A",
    ab: "08:00",
    ziel: "Hauptgebäude",
    auftraggeber: "Sabine M.",
    status: "aktiv" as const,
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
    status: "geplant" as const,
    ankunft: "10:00",
  },
  {
    id: "AUF-003",
    art: "Leerfahrt",
    von: "Haltestelle C",
    ab: "11:00",
    ziel: "Lager F",
    auftraggeber: "System",
    status: "unterbrochen" as const,
    ankunft: "11:30",
  },
];

const BASE_PROPS = {
  aufträge: MOCK_AUFTRÄGE,
  activeTab: "alle" as const,
  onTabChange: vi.fn(),
  searchValue: "",
  onSearchChange: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe("AuftragListView — Grundstruktur", () => {
  it("zeigt alle Aufträge im Tab 'Alle'", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
  });

  it("zeigt Tabs 'Alle', 'Offen', 'Archiv'", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByRole("tab", { name: "Alle" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Offen" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Archiv" })).toBeInTheDocument();
  });

  it("zeigt 'Lieferauftrag erstellen' Button", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByRole("button", { name: /lieferauftrag erstellen/i })).toBeInTheDocument();
  });

  it("zeigt Spalten-Header 'ID'", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
  });

  it("zeigt Spalten-Header 'Status / Ankunft'", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByText("Status / Ankunft")).toBeInTheDocument();
  });
});

describe("AuftragListView — Tab-Filterung", () => {
  it("Tab 'Offen' → nur aktive Aufträge", () => {
    render(<AuftragListView {...BASE_PROPS} activeTab="offen" />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
    expect(screen.queryByText("AUF-003")).not.toBeInTheDocument();
  });

  it("Tab 'Archiv' → nur geplante und unterbrochene Aufträge", () => {
    render(<AuftragListView {...BASE_PROPS} activeTab="archiv" />);
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
  });

  it("Tab 'Alle' → alle Aufträge sichtbar", () => {
    render(<AuftragListView {...BASE_PROPS} activeTab="alle" />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
  });
});

describe("AuftragListView — Suche", () => {
  it("Suche nach ID filtert korrekt", () => {
    render(<AuftragListView {...BASE_PROPS} searchValue="AUF-001" />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
  });

  it("Suche nach Art filtert korrekt", () => {
    render(<AuftragListView {...BASE_PROPS} searchValue="Leerfahrt" />);
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
  });

  it("keine Treffer → Leer-State 'Keine Aufträge gefunden.'", () => {
    render(<AuftragListView {...BASE_PROPS} searchValue="XXXXXX" />);
    expect(screen.getByText("Keine Aufträge gefunden.")).toBeInTheDocument();
  });

  it("Suche ist Case-Insensitive", () => {
    render(<AuftragListView {...BASE_PROPS} searchValue="lieferauftrag" />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });
});

describe("AuftragListView — Klick-Interaktion", () => {
  it("Klick auf Zeile ruft onRowClick mit ID auf", () => {
    const onRowClick = vi.fn();
    render(<AuftragListView {...BASE_PROPS} onRowClick={onRowClick} />);
    fireEvent.click(screen.getAllByRole("row")[0]);
    expect(onRowClick).toHaveBeenCalledWith("AUF-001");
  });

  it("'Lieferauftrag erstellen' ruft onNeuErstellen auf", () => {
    const onNeuErstellen = vi.fn();
    render(<AuftragListView {...BASE_PROPS} onNeuErstellen={onNeuErstellen} />);
    fireEvent.click(screen.getByRole("button", { name: /lieferauftrag erstellen/i }));
    expect(onNeuErstellen).toHaveBeenCalledTimes(1);
  });

  it("Tab-Klick ruft onTabChange auf", () => {
    const onTabChange = vi.fn();
    render(<AuftragListView {...BASE_PROPS} onTabChange={onTabChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Offen" }));
    expect(onTabChange).toHaveBeenCalledWith("offen");
  });
});

describe("AuftragListView — Edge Cases", () => {
  it("leere Auftragsliste → Leer-State sichtbar", () => {
    render(<AuftragListView {...BASE_PROPS} aufträge={[]} />);
    expect(screen.getByText("Keine Aufträge gefunden.")).toBeInTheDocument();
  });

  it("kein onRowClick → kein Fehler bei Klick", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(() => fireEvent.click(screen.getAllByRole("row")[0])).not.toThrow();
  });

  it("kein onNeuErstellen → kein Fehler bei Klick auf 'Erstellen'", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: /lieferauftrag erstellen/i }))
    ).not.toThrow();
  });

  it("einziger Auftrag bleibt nach Suche sichtbar", () => {
    render(<AuftragListView {...BASE_PROPS} aufträge={[MOCK_AUFTRÄGE[0]]} searchValue="AUF" />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });
});
```

---

## Ticket 5 — SC-04: /auftraege Page

### Figma-Spec — Figma `#506:17806`

Nutzt die Standard `(protected)` Layout (Sidebar). Ersetzt den aktuellen Stub.

### Datei: `src/app/(protected)/auftraege/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { AuftragListView } from "@/components/features/AuftragListView";

type AuftragStatus = "aktiv" | "geplant" | "unterbrochen";
type AuftragTab = "alle" | "offen" | "archiv";

interface Auftrag {
  id: string;
  linie?: string;
  art: string;
  von: string;
  ab: string;
  ziel: string;
  auftraggeber: string;
  status: AuftragStatus;
  ankunft: string;
}

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

export default function AuftraegePage() {
  const [activeTab, setActiveTab] = useState<AuftragTab>("alle");
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-[24px] font-bold text-black mb-6">Aufträge</h1>
      <AuftragListView
        aufträge={MOCK_AUFTRÄGE}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
    </div>
  );
}
```

### Tests — `src/app/(protected)/auftraege/AuftraegePage.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import AuftraegePage from "./page";

describe("SC-04 — AuftraegePage — Grundstruktur", () => {
  it("zeigt Seitentitel 'Aufträge'", () => {
    render(<AuftraegePage />);
    expect(screen.getByRole("heading", { name: "Aufträge" })).toBeInTheDocument();
  });

  it("zeigt Mock-Auftrag AUF-001", () => {
    render(<AuftraegePage />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });

  it("zeigt alle 4 Mock-Aufträge initial", () => {
    render(<AuftraegePage />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
    expect(screen.getByText("AUF-004")).toBeInTheDocument();
  });

  it("zeigt 'Lieferauftrag erstellen' Button", () => {
    render(<AuftraegePage />);
    expect(
      screen.getByRole("button", { name: /lieferauftrag erstellen/i })
    ).toBeInTheDocument();
  });
});

describe("SC-04 — AuftraegePage — Tab-Navigation", () => {
  it("Tab 'Offen' filtert auf aktive Aufträge", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Offen" }));
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-004")).toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
  });

  it("Tab 'Archiv' zeigt geplante/unterbrochene Aufträge", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Archiv" }));
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
  });

  it("zurück zu Tab 'Alle' zeigt alle Aufträge", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Offen" }));
    fireEvent.click(screen.getByRole("tab", { name: "Alle" }));
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
  });
});

describe("SC-04 — AuftraegePage — Suche", () => {
  it("Suche filtert Aufträge korrekt (kein SearchBar-Mock nötig — interner State)", () => {
    render(<AuftraegePage />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });
});
```

---

## Ticket 6 — SC-06: /linien Page

### Figma-Spec — Figma `#508:19223`

- Nutzt `KarteShell` mit `activeItem="linien"`
- Hintergrund Inhalt: `bg-[#F5F5F5]`
- Zwei Standort-Blöcke (Legende):
  - `bg-[#D8D8D8] rounded-[33px]` mit Standort-Name
- SVG-Routenkarte (statisch, kein Leaflet):
  - Rote Route: `stroke="#DB4C4C"` strokeWidth=8
  - Grüne Route: `stroke="#449D3C"` strokeWidth=8
  - Knoten: `circle r=14` weiß mit farbigem Stroke (rot oder grün)
  - Stationen: Lager F, E, A, H, Hauptgebäude, Lager C/Umsteigepunkt, N, O, M, P

**Station-Layout im SVG:**
- Hauptgebäude: Zentraler Knoten
- Rote Route (links): Lager A → H → Hauptgebäude → Lager C → N
- Grüne Route (rechts): Lager E → F → Hauptgebäude → O → M → P

### Datei: `src/app/(protected)/linien/page.tsx`

```tsx
import { KarteShell } from "@/components/layout/KarteShell";

interface Station {
  id: string;
  label: string;
  x: number;
  y: number;
  route: "rot" | "gruen" | "beide";
}

const STATIONS: Station[] = [
  { id: "hauptgebaeude",  label: "Hauptgebäude",      x: 400, y: 300, route: "beide" },
  { id: "lager-a",        label: "Lager A",            x: 160, y: 180, route: "rot" },
  { id: "lager-h",        label: "Lager H",            x: 240, y: 240, route: "rot" },
  { id: "lager-c",        label: "Lager C",            x: 280, y: 380, route: "rot" },
  { id: "haltestelle-n",  label: "N",                  x: 200, y: 440, route: "rot" },
  { id: "lager-e",        label: "Lager E",            x: 580, y: 160, route: "gruen" },
  { id: "lager-f",        label: "Lager F",            x: 520, y: 220, route: "gruen" },
  { id: "haltestelle-o",  label: "O",                  x: 540, y: 380, route: "gruen" },
  { id: "haltestelle-m",  label: "M",                  x: 580, y: 440, route: "gruen" },
  { id: "haltestelle-p",  label: "P",                  x: 620, y: 500, route: "gruen" },
];

const ROUTE_ROT: [number, number][] = [
  [160, 180], [240, 240], [400, 300], [280, 380], [200, 440],
];

const ROUTE_GRUEN: [number, number][] = [
  [580, 160], [520, 220], [400, 300], [540, 380], [580, 440], [620, 500],
];

function toPolyline(points: [number, number][]) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

export default function LinienPage() {
  return (
    <KarteShell activeItem="linien">
      <div className="flex-1 bg-[#F5F5F5] h-full p-8">
        <h1 className="text-[22px] font-bold text-black mb-4">Linienübersicht</h1>

        <div className="flex gap-4 mb-6">
          <div className="bg-[#D8D8D8] rounded-[33px] px-5 py-2 text-[14px] font-medium text-black">
            Hauptstandort
          </div>
          <div className="bg-[#D8D8D8] rounded-[33px] px-5 py-2 text-[14px] font-medium text-black">
            Standort B
          </div>
        </div>

        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-[#DB4C4C] rounded" />
            <span className="text-[13px] text-black">Route Rot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-[#449D3C] rounded" />
            <span className="text-[13px] text-black">Route Grün</span>
          </div>
        </div>

        <svg
          viewBox="0 0 760 600"
          className="w-full max-w-[760px] h-auto"
          aria-label="Linienübersicht SVG"
        >
          <polyline
            points={toPolyline(ROUTE_ROT)}
            stroke="#DB4C4C"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={toPolyline(ROUTE_GRUEN)}
            stroke="#449D3C"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {STATIONS.map((s) => {
            const strokeColor =
              s.route === "rot"
                ? "#DB4C4C"
                : s.route === "gruen"
                ? "#449D3C"
                : "#146AA1";
            return (
              <g key={s.id}>
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={14}
                  fill="white"
                  stroke={strokeColor}
                  strokeWidth="3"
                />
                <text
                  x={s.x}
                  y={s.y + 28}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#000"
                  fontFamily="Inter, sans-serif"
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </KarteShell>
  );
}
```

### Tests — `src/app/(protected)/linien/LinienPage.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import LinienPage from "./page";

vi.mock("@/components/layout/KarteShell", () => ({
  KarteShell: ({
    children,
    activeItem,
  }: {
    children: React.ReactNode;
    activeItem?: string;
  }) => (
    <div data-testid="karte-shell" data-active={activeItem}>
      {children}
    </div>
  ),
}));

describe("SC-06 — LinienPage — Grundstruktur", () => {
  it("rendert Seitentitel 'Linienübersicht'", () => {
    render(<LinienPage />);
    expect(screen.getByRole("heading", { name: "Linienübersicht" })).toBeInTheDocument();
  });

  it("nutzt KarteShell mit activeItem='linien'", () => {
    render(<LinienPage />);
    expect(screen.getByTestId("karte-shell")).toHaveAttribute("data-active", "linien");
  });

  it("zeigt 'Hauptstandort' Block", () => {
    render(<LinienPage />);
    expect(screen.getByText("Hauptstandort")).toBeInTheDocument();
  });

  it("zeigt 'Standort B' Block", () => {
    render(<LinienPage />);
    expect(screen.getByText("Standort B")).toBeInTheDocument();
  });

  it("Standort-Blöcke haben rounded-[33px]", () => {
    const { container } = render(<LinienPage />);
    expect(container.querySelector('[class*="rounded-\\[33px\\]"]')).toBeInTheDocument();
  });
});

describe("SC-06 — LinienPage — SVG-Karte", () => {
  it("rendert SVG mit aria-label", () => {
    render(<LinienPage />);
    expect(screen.getByLabelText("Linienübersicht SVG")).toBeInTheDocument();
  });

  it("SVG hat rote Route (stroke #DB4C4C)", () => {
    const { container } = render(<LinienPage />);
    const roteRoute = container.querySelector('[stroke="#DB4C4C"]');
    expect(roteRoute).toBeInTheDocument();
  });

  it("SVG hat grüne Route (stroke #449D3C)", () => {
    const { container } = render(<LinienPage />);
    const grueneRoute = container.querySelector('[stroke="#449D3C"]');
    expect(grueneRoute).toBeInTheDocument();
  });

  it("rote Route hat strokeWidth=8", () => {
    const { container } = render(<LinienPage />);
    const roteRoute = container.querySelector('[stroke="#DB4C4C"]');
    expect(roteRoute).toHaveAttribute("strokeWidth", "8");
  });

  it("grüne Route hat strokeWidth=8", () => {
    const { container } = render(<LinienPage />);
    const grueneRoute = container.querySelector('[stroke="#449D3C"]');
    expect(grueneRoute).toHaveAttribute("strokeWidth", "8");
  });

  it("zeigt Station 'Hauptgebäude' im SVG", () => {
    render(<LinienPage />);
    expect(screen.getByText("Hauptgebäude")).toBeInTheDocument();
  });

  it("zeigt Station 'Lager A'", () => {
    render(<LinienPage />);
    expect(screen.getByText("Lager A")).toBeInTheDocument();
  });

  it("zeigt Station 'Lager F'", () => {
    render(<LinienPage />);
    expect(screen.getByText("Lager F")).toBeInTheDocument();
  });

  it("zeigt alle 10 Stationen als SVG-Text-Elemente", () => {
    const { container } = render(<LinienPage />);
    const textEls = container.querySelectorAll("svg text");
    expect(textEls.length).toBeGreaterThanOrEqual(10);
  });

  it("zeigt 10 Knoten-Kreise (circle)", () => {
    const { container } = render(<LinienPage />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(10);
  });

  it("Hauptgebäude-Knoten hat blauen Stroke (#146AA1)", () => {
    const { container } = render(<LinienPage />);
    const blueCircle = container.querySelector('circle[stroke="#146AA1"]');
    expect(blueCircle).toBeInTheDocument();
  });
});

describe("SC-06 — LinienPage — Legende", () => {
  it("zeigt Legende 'Route Rot'", () => {
    render(<LinienPage />);
    expect(screen.getByText("Route Rot")).toBeInTheDocument();
  });

  it("zeigt Legende 'Route Grün'", () => {
    render(<LinienPage />);
    expect(screen.getByText("Route Grün")).toBeInTheDocument();
  });

  it("Hintergrund hat bg-[#F5F5F5]", () => {
    const { container } = render(<LinienPage />);
    expect(container.querySelector('[class*="F5F5F5"]')).toBeInTheDocument();
  });
});
```

---

## Ticket 7 — SC-01: /login Page

### Figma-Spec — Figma `#393:16920`

**Layout:**
- Vollbild-Container: `relative min-h-screen overflow-hidden bg-[#1E2229]`
- Overlay: `absolute inset-0 bg-black/50 backdrop-blur-[3.7px]`
- Weißes Login-Card: zentriert, `bg-white rounded-[10px] shadow-[4px_4px_24px_rgba(0,0,0,0.11)] px-[60px] py-[40px]`
- Titel "Login": `h2`, Inter Bold 26px, zentriert

**Nutzer-Cards (4 Stück in einer Zeile, gap=54px):**
- Jede Card: `w-[73px] h-[105.91px]`, flex-col, cursor-pointer
- Oberer Bereich (63.44px): Avatar-Kreis (49.11×49.11px), `bg-[#D9D9D9] rounded-full`
- Unterer Bereich (42.47px): Name, Inter Medium 15px, `text-[#2A2F3B]`, `text-center`
- Initial-Kürzel im Avatar: Inter Bold 18px, `text-[#2A2F3B]`

**Nutzer-Mapping:**
| Name | Kürzel | Rolle | Redirect |
|------|--------|-------|---------|
| Matthias Muster | MM | `operator` | `/karte` |
| Sabine Muster | SL | `schichtleitung` | `/ereignisse` |
| Jonas Muster | MA | `mitarbeiter` | `/auftraege` |
| Gast | GA | `gast` | `/statistiken` |

**Cookie-Format:** `auth-token=x.{base64(JSON.stringify({role}))}.x`
Middleware erwartet: `token.split(".")[1]` → `atob()` → `JSON.parse()` → `.role`

### Datei: `src/app/(auth)/login/page.tsx`

```tsx
"use client";

import { useRouter } from "next/navigation";

type Role = "operator" | "schichtleitung" | "mitarbeiter" | "gast";

interface UserCard {
  name: string;
  kuerzel: string;
  role: Role;
  redirect: string;
}

const USERS: UserCard[] = [
  { name: "Matthias Muster", kuerzel: "MM", role: "operator",       redirect: "/karte"      },
  { name: "Sabine Muster",   kuerzel: "SL", role: "schichtleitung", redirect: "/ereignisse" },
  { name: "Jonas Muster",    kuerzel: "MA", role: "mitarbeiter",    redirect: "/auftraege"  },
  { name: "Gast",            kuerzel: "GA", role: "gast",           redirect: "/statistiken" },
];

export default function LoginPage() {
  const router = useRouter();

  function handleLogin(user: UserCard) {
    const payload = btoa(JSON.stringify({ role: user.role }));
    document.cookie = `auth-token=x.${payload}.x; path=/`;
    router.push(user.redirect);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1E2229] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[3.7px]" />
      <div className="relative bg-white rounded-[10px] shadow-[4px_4px_24px_rgba(0,0,0,0.11)] px-[60px] py-[40px] flex flex-col items-center gap-8">
        <h2 className="text-[26px] font-bold text-black">Login</h2>
        <div className="flex gap-[54px]">
          {USERS.map((user) => (
            <button
              key={user.role}
              onClick={() => handleLogin(user)}
              aria-label={`Als ${user.name} anmelden`}
              className="w-[73px] flex flex-col items-center gap-0 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-[49px] h-[49px] rounded-full bg-[#D9D9D9] flex items-center justify-center mb-[14px]">
                <span className="text-[18px] font-bold text-[#2A2F3B]">{user.kuerzel}</span>
              </div>
              <span className="text-[15px] font-medium text-[#2A2F3B] text-center leading-tight">
                {user.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Tests — `src/app/(auth)/login/LoginPage.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";

const mockPush = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  // JSDOM unterstützt document.cookie nativ — kein Mocking nötig.
  // Cookie-Jar zwischen Tests leeren:
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
});

describe("SC-01 — LoginPage — Grundstruktur", () => {
  it("zeigt Titel 'Login'", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("zeigt 4 Nutzer-Buttons", () => {
    render(<LoginPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
  });

  it("zeigt 'Matthias Muster'", () => {
    render(<LoginPage />);
    expect(screen.getByText("Matthias Muster")).toBeInTheDocument();
  });

  it("zeigt 'Sabine Muster'", () => {
    render(<LoginPage />);
    expect(screen.getByText("Sabine Muster")).toBeInTheDocument();
  });

  it("zeigt 'Jonas Muster'", () => {
    render(<LoginPage />);
    expect(screen.getByText("Jonas Muster")).toBeInTheDocument();
  });

  it("zeigt 'Gast'", () => {
    render(<LoginPage />);
    expect(screen.getByText("Gast")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'MM' für Matthias Muster", () => {
    render(<LoginPage />);
    expect(screen.getByText("MM")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'SL' für Sabine Muster", () => {
    render(<LoginPage />);
    expect(screen.getByText("SL")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'MA' für Jonas Muster", () => {
    render(<LoginPage />);
    expect(screen.getByText("MA")).toBeInTheDocument();
  });

  it("zeigt Kürzel 'GA' für Gast", () => {
    render(<LoginPage />);
    expect(screen.getByText("GA")).toBeInTheDocument();
  });

  it("weißes Card hat rounded-[10px]", () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector('[class*="rounded-\\[10px\\]"]')).toBeInTheDocument();
  });

  it("Overlay hat backdrop-blur", () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector('[class*="backdrop-blur"]')).toBeInTheDocument();
  });
});

describe("SC-01 — LoginPage — Navigation nach Login", () => {
  it("Klick auf Matthias Muster → navigiert zu /karte", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    expect(mockPush).toHaveBeenCalledWith("/karte");
  });

  it("Klick auf Sabine Muster → navigiert zu /ereignisse", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /sabine muster/i }));
    expect(mockPush).toHaveBeenCalledWith("/ereignisse");
  });

  it("Klick auf Jonas Muster → navigiert zu /auftraege", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /jonas muster/i }));
    expect(mockPush).toHaveBeenCalledWith("/auftraege");
  });

  it("Klick auf Gast → navigiert zu /statistiken", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /^als gast anmelden$/i }));
    expect(mockPush).toHaveBeenCalledWith("/statistiken");
  });

  it("router.push wird genau einmal aufgerufen", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

function getCookieRole(): string {
  const match = document.cookie.match(/auth-token=x\.([^.]+)\.x/);
  if (!match) return "";
  return JSON.parse(atob(match[1])).role ?? "";
}

describe("SC-01 — LoginPage — Cookie wird gesetzt", () => {
  it("Klick setzt auth-token Cookie", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    expect(document.cookie).toContain("auth-token=");
  });

  it("Cookie enthält 'operator' Rolle für Matthias Muster", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    expect(getCookieRole()).toBe("operator");
  });

  it("Cookie enthält 'schichtleitung' Rolle für Sabine Muster", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /sabine muster/i }));
    expect(getCookieRole()).toBe("schichtleitung");
  });

  it("Cookie enthält 'mitarbeiter' Rolle für Jonas Muster", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /jonas muster/i }));
    expect(getCookieRole()).toBe("mitarbeiter");
  });

  it("Cookie enthält 'gast' Rolle für Gast", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /^als gast anmelden$/i }));
    expect(getCookieRole()).toBe("gast");
  });
});

describe("SC-01 — LoginPage — Edge Cases", () => {
  it("mehrfaches Klicken setzt Cookie und navigiert jedes Mal", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    fireEvent.click(screen.getByRole("button", { name: /sabine muster/i }));
    expect(mockPush).toHaveBeenCalledTimes(2);
  });

  it("rendert ohne Fehler ohne Interaktion", () => {
    expect(() => render(<LoginPage />)).not.toThrow();
  });
});
```

---

## Bekannte Abhängigkeiten & Pitfalls

### Testreihenfolge beachten
1. Tests für SC-05-Link laufen isoliert — Mocks für `next/navigation`, `@/components/features/MapCanvas`, `RoutenzugListPanel` und `KarteShell` nötig. **Kein** `next/dynamic`-Mock erforderlich, da MapCanvas direkt gemockt wird.
2. `KommunikationPanel.test.tsx` testet alle State-Übergänge sequenziell mit `fireEvent`.
3. `AktionenPanel.test.tsx` — bestehende Tests bleiben unverändert; `fireEvent` ist bereits importiert. Neue `describe`-Blöcke einfach anhängen.
4. `LoginPage.test.tsx` — JSDOM verwaltet `document.cookie` nativ. Kein `Object.defineProperty`-Mock nötig. Cookie-Jar vor jedem Test via `expires`-Trick leeren.

### IDs karte/page.tsx
Die Mock-IDs werden von `"rz-a"` → `"RZ-A"` etc. geändert, damit sie mit den Detail-Page-Mocks übereinstimmen.

### LinienPage — kein `"use client"` nötig
Da keine Interaktion vorhanden ist, ist die Linien-Page ein Server Component (kein `useState`).

### Login-Cookie-Parsing
Der Middleware-Code (`parseJwtPayload`) erwartet `token.split(".")[1]`. Das Format `x.{payload}.x` erfüllt diese Anforderung: Index 0 = `"x"`, Index 1 = Base64-Payload, Index 2 = `"x"`.
