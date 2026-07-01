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
| Design Audit | ✅ → `design-audit.md` |
| Architekturentscheidungen | ✅ Alle 5 entschieden → `decisions.md` |
| Projekt-Setup + Scaffold + Tokens | ✅ |
| Sprint 1–2 (Atoms, Molecules, Sidebar, Templates) | ✅ → `sprint-1.md`, `sprint-2.md` |
| Sprint 3–6 (Ereignisse, Karte, Routenzug-Detail, Ereignis-Detail) | ✅ → `sprint-3.md` – `sprint-6.md` |
| Sprint 7 (Tests & Edge Cases) | ✅ → `sprint-7.md` |
| Sprint 8 (Refactoring) | ✅ → `sprint-8.md` |
| Sprint 9 (Stub-Seiten: Aufträge, Einstellungen, Statistiken, Anzeigetafel) | ✅ → `sprint-9.md` |
| Sprint 10 (Dark Mode, AuftraegePage, Stornieren-Bestätigung, Sidebar MA) | ✅ → `sprint-10.md` |
| Sprint 11 (SearchBar Clear, Filter-Dialoge, Erstellen-Dialog) | ✅ → `sprint-11.md` |
| Sprint 12 (Root-Redirect, Sidebar OR, Abschließen-Bestätigung, Ereignis-Detail) | ✅ → `sprint-12.md` |
| Sprint 13 (Rollen-Zugangskontrolle, Mitarbeitertransport-Detail, Ereignisansicht SL, Aufträge MA) | ⬅️ **Hier geht es weiter** → `sprint-13.md` |
| Sprint 14 (Anzeigetafel-Polishing, Statistiken SL, Statistiken Gast) | offen → `sprint-14.md` |

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

## Wichtige Dateien

| Datei | Inhalt |
|---|---|
| `CLAUDE.md` | Stack, Konventionen, Sprint-Status — wird automatisch geladen |
| `design-audit.md` | Screens-Inventar, Design Tokens, Komponenten-Mapping, Routing-Struktur |
| `decisions.md` | Alle 5 Architekturentscheidungen mit Begründung (alle abgeschlossen) |
| `backlog.md` | 47 Tickets in 5 Schichten (AT/MO/OR/TM/SC) mit Figma-Refs |
| `sprint-12.md` | Sprint 12 — abgeschlossen (4 Tickets: RP-01, OR-01, RZ-02, ER-02) |
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
