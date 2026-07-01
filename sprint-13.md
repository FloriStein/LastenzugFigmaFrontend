# Sprint 13 — Rollen-Views, Mitarbeitertransport-Detail & Zugangskontrolle

## Ziel

Rollen-differenzierte Ansichten für Schichtleitung und Mitarbeiter einbauen, das Auftrags-Detail um den Mitarbeitertransport-Typ erweitern und die Middleware um echte Zugriffskontrolle ergänzen.

Tests kommen **nach** der Implementierung — dieses Dokument enthält keine Testblöcke.

## Scope

| # | Ticket | Beschreibung | Zieldatei(en) |
|---|--------|--------------|---------------|
| 1 | RG-01 | Rollen-Zugangskontrolle + `useRole()`-Hook | `middleware.ts` + `src/lib/useRole.ts` (NEU) |
| 2 | AU-02 | Auftrags-Detail Mitarbeitertransport | `auftraege/[id]/page.tsx` |
| 3 | SL-01 | Ereignisansicht Schichtleitung | `ereignisse/page.tsx` + `EreignisListView.tsx` + `types/ereignis.ts` |
| 4 | MA-01 | Aufträge Mitarbeiter | `auftraege/page.tsx` + `AuftragListView.tsx` + `types/auftrag.ts` |

## Abhängigkeiten / Vorbereitung

- Keine neuen npm-Packages nötig
- Keine neuen shadcn-Komponenten nötig
- `useRole()` (RG-01) ist Voraussetzung für SL-01 und MA-01 — zuerst implementieren

## Implementierungsreihenfolge

1. RG-01 (Middleware + Hook — keine UI-Deps)
2. AU-02 (eigenständig, nutzt PrioritätBadge)
3. SL-01 (braucht useRole + Typerweiterung)
4. MA-01 (braucht useRole + Typerweiterung)

---

## Ticket 1 — RG-01: Rollen-Zugangskontrolle + useRole()-Hook

### Problem

Jede Rolle hat eine definierte Startseite (Operator → `/karte`, SL → `/ereignisse`, MA → `/auftraege`, Gast → `/statistiken`). Aktuell kann aber jeder eingeloggte Nutzer jede Route aufrufen — ein Mitarbeiter kann `/statistiken` öffnen, ein Gast kann `/ereignisse` öffnen.

Außerdem brauchen SL-01 und MA-01 client-seitig eine Möglichkeit, die Rolle zu lesen, um role-spezifische UI zu rendern.

### Schritt 1 — `src/middleware.ts`: Erlaubte Pfade pro Rolle

Vollständige neue Version (ersetzt die Datei aus Sprint 12):

```ts
import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@/types/auth";

const ROLE_REDIRECT: Record<Role, string> = {
  operator:      "/karte",
  schichtleitung:"/ereignisse",
  mitarbeiter:   "/auftraege",
  gast:          "/statistiken",
};

const ALLOWED_PATHS: Record<Role, string[]> = {
  operator:      ["/karte", "/linien", "/ereignisse", "/auftraege", "/routenzug", "/einstellungen"],
  schichtleitung:["/ereignisse", "/auftraege", "/karte", "/linien", "/statistiken", "/einstellungen"],
  mitarbeiter:   ["/auftraege", "/linien", "/anzeigetafel", "/einstellungen"],
  gast:          ["/statistiken", "/einstellungen"],
};

const PUBLIC_PATHS = ["/login"];

function parseJwtPayload(token: string): { role?: Role } | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

function passThrough(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  response.headers.set("x-next-pathname", request.nextUrl.pathname);
  return response;
}

function isPathAllowed(pathname: string, role: Role): boolean {
  return ALLOWED_PATHS[role].some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return passThrough(request);
  }

  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = parseJwtPayload(token);

  if (!payload?.role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = payload.role;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(ROLE_REDIRECT[role], request.url));
  }

  if (!isPathAllowed(pathname, role)) {
    return NextResponse.redirect(new URL(ROLE_REDIRECT[role], request.url));
  }

  return passThrough(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
```

### Schritt 2 — `src/lib/useRole.ts` (neue Datei)

