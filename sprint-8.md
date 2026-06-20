# Sprint 8 — Refactoring & Projektbereinigung

## Ziel

Keine neuen Features. Konsolidierung von duplizierten Typen, Beseitigung von Code-Redundanzen, zwei Bugfixes (Navigation, Mock-Daten) sowie Vorbereitung auf künftige API-Anbindung.

## Gefundene Probleme

| Problem | Schwere | Betroffene Dateien |
|---------|---------|-------------------|
| `AuftragStatus`, `AuftragTab`, `Auftrag` je 3× definiert | Hoch | AuftragListRow, AuftragListView, auftraege/page |
| `Role` / `SidebarRole` je 4–5× definiert | Hoch | login, layout, Sidebar, SidebarWrapper, middleware |
| `PlusIcon`-SVG identisch in 2 List-Views | Niedrig | EreignisListView, AuftragListView |
| RZ-C fehlt in `MOCK_ROUTENZUG_DETAILS` → "nicht gefunden" | Bug | routenzug/[id]/page |
| `SidebarWrapper` zeigt immer "Matthias Muster" | Bug | login/page, layout, SidebarWrapper |
| `?tab=`-Parameter in EreignissePage wird ignoriert | Bug | ereignisse/page |

## Scope

| # | Ticket | Typ | Zieldatei(en) |
|---|--------|-----|---------------|
| 1 | RF-01 | Auftrag-Typen zentralisieren | `types/auftrag.ts` (neu) + 3 Importe updaten |
| 2 | RF-02 | Role-Typen zentralisieren | `types/auth.ts` (neu) + 5 Importe updaten |
| 3 | RF-03 | `PlusIcon` deduplizieren | `ui-custom/icons.tsx` (neu) + 2 Importe updaten |
| 4 | RF-04 | RZ-C in Mock-Daten ergänzen | `routenzug/[id]/page.tsx` + Tests |
| 5 | RF-05 | Eingeloggten Namen in Sidebar | `login/page.tsx`, `(protected)/layout.tsx`, `SidebarWrapper.tsx` + Tests |
| 6 | RF-06 | Ereignisse-Page `?tab=`-URL-Sync | `ereignisse/page.tsx` + neue Testdatei |

## Implementierungsreihenfolge

1. RF-01 (Basis-Typen zuerst — danach können alle Konsumenten importieren)
2. RF-02 (Auth-Typen — benötigt für RF-05)
3. RF-03 (unabhängig)
4. RF-04 (unabhängig, fügt nur Mock-Daten hinzu)
5. RF-05 (benötigt `types/auth.ts` aus RF-02)
6. RF-06 (unabhängig)

---

## Ticket 1 — RF-01: Auftrag-Typen zentralisieren

### Problem

`AuftragStatus`, `AuftragTab` und `Auftrag` sind gleichlautend in 3 Dateien lokal definiert:

- `src/components/features/AuftragListRow.tsx` Zeile 3 — `type AuftragStatus`
- `src/components/features/AuftragListView.tsx` Zeilen 6–19 — alle 3 Typen
- `src/app/(protected)/auftraege/page.tsx` Zeilen 6–19 — alle 3 Typen

### Neue Datei: `src/types/auftrag.ts`

```ts
export type AuftragStatus = "aktiv" | "geplant" | "unterbrochen";
export type AuftragTab = "alle" | "offen" | "archiv";

export interface Auftrag {
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
```

### Update `src/components/features/AuftragListRow.tsx`

Zeile 3 (`type AuftragStatus = "aktiv" | "geplant" | "unterbrochen";`) entfernen.
Stattdessen als erste Import-Zeile:

```tsx
import type { AuftragStatus } from "@/types/auftrag";
```

### Update `src/components/features/AuftragListView.tsx`

Zeilen 6–19 (lokale Typen + Interface) entfernen.
Zusätzlichen Import ergänzen:

```tsx
import type { Auftrag, AuftragStatus, AuftragTab } from "@/types/auftrag";
```

### Update `src/app/(protected)/auftraege/page.tsx`

Zeilen 6–19 (lokale Typen + Interface) entfernen.
Zusätzlichen Import ergänzen:

```tsx
import type { Auftrag, AuftragStatus, AuftragTab } from "@/types/auftrag";
```

### Tests

Keine neuen Tests. Alle 450 bestehenden Tests müssen weiterhin grün sein (kein Verhaltensunterschied, reine Typ-Umstrukturierung).

