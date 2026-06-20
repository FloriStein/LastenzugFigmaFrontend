# Sprint 12 — Routing-Komplettierung, Ereignis-Detail & Operator-Navigation

## Ziel

Root-Page verdrahten, Operator-Sidebar vollständig machen (inkl. Layout-Fix für Karte/Linien), RoutenzugDetail-Abschließen absichern und Ereignis-Detail auf das Niveau von AuftragDetail heben.

Tests kommen **nach** der Implementierung — dieses Dokument enthält keine Testblöcke.

## Scope

| # | Ticket | Beschreibung | Zieldatei(en) |
|---|--------|--------------|---------------|
| 1 | RP-01 | Root Page → redirect /login | `src/app/page.tsx` |
| 2 | OR-01 | Sidebar Operator + Karte/Linien Layout-Fix | `middleware.ts` + `(protected)/layout.tsx` + `Sidebar.tsx` |
| 3 | RZ-02 | RoutenzugDetail Abschließen-Bestätigung | `routenzug/[id]/page.tsx` |
| 4 | ER-02 | Ereignis-Detail Layout + Status-Workflow | `ereignisse/[id]/page.tsx` |

## Abhängigkeiten / Vorbereitung

- Keine neuen npm-Packages nötig
- Keine neuen shadcn-Komponenten nötig
- Unabhängig von Sprint 10/11 — alle 4 Tickets stehen für sich

## Implementierungsreihenfolge

1. RP-01 (trivial, keine Deps)
2. OR-01 (Middleware-Änderung sollte vor Layout-Tests ausprobiert werden)
3. RZ-02 (eigenständig, nutzt existierende Komponenten)
4. ER-02 (komplex, zuletzt)

---

## Ticket 1 — RP-01: Root Page Redirect

**Datei:** `src/app/page.tsx`

### Problem

Die Root-Page zeigt den Next.js-Default-Scaffold. Benutzer die `/` aufrufen, sollten zur Login-Seite weitergeleitet werden — oder, wenn bereits eingeloggt, zur rollenspezifischen Startseite (das übernimmt bereits die `middleware.ts`).

### Vollständige neue Version

```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login");
}
```

Das ist die gesamte Datei — kein Import von `Image`, keine Vercel-Links.

---

## Ticket 2 — OR-01: Sidebar Operator + Karte/Linien Layout-Fix

### Problem

`NAV_CONFIG.operator` enthält nur Ereignisse, Aufträge, Einstellungen — Karte und Linien fehlen, obwohl der Operator laut Design-Audit auf beide zugreift.

Wenn Karte/Linien im Operator-NAV ergänzt werden, entsteht ein Layout-Konflikt: `(protected)/layout.tsx` rendert immer die volle Sidebar (266px) + `KarteShell` rendert die kompakte Sidebar (92px) — zwei Sidebars nebeneinander.

### Lösung

Middleware setzt einen `x-next-pathname`-Header. Die Layout-Komponente liest diesen Header und rendert bei `/karte`- und `/linien`-Routen keine volle Sidebar.

### Schritt 1 — `src/middleware.ts` anpassen

Den bisherigen `NextResponse.next()`-Aufruf am Ende durch eine Version mit gesetztem Header ersetzen. Außerdem für den Public-Path-Fall ebenfalls den Header setzen (damit der Header immer verfügbar ist):

```ts
import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@/types/auth";

const ROLE_REDIRECT: Record<Role, string> = {
  operator: "/karte",
  schichtleitung: "/ereignisse",
  mitarbeiter: "/auftraege",
  gast: "/statistiken",
};

const PUBLIC_PATHS = ["/login"];

function parseJwtPayload(token: string): { role?: Role } | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
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

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(ROLE_REDIRECT[payload.role] ?? "/login", request.url)
    );
  }

  return passThrough(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
```

### Schritt 2 — `src/app/(protected)/layout.tsx` anpassen