```ts
"use client";

import { useState, useEffect } from "react";
import type { Role } from "@/types/auth";

function parseJwtPayload(token: string): { role?: Role } | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

export function useRole(): Role {
  const [role, setRole] = useState<Role>("operator");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)auth-token=([^;]+)/);
    if (match) {
      const payload = parseJwtPayload(match[1]);
      if (payload?.role) setRole(payload.role);
    }
  }, []);

  return role;
}
```

### Hinweis

Der Hook gibt während SSR und dem ersten Client-Render `"operator"` zurück (Default). Rollen-spezifische UI erscheint erst nach Hydration — kurzes Flackern ist bei einem Mock-Projekt akzeptabel. Der Cookie-Regex `(?:^|;\s*)` behandelt korrekt den Fall, dass `auth-token` am Anfang oder nach einem anderen Cookie steht.

---

## Ticket 2 — AU-02: Auftrags-Detail Mitarbeitertransport

**Figma:** `506:18036` (Aufträge - Detail Mitarbeitertransport groß)

### Problem

`auftraege/[id]/page.tsx` zeigt immer das Layout für "Lieferung" mit statischem `MOCK_AUFTRAG`. Es gibt keine Typ-Unterscheidung, keine `useParams`-Abfrage und kein Layout für Mitarbeitertransport (MT).

Das MT-Layout unterscheidet sich signifikant:
- Kopfzeile: "Aufträge" (schwarz) + "Mitarbeitertransport #Linie A" (blau, `#146AA1`)
- Badges: "Mitarbeitertransport" (blau) + "aktiv" (grün)
- Felder: Start, Endhaltestelle, Auftraggeber, Ankunft, Routenzug, Wiederholen, Fahrgäste, Priorität
- Rechtes Panel: "Linienverlauf" mit Haltestellen-Timeline (vergangen → aktuell → Ziel)
- Aktionsleiste: "Hinweis setzen" | "Linie bearbeiten" | "Linie löschen" (rot)
- Button: "In Karte anzeigen"

### Vollständige neue Version

```tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import type { AuftragStatus } from "@/types/auftrag";
import { AuftragDetailHeader } from "@/components/features/AuftragDetailHeader";
import { AuftragDetailFields } from "@/components/features/AuftragDetailFields";
import { AuftragAktionsleiste } from "@/components/features/AuftragAktionsleiste";
import { LieferungTimeline } from "@/components/features/LieferungTimeline";
import { PrioritätBadge } from "@/components/ui-custom/PrioritätBadge";

interface LieferungAuftrag {
  id: string;
  typ: "lieferung";
  art: string;
  artikel: string;
  start: string;
  ziel: string;
  routenzug: string;
  ankunft: string;
  auftraggeber: string;
  erstellt: string;
  priorität: 1 | 2 | 3 | 4;
  status: AuftragStatus;
}

interface LinienStop {
  name: string;
  zeit: string;
  vergangen?: boolean;
  aktuell?: boolean;
}

interface MitarbeitertransportAuftrag {
  id: string;
  typ: "mitarbeitertransport";
  linie: string;
  status: AuftragStatus;
  priorität: 1 | 2 | 3 | 4;
  start: string;
  endhaltestelle: string;
  auftraggeber: string;
  ankunft: string;
  routenzug: string;
  wiederholen: string;
  fahrgäste: number;
  linienverlauf: LinienStop[];
}

type AuftragDetailData = LieferungAuftrag | MitarbeitertransportAuftrag;

const MOCK_AUFTRAEGE: Record<string, AuftragDetailData> = {
  "212": {
    id: "212",
    typ: "lieferung",
    art: "Lieferung",
    artikel: "Karosserieteil #12312 (4 Stk.)",
    start: "Lager B",
    ziel: "Lager A",
    routenzug: "Routenzug A",
    ankunft: "12:10 Uhr (in 12min)",
    auftraggeber: "Alex Auftrag",
    erstellt: "10:50 Uhr",
    priorität: 2,
    status: "aktiv",
  },
  "MT-A": {
    id: "MT-A",
    typ: "mitarbeitertransport",
    linie: "Linie A",
    status: "aktiv",
    priorität: 1,
    start: "Lager C",
    endhaltestelle: "Hauptgebäude",
    auftraggeber: "[geplante Linie]",
    ankunft: "voraussichtlich 12:00 Uhr",
    routenzug: "Routenzug A",
    wiederholen: "jeden: Mo, Di, Mi, Do, Fr",
    fahrgäste: 4,
    linienverlauf: [
      { name: "Lager C",      zeit: "11:40 Uhr",                vergangen: true },
      { name: "Lager A",      zeit: "11:44 Uhr",                vergangen: true },
      { name: "Lager H",      zeit: "11:44 Uhr",                vergangen: true },
      { name: "Halle A",      zeit: "11:48 Uhr",                vergangen: true },
      { name: "Lager F",      zeit: "11:53 Uhr",                vergangen: true },
      { name: "Lager E",      zeit: "Abfahrt: 11:58 Uhr",       aktuell: true  },
      { name: "Hauptgebäude", zeit: "voraussichtlich 12:00 Uhr"                },
    ],
  },
};

const MOCK_TIMELINE = [
  { label: "In Auftrag gegeben",      zeit: "10:50" },
  { label: "Auftrag verarbeitet",     zeit: "10:58" },
  { label: "Scan Beladestation",      zeit: "11:18" },
  { label: "Lieferung geladen",       zeit: "11:28" },
  { label: "In Auslieferung",         zeit: "", aktuell: true },
  { label: "Ankunft voraussichtlich", zeit: "12:10" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[13px] text-[#9A9EA0] font-semibold">{label}</span>
      <div className="text-[20px] font-medium text-black">{children}</div>
    </div>
  );
}

function LinienverlaufStop({ stop }: { stop: LinienStop }) {
  const dotColor = stop.vergangen
    ? "bg-[#C5C5C5]"
    : stop.aktuell
    ? "bg-[#146AA1]"
    : "bg-black";
  const textColor = stop.vergangen ? "text-[#515358]" : "text-black";

  return (
    <div className="flex items-center gap-5">
      <div className={`w-10 h-10 rounded-full shrink-0 ${dotColor}`} />
      <div className={`text-[18px] font-bold ${textColor}`}>
        <span>{stop.name}</span>
        <span className="font-medium ml-2 text-[#515358]">{stop.zeit}</span>
      </div>
    </div>
  );
}

function MitarbeitertransportView({ auftrag, onBack }: { auftrag: MitarbeitertransportAuftrag; onBack: () => void }) {
  return (
    <main className="px-14 pt-16">
      <div className="flex items-baseline gap-3 mb-4">
        <button onClick={onBack} className="text-[#9A9EA0] hover:text-black transition-colors text-[24px] mr-1">←</button>
        <h1 className="text-[42px] font-bold text-black">Aufträge</h1>
        <span className="text-[42px] font-bold text-[#146AA1]">
          Mitarbeitertransport #{auftrag.linie}
        </span>
      </div>

      <div className="flex gap-3 mb-8">
        <span className="bg-[#146AA1]/50 text-[#1F3848] rounded px-3 py-1 text-[18px] font-medium">
          Mitarbeitertransport
        </span>
        <span className="bg-[#51A135]/50 text-[#103C00] rounded px-3 py-1 text-[18px] font-medium">
          aktiv
        </span>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-x-12 gap-y-5">
            <Field label="Start">{auftrag.start}</Field>
            <Field label="Endhaltestelle">{auftrag.endhaltestelle}</Field>
            <Field label="Auftraggeber">{auftrag.auftraggeber}</Field>
            <Field label="Ankunft">{auftrag.ankunft}</Field>
            <Field label="Routenzug">{auftrag.routenzug}</Field>
            <Field label="Wiederholen">{auftrag.wiederholen}</Field>
            <Field label="Fahrgäste">{auftrag.fahrgäste} (aktuell)</Field>
            <Field label="Priorität">
              <PrioritätBadge prio={auftrag.priorität} />
            </Field>
          </div>

          <div className="flex items-center gap-8 bg-[#F9F9F9] rounded-[10px] px-6 py-5">
            <button className="text-[#146AA1] text-[18px] font-bold hover:opacity-70 transition-opacity">
              Hinweis setzen
            </button>
            <button className="text-[#146AA1] text-[18px] font-bold hover:opacity-70 transition-opacity">
              Linie bearbeiten
            </button>
            <button className="text-[#A11414] text-[18px] font-bold hover:opacity-70 transition-opacity">
              Linie löschen
            </button>
          </div>

          <button className="self-start bg-[#C8DDEA] text-[#2D5D7B] text-[18px] font-bold rounded-[10px] px-5 py-2.5 hover:bg-[#C8DDEA]/80 transition-colors">
            In Karte anzeigen
          </button>
        </div>

        <div className="w-[420px] bg-[#F9F9F9] rounded-[10px] px-6 py-5 shrink-0">
          <h2 className="text-[24px] font-bold mb-6">Linienverlauf</h2>
          <div className="relative flex flex-col gap-[50px]">
            <div
              className="absolute left-[19px] top-0 bottom-0 w-[3px] border-l-[3px] border-dashed border-[#9A9EA0]"
              style={{ height: "calc(100% - 40px)", top: "20px" }}
            />
            {auftrag.linienverlauf.map((stop, i) => (
              <LinienverlaufStop key={i} stop={stop} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuftragDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = decodeURIComponent(params.id);
  const auftrag = MOCK_AUFTRAEGE[id] ?? null;

  if (!auftrag) {
    const lieferungsAuftrag = MOCK_AUFTRAEGE["212"] as LieferungAuftrag;
    return (
      <main className="px-14 pt-16">
        <AuftragDetailHeader
          id={lieferungsAuftrag.id}
          art={lieferungsAuftrag.art}
          status={lieferungsAuftrag.status}
          onBack={() => router.push("/auftraege")}
        />
        <div className="flex gap-8 mt-8">
          <div className="flex-1 flex flex-col gap-6">
            <AuftragDetailFields {...lieferungsAuftrag} />
            <AuftragAktionsleiste onBearbeiten={() => {}} onStornieren={() => {}} />
            <button className="text-blue-primary underline self-start">In Karte anzeigen</button>
          </div>
          <div className="w-85">
            <h2 className="text-[20px] font-semibold mb-4">Lieferungsverlauf</h2>
            <LieferungTimeline schritte={MOCK_TIMELINE} />
          </div>
        </div>
      </main>
    );
  }

  if (auftrag.typ === "mitarbeitertransport") {
    return <MitarbeitertransportView auftrag={auftrag} onBack={() => router.push("/auftraege")} />;
  }

  return (
    <main className="px-14 pt-16">
      <AuftragDetailHeader
        id={auftrag.id}
        art={auftrag.art}
        status={auftrag.status}
        onBack={() => router.push("/auftraege")}
      />
      <div className="flex gap-8 mt-8">
        <div className="flex-1 flex flex-col gap-6">
          <AuftragDetailFields {...auftrag} />
          <AuftragAktionsleiste onBearbeiten={() => {}} onStornieren={() => {}} />
          <button className="text-blue-primary underline self-start">In Karte anzeigen</button>
        </div>
        <div className="w-85">
          <h2 className="text-[20px] font-semibold mb-4">Lieferungsverlauf</h2>
          <LieferungTimeline schritte={MOCK_TIMELINE} />
        </div>
      </div>
    </main>
  );
}
```