---

## Ticket 2 — RF-02: Role-Typen zentralisieren

### Problem

| Datei | Lokale Definition |
|-------|------------------|
| `src/app/(auth)/login/page.tsx` | `type Role = "operator" \| "schichtleitung" \| "mitarbeiter" \| "gast"` |
| `src/app/(protected)/layout.tsx` | `type SidebarRole = "operator" \| "schichtleitung" \| "mitarbeiter"` |
| `src/components/layout/Sidebar.tsx` | `type Role = "operator" \| "schichtleitung" \| "mitarbeiter"` |
| `src/components/layout/SidebarWrapper.tsx` | `type Role = "operator" \| "schichtleitung" \| "mitarbeiter"` |
| `src/middleware.ts` | `type Role = "operator" \| "schichtleitung" \| "mitarbeiter" \| "gast"` |

### Neue Datei: `src/types/auth.ts`

```ts
export type Role = "operator" | "schichtleitung" | "mitarbeiter" | "gast";
export type SidebarRole = Exclude<Role, "gast">;
```

### Updates in 5 Dateien

In jeder der 5 Dateien die lokale Typ-Definition entfernen und durch Import ersetzen:

**`src/app/(auth)/login/page.tsx`** — `type Role = ...` entfernen, ergänzen:
```tsx
import type { Role } from "@/types/auth";
```

**`src/app/(protected)/layout.tsx`** — `type SidebarRole = ...` entfernen, ergänzen:
```tsx
import type { SidebarRole } from "@/types/auth";
```

**`src/components/layout/Sidebar.tsx`** — `type Role = ...` (Zeile 4) entfernen, ergänzen:
```tsx
import type { SidebarRole } from "@/types/auth";
```
Achtung: In `Sidebar.tsx` wird der Typ in `SidebarProps` und `NAV_CONFIG` als `Role` referenziert — nach Import auf `SidebarRole` umbenennen (diese Datei unterscheidet ohnehin nicht zwischen `gast` und den anderen Rollen).

**`src/components/layout/SidebarWrapper.tsx`** — `type Role = ...` entfernen, ergänzen:
```tsx
import type { SidebarRole } from "@/types/auth";
```
Alle lokalen `Role`-Referenzen auf `SidebarRole` umbenennen.

**`src/middleware.ts`** — `type Role = ...` entfernen, ergänzen:
```tsx
import type { Role } from "@/types/auth";
```

### Tests

Keine neuen Tests. Bestehende Tests decken alle Rollenpfade ab.

---

## Ticket 3 — RF-03: `PlusIcon` deduplizieren

### Problem

Identische Inline-Komponente `PlusIcon` (gleiches SVG, gleiche Darstellung) in 2 Dateien:

```tsx
// EreignisListView.tsx Zeile 8–12 — identisch mit AuftragListView.tsx Zeile 31–35
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 1v12M1 7h12" stroke="#146AA1" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
```

### Neue Datei: `src/components/ui-custom/icons.tsx`

```tsx
export function PlusIcon({ color = "#146AA1" }: { color?: string } = {}) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
```

### Update `src/components/features/EreignisListView.tsx`

Lokale `function PlusIcon()` (Zeilen 8–12) entfernen.
Import ergänzen:

```tsx
import { PlusIcon } from "@/components/ui-custom/icons";
```

### Update `src/components/features/AuftragListView.tsx`

Lokale `function PlusIcon()` (Zeilen 31–36) entfernen.
Import ergänzen:

```tsx
import { PlusIcon } from "@/components/ui-custom/icons";
```

### Tests

Keine neuen Tests. Bestehende Tests für EreignisListView und AuftragListView laufen grün (visueller Inhalt unverändert).

---

## Ticket 4 — RF-04: RZ-C in Mock-Daten ergänzen

### Problem

`MOCK_ROUTENZUG_DETAILS` in `routenzug/[id]/page.tsx` enthält nur `"RZ-A"` und `"RZ-B"`. Nach Sprint 7 navigiert die Karte per `router.push("/routenzug/RZ-C")` auch zu Routenzug C — dort erscheint aktuell "Routenzug nicht gefunden."

### Update: `src/app/(protected)/routenzug/[id]/page.tsx`

`RZ-C`-Eintrag in `MOCK_ROUTENZUG_DETAILS` ergänzen (nach `"RZ-B"`):