```tsx
import { cookies, headers } from "next/headers";
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

const KARTE_SHELL_PATHS = ["/karte", "/linien"];

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [cookieStore, headersList] = await Promise.all([cookies(), headers()]);
  const token = cookieStore.get("auth-token")?.value;
  const { role, name } = token
    ? parseTokenPayload(token)
    : { role: "operator" as SidebarRole, name: "Benutzer" };

  const pathname = headersList.get("x-next-pathname") ?? "/";
  const showSidebar = !KARTE_SHELL_PATHS.some((p) => pathname.startsWith(p));

  return (
    <div className="flex h-screen">
      {showSidebar && <SidebarWrapper role={role} userName={name} />}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
```

### Schritt 3 — `src/components/layout/Sidebar.tsx` — `NAV_CONFIG.operator` ergänzen

```tsx
const NAV_CONFIG: Record<SidebarRole, NavItemDef[]> = {
  operator: [
    { label: "Ereignisse",    href: "/ereignisse",    icon: <IconEreignisse />, subItems: EREIGNISSE_SUB_ITEMS },
    { label: "Aufträge",      href: "/auftraege",     icon: <IconAuftraege /> },
    { label: "Karte",         href: "/karte",         icon: <IconKarte /> },
    { label: "Linien",        href: "/linien",        icon: <IconLinien /> },
    { label: "Einstellungen", href: "/einstellungen", icon: <IconEinstellungen /> },
  ],
  schichtleitung: [
    // unverändert
  ],
  mitarbeiter: [
    // unverändert (Anzeigetafel kommt aus Sprint-10-SB-01)
  ],
};
```

### Hinweis

Auf `/karte` und `/linien` wird die volle Sidebar **nicht** gerendert — nur `KarteShell` mit der kompakten Icon-Sidebar (92px). Dieser Zustand entspricht dem Figma-Design. Der `x-next-pathname`-Header wird durch die Middleware bei jedem Request gesetzt; das erfordert keinen Client-Code.

---

## Ticket 3 — RZ-02: RoutenzugDetail Abschließen-Bestätigung

**Datei:** `src/app/(protected)/routenzug/[id]/page.tsx`

**Figma:** `510:20873` (Routenzug-Detail – abschließen)

### Problem

`onAbschließen={() => router.back()}` navigiert sofort zurück — keine Bestätigung. Im echten System bedeutet "Abschließen", dass der Routenzug aus dem aktiven Betrieb genommen wird.

### Änderung

Lokalen `confirming`-State ergänzen. Das Bestätigungs-Banner erscheint direkt unterhalb der `EreignisTitelleiste` (als Fragment im `titelleiste`-Slot):

```tsx
export default function RoutenzugDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const routenzug = MOCK_ROUTENZUG_DETAILS[decodeURIComponent(params.id)] ?? null;
  const [fahrtmodus, dispatch] = useFahrtmodus("manuell");
  const [confirming, setConfirming] = useState(false);   // NEU

  const handlePrimaryAction = () => dispatch(primaryActionFor(fahrtmodus));

  if (!routenzug) {
    // ... unverändert
  }

  return (
    <RoutenzugDetailShell
      titelleiste={
        <>
          <EreignisTitelleiste
            title={routenzug.name}
            connectionStatus="connected"
            backHref="/karte"
            onAbschließen={() => setConfirming(true)}   // GEÄNDERT
          />
          {confirming && (
            <div className="bg-[#1a1f2b] px-8 py-3 flex items-center gap-4 shrink-0">
              <span className="text-white text-[14px]">
                Fahrt wirklich abschließen?
              </span>
              <button
                onClick={() => router.push("/karte")}
                className="bg-blue-primary text-white rounded-[8px] px-4 py-1.5 text-[14px] font-medium hover:bg-blue-primary/80 transition-colors"
              >
                Ja, abschließen
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="border border-white/30 text-white rounded-[8px] px-4 py-1.5 text-[14px] font-medium hover:bg-white/10 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          )}
        </>
      }
      kameraPanel={/* unverändert */}
      fahrtInfoPanel={/* unverändert */}
      aktionenPanel={/* unverändert */}
    />
  );
}
```

### Hinweis

`RoutenzugDetailShell.titelleiste` ist `React.ReactNode` — ein Fragment ist dort gültig. Das Banner erscheint nur wenn `confirming === true` und schiebt den Inhalt nicht — es ist `shrink-0` in einem Flex-Container.