### Hinweise

- `MitarbeitertransportView` ist eine datei-lokale Komponente — kein Export, kein eigener File, da sie nur in dieser Route genutzt wird.
- Der `!auftrag`-Fallback rendert die Lieferung mit ID "212" als sicheres Default — bei einem echten Backend würde hier eine 404-Seite erscheinen.
- Die `LinienverlaufStop`-Komponente ist bewusst einfach gehalten: drei Zustände (vergangen/aktuell/zukünftig) steuern Farbe von Dot und Text.
- Die gestrichelte vertikale Linie im Linienverlauf ist via absolut positioniertem `border-dashed` realisiert — analog zur Figma-Darstellung mit `strokeDashes=7,7`.
- `AuftragDetailFields` erwartet ein Objekt mit bestimmten Props. Bei Typ-Konflikten: den Spread `{...auftrag}` durch einzelne benannte Props ersetzen.

---

## Ticket 3 — SL-01: Ereignisansicht Schichtleitung

**Figma:** `512:17380` (Ereignisansicht SL groß)

### Problem

`/ereignisse` zeigt für alle Rollen dieselbe Ansicht. Die Schichtleitung sieht laut Figma:
- Extra Spalte **"Betroffen"** (welche Bereiche/Routen betroffen sind, z.B. "Mitarbeitertransport", "Produktion A, Mitarbeitertransport")
- Zwei zusätzliche Toolbar-Buttons: **"neuer Filter"** und **"als Ansicht speichern"**
- Alle drei Tabs sind identisch: Alle | Offen | Archiv

