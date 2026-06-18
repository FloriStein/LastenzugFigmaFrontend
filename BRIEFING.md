# Agent Briefing — Routenzüge

Dieses Dokument ist der Einstiegspunkt für neue Sessions. Lies es zuerst, bevor du irgendwas tust.

---

## Was ist dieses Projekt?

Eine industrielle Logistik-Management-App für **Routenzüge (Tugger Trains)** in Fertigungsumgebungen. Operatoren überwachen Fahrzeuge auf einer Fabrikkarte, verwalten Aufträge und reagieren auf Ereignisse (z.B. blockierte Strecken).

**Figma-Datei:** `6iHSHiZwZ7ouNQ3KVUy6OK` — immer für Figma-Zugriff nutzen  
**GitHub:** `git@github.com:FloriStein/LastenzugFigmaFrontend.git`

---

## Aktueller Stand

| Phase | Status |
|---|---|
| Design Audit | ✅ Abgeschlossen → `design-audit.md` |
| Architekturentscheidungen | ✅ Alle 5 entschieden → `decisions.md` |
| Projekt-Setup (Claude-Struktur) | ✅ Abgeschlossen |
| Git + GitHub | ✅ Verbunden, Branch `main` |
| **Next.js Scaffold** | ✅ Abgeschlossen |
| Design Tokens konfigurieren | ✅ Abgeschlossen (globals.css) |
| **Komponentenbibliothek** | ⬅️ **Hier geht es weiter** → `sprint-1.md` |
| Screens implementieren | ⏳ Ausstehend |

---

## Die 5 getroffenen Entscheidungen (Kurzfassung)

Details in `decisions.md`.

| # | Thema | Entscheidung |
|---|---|---|
| 1 | Kartenkomponente | `react-leaflet` mit `CRS.Simple` |
| 2 | Authentifizierung | JWT + Next.js `middleware.ts` (kein NextAuth) |
| 3 | Echtzeit | SSE als Ziel, Mock-Polling jetzt (`setInterval`) |
| 4 | Dark Mode | `next-themes` systemweit, manueller Toggle |
| 5 | Fahrtmodus-State | `useReducer` + TypeScript-Union-Types |

---

## Nächster Schritt: Next.js Scaffold

Das Projekt-Verzeichnis ist aktuell leer bis auf die Planungsdokumente. Der Scaffold muss noch erstellt werden.

**Was zu tun ist:**
1. `npx create-next-app@latest` mit diesen Optionen:
   - TypeScript: **Ja**
   - ESLint: **Ja**
   - Tailwind CSS: **Ja**
   - `src/` directory: **Ja**
   - App Router: **Ja**
   - Turbopack: **Ja**
   - Import alias: **Ja** (`@/*`)

2. `shadcn@latest init` ausführen

3. `next-themes` installieren (Dark Mode, Entscheidung #4)

4. `react-leaflet` + `leaflet` installieren (Karte, Entscheidung #1)

5. Design Tokens aus `design-audit.md → Abschnitt 4` in `tailwind.config.ts` + `globals.css` eintragen

6. Ordnerstruktur nach `CLAUDE.md → Projektstruktur` anlegen

7. `middleware.ts` Grundgerüst für Rollenweiterleitung anlegen (Entscheidung #2)

---

## Wichtige Dateien

| Datei | Inhalt |
|---|---|
| `CLAUDE.md` | Stack, Konventionen, Entscheidungsprozess — wird automatisch geladen |
| `design-audit.md` | Screens-Inventar, Design Tokens, Komponenten-Mapping, Routing-Struktur |
| `decisions.md` | Alle Architekturentscheidungen mit Begründung |
| `backlog.md` | 47 Tickets in 5 Schichten (AT/MO/OR/TM/SC) mit Figma-Refs |
| `sprint-1.md` | **Aktueller Sprint** — 8 Tickets, vollständige Specs, kein Figma-MCP nötig |
| `.mcp.json` | Figma MCP Server (`figma-developer-mcp`) |
| `.claude/settings.local.json` | Figma API Key — gitignored, nicht anfassen |

---

## Custom Skills (Slash-Commands)

| Command | Wann nutzen |
|---|---|
| `/figma-check <node-id>` | Vor der Screen-Implementierung — holt Frame-Briefing aus Figma |
| `/new-screen <name> <rolle> <node-id>` | Neuen Screen anlegen + Figma-Kontext |
| `/new-component <Name> <feature>` | Feature-Komponente nach Konventionen scaffolden |
| `/grill-me [thema]` | Wenn eine wichtige Entscheidung ansteht — Ergebnis in `decisions.md` |

---

## Arbeitsweise

- **Entscheidungen:** Immer `/grill-me` nutzen, nie einfach drauflos entscheiden
- **Screens:** Immer erst `/figma-check` dann `/new-screen` — nie ohne Figma-Kontext implementieren
- **Konventionen:** Kein Default Export außer Next.js Pages, Props-Interface direkt über Komponente, shadcn-Komponenten nie direkt editieren
- **Commits:** Nach jeder abgeschlossenen Phase committen und pushen

---

## Benutzerrollen & ihre Startseiten

| Rolle | Route-Gruppe | Startseite nach Login |
|---|---|---|
| Operator | `(operator)` | `/karte` |
| Schichtleitung | `(schichtleitung)` | `/ereignisse` |
| Mitarbeiter | `(mitarbeiter)` | `/auftraege` |
| Gast | `(gast)` | `/statistiken` |