---

## Ticket 4 — ER-02: Ereignis-Detail Layout + Status-Workflow

**Datei:** `src/app/(protected)/ereignisse/[id]/page.tsx`

**Figma:** `504:17602` (Ereignis-Detail – Strecke blockiert)

### Problem

Die aktuelle Seite rendert eine unstyled `<dl>` und hat keinen Status-Workflow. Unterschied zum AuftragDetail:
- Kein 2-spaltiges Grid
- Keine Aktionsbuttons
- Status ändert sich nie

### Status-Workflow

| Aktueller Status | Button | Ziel-Status |
|---|---|---|
| `neu` | "Ereignis annehmen" (blau) | `in-bearbeitung` |
| `in-bearbeitung` | "Ereignis abschließen" (blau) → Inline-Bestätigung | `abgeschlossen` |
| `abgeschlossen` | — (Hinweis-Text) | — |

### Vollständige neue Version

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DetailShell } from "@/components/layout/DetailShell";
import { EreignisTitelleiste } from "@/components/features/EreignisTitelleiste";
import { FahrtmodusCard } from "@/components/features/FahrtmodusCard";
import { PrioritätBadge } from "@/components/ui-custom/PrioritätBadge";
import { useFahrtmodus } from "@/lib/useFahrtmodus";
import type { Ereignis, EreignisStatus } from "@/types/ereignis";
import type { FahrtmodusVariant } from "@/types/fahrtmodus";

type EreignisDetail = Ereignis & { routenzug: string };

const MOCK_EREIGNIS_DETAILS: Record<string, EreignisDetail> = {
  "#102": { id: "#102", art: "Strecke blockiert",      fahrzeug: "Routenzug A", status: "neu",            priorität: 3, erstelltAt: "14:28 Uhr",         routenzug: "Routenzug A" },
  "#103": { id: "#103", art: "Kommunikationsanfrage",  fahrzeug: "Routenzug B", status: "neu",            priorität: 4, erstelltAt: "16:04 Uhr",         routenzug: "Routenzug B" },
  "#99":  { id: "#99",  art: "Weiterfahrt bestätigen", fahrzeug: "Routenzug A", status: "in-bearbeitung", priorität: 1, erstelltAt: "15:26 Uhr",         routenzug: "Routenzug A", bearbeiter: "Maxi Muster" },
  "#95":  { id: "#95",  art: "Strecke blockiert",      fahrzeug: "Routenzug A", status: "abgeschlossen",  priorität: 1, erstelltAt: "6. Aug, 14:28 Uhr", routenzug: "Routenzug A", bearbeiter: "Tim Zabel" },
};

const STATUS_LABEL: Record<EreignisStatus, string> = {
  "neu":             "Neu",
  "in-bearbeitung":  "In Bearbeitung",
  "warten":          "Warten",
  "abgeschlossen":   "Abgeschlossen",
};

const STATUS_COLOR: Record<EreignisStatus, string> = {
  "neu":             "text-blue-primary",
  "in-bearbeitung":  "text-yellow-500",
  "warten":          "text-orange-500",
  "abgeschlossen":   "text-green-600",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[13px] text-gray-muted">{label}</span>
      <div className="text-[15px] font-medium text-dark-surface">{children}</div>
    </div>
  );
}

function primaryActionFor(variant: FahrtmodusVariant) {
  switch (variant) {
    case "manuell":              return { type: "SET_MODUS" as const, payload: "autom-eingabe" as const };
    case "autom-eingabe":        return { type: "SET_MODUS" as const, payload: "manuell" as const };
    case "autom-nicht-moeglich": return { type: "SET_MODUS" as const, payload: "manuell" as const };
    case "wiederherstellung":    return { type: "RESTORE" as const };
  }
}