### Schritt 1 — `src/types/ereignis.ts`: `betroffen`-Feld ergänzen

Im `Ereignis`-Interface ein optionales Feld hinzufügen:

```ts
export interface Ereignis {
  id: string;
  art: string;
  fahrzeug: string;
  status: EreignisStatus;
  bearbeiter?: string;
  priorität: 1 | 2 | 3 | 4;
  erstelltAt: string;
  betroffen?: string;  // NEU — betroffene Bereiche/Routen (nur für SL sichtbar)
}
```

### Schritt 2 — `src/components/features/EreignisListView.tsx`: Props erweitern

```tsx
interface EreignisListViewProps {
  // ... bestehende Props ...
  showBetroffen?: boolean;        // NEU
  onSaveView?: () => void;        // NEU
}
```

Im Toolbar-Bereich von `EreignisListView` (nach dem vorhandenen "neuer Filter"-Button bzw. wo die Toolbar-Buttons gerendert werden) bedingt den "als Ansicht speichern"-Button rendern:

```tsx
{showBetroffen && onSaveView && (
  <button
    onClick={onSaveView}
    className="flex items-center gap-2 bg-[#E8F0F6] text-[#146AA1] rounded px-3 py-1.5 text-[18px] font-semibold hover:bg-[#E8F0F6]/70 transition-colors"
  >
    als Ansicht speichern
  </button>
)}
```

In der Spaltenreihe (ListHeader-Zeile) bedingt die "Betroffen"-Spalte einblenden:

```tsx
{showBetroffen && (
  <span className="w-[250px] text-[20px] font-semibold text-black shrink-0">Betroffen</span>
)}
```

In jeder `EreignisListRow` (oder direkt in der Map-Schleife in `EreignisListView`) ebenfalls bedingt rendern:

```tsx
{showBetroffen && (
  <span className="w-[250px] text-[18px] text-black shrink-0">
    {ereignis.betroffen ?? "—"}
  </span>
)}
```

### Schritt 3 — `src/app/(protected)/ereignisse/page.tsx`: Rolle lesen + SL-Props übergeben

```tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EreignisListView } from "@/components/features/EreignisListView";
import { EreignisFilterDialog } from "@/components/features/EreignisFilterDialog";
import { useRole } from "@/lib/useRole";
import type { Ereignis, EreignisFilter } from "@/types/ereignis";
import { EMPTY_EREIGNIS_FILTER } from "@/types/ereignis";

type TabType = "alle" | "offen" | "archiv";

const MOCK_EREIGNISSE: Ereignis[] = [
  {
    id: "#103",
    art: "Kommunikationsanfrage",
    fahrzeug: "Routenzug B",
    status: "in-bearbeitung",
    priorität: 4,
    erstelltAt: "16:04 Uhr",
    betroffen: "Mitarbeitertransport",
  },
  {
    id: "#102",
    art: "Strecke blockiert",
    fahrzeug: "Routenzug B",
    status: "neu",
    priorität: 3,
    erstelltAt: "14:28 Uhr",
    betroffen: "Produktion A, Mitarbeitertransport",
  },
  {
    id: "#101",
    art: "Verlassen Betriebsgelände",
    fahrzeug: "Routenzug C",
    status: "neu",
    priorität: 1,
    erstelltAt: "16:02 Uhr",
    betroffen: "Produktion D",
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
  const role = useRole();
  const isSL = role === "schichtleitung";

  const tabParam = searchParams.get("tab");
  const initialTab: TabType =
    tabParam === "offen" || tabParam === "archiv" ? tabParam : "alle";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EreignisFilter>(EMPTY_EREIGNIS_FILTER);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <main className="px-14 pt-16">
        <h1 className="text-[42px] font-bold text-black mb-15.75">Ereignisse</h1>
        <EreignisListView
          ereignisse={MOCK_EREIGNISSE}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={(id) => router.push(`/ereignisse/${encodeURIComponent(id)}`)}
          filter={filter}
          onFilterOpen={() => setFilterOpen(true)}
          onFilterRemove={(key) =>
            setFilter((prev) => ({
              ...prev,
              [key]: Array.isArray(prev[key]) ? [] : "",
            }))
          }
          showBetroffen={isSL}
          onSaveView={isSL ? () => {} : undefined}
        />
      </main>
      <EreignisFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        initialFilter={filter}
        onApply={setFilter}
      />
    </>
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

### Hinweis

`showBetroffen` und `onSaveView` sind optionale Props — alle bestehenden Stellen, die `EreignisListView` nutzen, kompilieren weiterhin ohne Anpassung. Der `useRole()`-Hook gibt initial `"operator"` zurück, bis die Cookie-Abfrage im `useEffect` die echte Rolle setzt. SL-Nutzer sehen die Operator-Ansicht für einen kurzen Moment — bei einem Prototypen tolerierbar.

---

## Ticket 4 — MA-01: Aufträge Mitarbeiter

**Figma:** `512:20406` (Aufträge ma groß)

### Problem

`/auftraege` zeigt dieselbe Ansicht für alle Rollen. Der Mitarbeiter sieht laut Figma:
- Extra Tab **"Meine Lieferungen"** (zwischen "Alle" und "Offen")
- Andere Spaltenkopfzeile: **ID / Linie | Art | Enthaltene Artikel | Ziel / Endhaltestelle | Auftraggeber | Status | Ankunft** (kein Priorität-Feld)
- Zwei zusätzliche Toolbar-Buttons: **"neuer Filter"** + **"als Ansicht speichern"**
- Zwei aktive Filter-Badges: "Status: geplant, aktiv, unterbrochen" + "Auftraggeber: Jonas Muster"

### Schritt 1 — `src/types/auftrag.ts`: `AuftragTab` und `enthalteneArtikel`

```ts
// AuftragTab um MA-spezifischen Tab erweitern
export type AuftragTab = "alle" | "meine-lieferungen" | "offen" | "archiv";

export interface Auftrag {
  id: string;
  linie?: string;
  art?: string;
  von?: string;
  ab?: string;
  ziel?: string;
  auftraggeber?: string;
  status: AuftragStatus;
  ankunft?: string;
  enthalteneArtikel?: string;  // NEU — für MA-Ansicht
}
```

### Schritt 2 — `src/components/features/AuftragListView.tsx`: Props für MA-Modus

```tsx
interface AuftragListViewProps {
  // ... bestehende Props ...
  showMeineTab?: boolean;    // NEU — fügt "Meine Lieferungen"-Tab hinzu
  showArtikelSpalte?: boolean; // NEU — ersetzt Von/Nach durch Artikel/Ziel-Spalte
  onSaveView?: () => void;   // NEU — "als Ansicht speichern"-Button für SL/MA
}
```

In der Tab-Leiste bedingt den Extra-Tab einfügen:

```tsx
const tabs: AuftragTab[] = showMeineTab
  ? ["alle", "meine-lieferungen", "offen", "archiv"]
  : ["alle", "offen", "archiv"];
```

In der Spaltenreihe der Tabelle bedingt die Spalten rendern:

```tsx
// Wenn showArtikelSpalte=true: "Enthaltene Artikel" und "Ziel / Endhaltestelle" statt "Von" und "Nach"
{showArtikelSpalte ? (
  <>
    <span className="...">Enthaltene Artikel</span>
    <span className="...">Ziel / Endhaltestelle</span>
  </>
) : (
  <>
    <span className="...">Von</span>
    <span className="...">Nach</span>
  </>
)}
```

Gleiches Prinzip in jeder `AuftragListRow`.

### Schritt 3 — `src/app/(protected)/auftraege/page.tsx`: Rolle lesen + MA-Props übergeben

```tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Auftrag, AuftragFilter, AuftragTab } from "@/types/auftrag";
import { EMPTY_AUFTRAG_FILTER } from "@/types/auftrag";
import { AuftragListView } from "@/components/features/AuftragListView";
import { AuftragErstellenDialog } from "@/components/features/AuftragErstellenDialog";
import { AuftragFilterDialog } from "@/components/features/AuftragFilterDialog";
import { useRole } from "@/lib/useRole";