```tsx
"RZ-C": {
  id: "RZ-C", name: "Routenzug C", status: "lädt",
  frontImageUrl: "/mock/kamera-front-c.jpg", speedKmh: 0, acceleration: 0,
  aufträge: [],
},
```

Das vollständige Objekt danach:

```tsx
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
  "RZ-C": {
    id: "RZ-C", name: "Routenzug C", status: "lädt",
    frontImageUrl: "/mock/kamera-front-c.jpg", speedKmh: 0, acceleration: 0,
    aufträge: [],
  },
};
```

### Tests — neue `describe`-Blöcke an `src/app/(protected)/routenzug/[id]/RoutenzugDetailPage.test.tsx` anhängen

Das bestehende `mockUseParams` (aus `vi.hoisted`) ist im selben File bereits verfügbar.

```tsx
describe("SC-05 — RoutenzugDetailPage — RZ-C (RF-04)", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "RZ-C" });
  });

  it("rendert 'Routenzug C' im Titel", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText("Routenzug C")).toBeInTheDocument();
  });

  it("zeigt keinen 'nicht gefunden'-Fallback", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.queryByText(/routenzug nicht gefunden/i)).not.toBeInTheDocument();
  });

  it("zeigt AktionenPanel (Fahrt-Tab sichtbar)", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByRole("button", { name: /^fahrt$/i })).toBeInTheDocument();
  });

  it("zeigt StatusBadge 'lädt' (RZ-C ist im Lademodus)", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.getByText(/lädt/i)).toBeInTheDocument();
  });

  it("zeigt keine Auftrags-Items (RZ-C hat keine Aufträge)", () => {
    render(<RoutenzugDetailPage />);
    expect(screen.queryByText("AUF-01")).not.toBeInTheDocument();
    expect(screen.queryByText("AUF-03")).not.toBeInTheDocument();
  });
});
```

---

## Ticket 5 — RF-05: Eingeloggten Namen in Sidebar anzeigen

### Problem

`SidebarWrapper.tsx` übergibt hartkodiert `userName="Matthias Muster"` an `Sidebar`, unabhängig vom eingeloggten Benutzer. Der Name muss aus dem Auth-Cookie gelesen werden.

### Lösung in 3 Schritten

**Schritt A — `src/app/(auth)/login/page.tsx`**

`handleLogin` speichert jetzt auch `name` im Cookie-Payload (zusätzlich zur `role`). Die Zeile bleibt strukturell gleich, der JSON-Payload bekommt ein neues Feld:

```tsx
function handleLogin(user: UserCard) {
  const payload = btoa(JSON.stringify({ role: user.role, name: user.name }));
  document.cookie = `auth-token=x.${payload}.x; path=/`;
  router.push(user.redirect);
}
```

**Schritt B — `src/app/(protected)/layout.tsx`**

Vollständige neue Version:

```tsx
import { cookies } from "next/headers";
import { SidebarWrapper } from "@/components/layout/SidebarWrapper";
import type { SidebarRole } from "@/types/auth";

function parseTokenPayload(token: string): { role: SidebarRole; name: string } {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const r = payload.role;
    const role: SidebarRole =
      r === "schichtleitung" || r === "mitarbeiter" ? r : "operator";
    const name = typeof payload.name === "string" ? payload.name : "Benutzer";
    return { role, name };
  } catch {
    return { role: "operator", name: "Benutzer" };
  }
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const { role, name } = token
    ? parseTokenPayload(token)
    : { role: "operator" as SidebarRole, name: "Benutzer" };

  return (
    <div className="flex h-screen">
      <SidebarWrapper role={role} userName={name} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
```

**Schritt C — `src/components/layout/SidebarWrapper.tsx`**

Vollständige neue Version:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import type { SidebarRole } from "@/types/auth";

interface SidebarWrapperProps {
  role: SidebarRole;
  userName?: string;
}

export function SidebarWrapper({ role, userName }: SidebarWrapperProps) {
  const router = useRouter();

  return (
    <Sidebar
      role={role}
      userName={userName ?? "Benutzer"}
      onLogout={() => router.push("/login")}
    />
  );
}
```

### Tests — neue `describe`-Blöcke an `src/app/(auth)/login/LoginPage.test.tsx` anhängen

Das bestehende `beforeEach` (Cookie-Jar leeren) und `getCookieRole()` im selben File bleiben unverändert. Die neuen Blöcke nutzen dieselbe Hilfsfunktion und ergänzen eine neue `getCookieName()`.

```tsx
function getCookieName(): string {
  const match = document.cookie.match(/auth-token=x\.([^.]+)\.x/);
  if (!match) return "";
  return JSON.parse(atob(match[1])).name ?? "";
}