export default function EreignisDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const ereignis = MOCK_EREIGNIS_DETAILS[decodeURIComponent(params.id)] ?? null;
  const [fahrtmodus, dispatch] = useFahrtmodus("manuell");
  const [status, setStatus] = useState<EreignisStatus>(ereignis?.status ?? "neu");
  const [abschlussConfirm, setAbschlussConfirm] = useState(false);

  if (ereignis === null) {
    return (
      <DetailShell titelleiste={<div className="h-37 bg-blue-primary" />}>
        <div className="p-8">
          <p className="text-[20px] font-bold text-black">Ereignis nicht gefunden.</p>
          <Link href="/ereignisse" className="text-blue-primary underline mt-2 inline-block">
            ← Zurück zur Ereignisliste
          </Link>
        </div>
      </DetailShell>
    );
  }

  return (
    <DetailShell
      titelleiste={
        <EreignisTitelleiste
          title={`${ereignis.art} · ${ereignis.fahrzeug}`}
          connectionStatus="connected"
          backHref="/ereignisse"
          onAbschließen={() => router.back()}
        />
      }
    >
      <main className="px-14 pt-10 flex gap-10">
        <div className="flex-1 flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-5">
            <Field label="Ereignis-ID">{ereignis.id}</Field>
            <Field label="Erstellt">{ereignis.erstelltAt}</Field>
            <Field label="Ereignisart">{ereignis.art}</Field>
            <Field label="Bearbeiter">{ereignis.bearbeiter ?? "[offen]"}</Field>
            <Field label="Fahrzeug">{ereignis.fahrzeug}</Field>
            <Field label="Priorität">
              <PrioritätBadge value={ereignis.priorität} />
            </Field>
            <Field label="Status">
              <span className={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</span>
            </Field>
          </div>

          <div
            className="flex items-center gap-4 rounded-[10px] px-6 py-4"
            style={{ background: "rgba(158, 172, 182, 0.1)" }}
          >
            {status === "neu" && (
              <button
                onClick={() => setStatus("in-bearbeitung")}
                className="bg-blue-primary text-white rounded-[8px] px-5 py-2 font-medium text-[15px] hover:bg-blue-primary/80 transition-colors"
              >
                Ereignis annehmen
              </button>
            )}

            {status === "in-bearbeitung" && !abschlussConfirm && (
              <button
                onClick={() => setAbschlussConfirm(true)}
                className="bg-blue-primary text-white rounded-[8px] px-5 py-2 font-medium text-[15px] hover:bg-blue-primary/80 transition-colors"
              >
                Ereignis abschließen
              </button>
            )}

            {status === "in-bearbeitung" && abschlussConfirm && (
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-[#646A79]">
                  Ereignis wirklich abschließen?
                </span>
                <button
                  onClick={() => { setStatus("abgeschlossen"); setAbschlussConfirm(false); }}
                  className="bg-blue-primary text-white rounded-[8px] px-4 py-1.5 font-medium text-[14px] hover:bg-blue-primary/80 transition-colors"
                >
                  Ja, abschließen
                </button>
                <button
                  onClick={() => setAbschlussConfirm(false)}
                  className="border border-gray-300 text-dark-surface rounded-[8px] px-4 py-1.5 font-medium text-[14px] hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            )}

            {status === "abgeschlossen" && (
              <span className="text-green-600 text-[14px] font-medium">
                ✓ Ereignis ist abgeschlossen
              </span>
            )}
          </div>
        </div>

        <div className="w-72 shrink-0">
          <FahrtmodusCard
            variant={fahrtmodus}
            onPrimaryAction={() => dispatch(primaryActionFor(fahrtmodus))}
          />
        </div>
      </main>
    </DetailShell>
  );
}
```

### Hinweise

- `useState(ereignis?.status ?? "neu")` — der optionale Chain ist nötig weil TypeScript den null-Check oben nicht in den State-Initializer propagiert. Alternativ: `useState<EreignisStatus>(ereignis === null ? "neu" : ereignis.status)`.
- `PrioritätBadge` ist neu in diesem Import — bisher nicht in `ereignisse/[id]/page.tsx` verwendet. Import ergänzen.
- `Field` ist eine datei-lokale Komponente (kein eigener Export), konsistent mit dem Muster in `AuftragDetailFields.tsx`.
- Der `FahrtmodusCard` bleibt rechts — er ist für "Strecke blockiert"-Ereignisse relevant und schadet bei anderen Ereignistypen nicht.