const INITIAL_AUFTRÄGE: Auftrag[] = [
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
    enthalteneArtikel: "Karosserieteil A",
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
    enthalteneArtikel: "—",
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
    enthalteneArtikel: "—",
  },
  {
    id: "#212",
    linie: "—",
    art: "Lieferung",
    von: "Lager A",
    ab: "12:00",
    ziel: "Halle A",
    auftraggeber: "Jonas Muster",
    status: "aktiv",
    ankunft: "12:10 Uhr",
    enthalteneArtikel: "Karosserieteil B",
  },
  {
    id: "#210",
    linie: "—",
    art: "Lieferung",
    von: "Lager A",
    ab: "12:10",
    ziel: "Halle A",
    auftraggeber: "Jonas Muster",
    status: "unterbrochen",
    ankunft: "12:20 Uhr (+5)",
    enthalteneArtikel: "Karosserieteil A",
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
    enthalteneArtikel: "Maschinenteil X",
  },
];

function AuftragPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = useRole();
  const isMA = role === "mitarbeiter";

  const tabParam = searchParams.get("tab");
  const validTabs: AuftragTab[] = isMA
    ? ["alle", "meine-lieferungen", "offen", "archiv"]
    : ["alle", "offen", "archiv"];
  const initialTab: AuftragTab = validTabs.includes(tabParam as AuftragTab)
    ? (tabParam as AuftragTab)
    : "alle";

  const [activeTab, setActiveTab] = useState<AuftragTab>(initialTab);
  const [searchValue, setSearchValue] = useState("");
  const [aufträge, setAufträge] = useState<Auftrag[]>(INITIAL_AUFTRÄGE);
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [auftragsFilter, setAuftragsFilter] = useState<AuftragFilter>(EMPTY_AUFTRAG_FILTER);

  return (
    <>
      <main className="px-14 pt-16">
        <h1 className="text-[42px] font-bold mb-15.75">Aufträge</h1>
        <AuftragListView
          aufträge={aufträge}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onRowClick={(id) => router.push(`/auftraege/${encodeURIComponent(id)}`)}
          onNeuErstellen={isMA ? undefined : () => setCreateOpen(true)}
          filter={auftragsFilter}
          onFilterOpen={() => setFilterOpen(true)}
          onFilterRemove={(key) =>
            setAuftragsFilter((prev) => ({ ...prev, [key]: [] }))
          }
          showMeineTab={isMA}
          showArtikelSpalte={isMA}
          onSaveView={isMA ? () => {} : undefined}
        />
      </main>
      {!isMA && (
        <AuftragErstellenDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={(data) =>
            setAufträge((prev) => [
              { ...data, id: `AUF-${String(prev.length + 1).padStart(3, "0")}` },
              ...prev,
            ])
          }
        />
      )}
      <AuftragFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        initialFilter={auftragsFilter}
        onApply={setAuftragsFilter}
      />
    </>
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

- `onNeuErstellen={isMA ? undefined : ...}` — Mitarbeiter können keine neuen Aufträge erstellen (kein "Neu erstellen"-Button sichtbar). `AuftragListView` sollte den Button nur rendern wenn `onNeuErstellen` übergeben wird.
- Der "Meine Lieferungen"-Tab filtert in der Praxis nach `auftraggeber === currentUser.name`. Im Mock: er zeigt einfach alle Aufträge (kein echter Filter nötig).
- `AuftragTab` wird in `types/auftrag.ts` erweitert — alle Stellen, die den alten Typ nutzen, können `"meine-lieferungen"` ignorieren (TypeScript warnt bei switch/exhaustive checks).
- Die MA-Zeilen mit `id: "#212"` und `id: "#210"` matchen die Figma-Mockdaten und ermöglichen Navigation zu `/auftraege/%23212` → dort erscheint ein Lieferungs-Detail.