describe("SC-01 — LoginPage — Cookie enthält Name (RF-05)", () => {
  it("Cookie für Matthias Muster enthält name='Matthias Muster'", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    expect(getCookieName()).toBe("Matthias Muster");
  });

  it("Cookie für Sabine Muster enthält name='Sabine Muster'", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /sabine muster/i }));
    expect(getCookieName()).toBe("Sabine Muster");
  });

  it("Cookie für Jonas Muster enthält name='Jonas Muster'", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /jonas muster/i }));
    expect(getCookieName()).toBe("Jonas Muster");
  });

  it("Cookie für Gast enthält name='Gast'", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /^als gast anmelden$/i }));
    expect(getCookieName()).toBe("Gast");
  });

  it("Payload enthält sowohl role als auch name", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /matthias muster/i }));
    const match = document.cookie.match(/auth-token=x\.([^.]+)\.x/);
    const payload = JSON.parse(atob(match![1]));
    expect(payload.role).toBe("operator");
    expect(payload.name).toBe("Matthias Muster");
  });
});
```

---

## Ticket 6 — RF-06: Ereignisse-Page `?tab=`-URL-Sync

### Problem

`NavItem` in der Sidebar verlinkt auf `/ereignisse?tab=offen` und `/ereignisse?tab=archiv` (definiert in `Sidebar.tsx` → `EREIGNISSE_SUB_ITEMS`). Die `EreignissePage` liest diesen Parameter aber nicht aus — beim Klick auf "Offen" im Seitenmenü zeigt die Seite immer den "Alle"-Tab.

### Update: `src/app/(protected)/ereignisse/page.tsx`

Vollständige neue Version (kein neues File notwendig — alles bleibt in `page.tsx`, der Inhalt wird in eine interne Komponente ausgelagert um `<Suspense>` zu ermöglichen):

```tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EreignisListView } from "@/components/features/EreignisListView";
import type { Ereignis } from "@/types/ereignis";

type TabType = "alle" | "offen" | "archiv";

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

function EreignissePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: TabType =
    tabParam === "offen" || tabParam === "archiv" ? tabParam : "alle";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [search, setSearch] = useState("");

  return (
    <main className="px-14 pt-16">
      <h1 className="text-[42px] font-bold text-black mb-15.75">Ereignisse</h1>
      <EreignisListView
        ereignisse={MOCK_EREIGNISSE}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={search}
        onSearchChange={setSearch}
        onRowClick={(id) => router.push(`/ereignisse/${encodeURIComponent(id)}`)}
      />
    </main>
  );
}

export default function EreignissePage() {
  return (
    <Suspense>
      <EreignissePageContent />
    </Suspense>
  );
}
```

### Tests — neue Datei: `src/app/(protected)/ereignisse/EreignissePage.test.tsx`

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import EreignissePage from "./page";

const mockPush = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGet }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockGet.mockReturnValue(null);
});

describe("EreignissePage — Grundstruktur (RF-06)", () => {
  it("rendert Seitentitel 'Ereignisse'", () => {
    render(<EreignissePage />);
    expect(screen.getByRole("heading", { name: "Ereignisse" })).toBeInTheDocument();
  });

  it("zeigt die 3 Tabs Alle / Offen / Archiv", () => {
    render(<EreignissePage />);
    expect(screen.getByRole("tab", { name: "Alle" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Offen" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Archiv" })).toBeInTheDocument();
  });

  it("zeigt initial alle Mock-Ereignisse (kein ?tab)", () => {
    render(<EreignissePage />);
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#95")).toBeInTheDocument();
  });

  it("Klick auf Ereignis-Row navigiert zur Detail-Seite", () => {
    render(<EreignissePage />);
    fireEvent.click(screen.getAllByRole("row")[0]);
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("/ereignisse/"));
  });
});

describe("EreignissePage — URL-Tab-Sync (RF-06)", () => {
  it("kein ?tab → 'Alle'-Tab ist aktiv", () => {
    mockGet.mockReturnValue(null);
    render(<EreignissePage />);
    expect(screen.getByRole("tab", { name: "Alle" })).toHaveAttribute("data-state", "active");
  });

  it("?tab=offen → 'Offen'-Tab ist initial aktiv", () => {
    mockGet.mockReturnValue("offen");
    render(<EreignissePage />);
    expect(screen.getByRole("tab", { name: "Offen" })).toHaveAttribute("data-state", "active");
  });

  it("?tab=archiv → 'Archiv'-Tab ist initial aktiv", () => {
    mockGet.mockReturnValue("archiv");
    render(<EreignissePage />);
    expect(screen.getByRole("tab", { name: "Archiv" })).toHaveAttribute("data-state", "active");
  });

  it("ungültiger ?tab-Wert → Fallback zu 'Alle'", () => {
    mockGet.mockReturnValue("unbekannt");
    render(<EreignissePage />);
    expect(screen.getByRole("tab", { name: "Alle" })).toHaveAttribute("data-state", "active");
  });

  it("?tab=offen → zeigt nur Ereignisse mit status neu/warten", () => {
    mockGet.mockReturnValue("offen");
    render(<EreignissePage />);
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#96")).toBeInTheDocument();
    expect(screen.queryByText("#99")).not.toBeInTheDocument();
    expect(screen.queryByText("#95")).not.toBeInTheDocument();
  });

  it("?tab=archiv → zeigt nur abgeschlossene Ereignisse", () => {
    mockGet.mockReturnValue("archiv");
    render(<EreignissePage />);
    expect(screen.getByText("#95")).toBeInTheDocument();
    expect(screen.queryByText("#103")).not.toBeInTheDocument();
    expect(screen.queryByText("#99")).not.toBeInTheDocument();
  });

  it("?tab=alle → zeigt alle 7 Ereignisse", () => {
    mockGet.mockReturnValue("alle");
    render(<EreignissePage />);
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#99")).toBeInTheDocument();
    expect(screen.getByText("#95")).toBeInTheDocument();
  });
});

describe("EreignissePage — Tab-Wechsel nach Laden (RF-06)", () => {
  it("manueller Tab-Klick funktioniert weiterhin", () => {
    render(<EreignissePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Archiv" }));
    expect(screen.getByText("#95")).toBeInTheDocument();
    expect(screen.queryByText("#103")).not.toBeInTheDocument();
  });

  it("nach Tab-Wechsel zurück zu Alle → zeigt wieder alle", () => {
    render(<EreignissePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Archiv" }));
    fireEvent.click(screen.getByRole("tab", { name: "Alle" }));
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#95")).toBeInTheDocument();
  });
});
```

---

## Bekannte Abhängigkeiten & Pitfalls

### Reihenfolge ist wichtig für RF-01 / RF-02

RF-01 und RF-02 erstellen neue Typ-Dateien. Erst danach die Importe in den Konsumenten ersetzen — nie den umgekehrten Weg (Typen löschen, bevor die neue Datei existiert).

### RF-05: `SidebarWrapper` bleibt Client Component

`SidebarWrapper` hat `useRouter` — bleibt `"use client"`. Die Props `role` und `userName` kommen vom Server Component `(protected)/layout.tsx` — das ist das korrekte Next.js-Muster (Server → Client Props).

### RF-06: `useSearchParams()` erfordert `<Suspense>`

Ab Next.js 15 muss `useSearchParams()` von `<Suspense>` umschlossen sein. Das Muster in RF-06 — innere `EreignissePageContent`-Komponente mit `useSearchParams`, äußerer Default-Export mit `<Suspense>` — ist die empfohlene Lösung und muss nicht weiter abstrahiert werden.

### RF-06: `mockGet` muss vor `render` konfiguriert werden

In den Tests gibt `useSearchParams` ein Objekt zurück, dessen `get`-Methode gehoisted und gemockt ist. `mockGet.mockReturnValue(...)` muss vor `render(...)` aufgerufen werden — der `initialTab`-Wert wird beim ersten Render aus `useState` gesetzt und ändert sich danach nicht automatisch (kein reaktiver URL-Listener).

### Gesamtziel: 450 Tests bleiben grün, neue Tests kommen dazu

RF-01, RF-02, RF-03 fügen keine neuen Tests hinzu (reine Refactorings). RF-04, RF-05, RF-06 ergänzen je einen neuen `describe`-Block. Am Ende sollen alle Tests grün sein.
