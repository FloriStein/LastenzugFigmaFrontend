# Entscheidungs-Log — Routenzüge

Alle wichtigen Architektur- und Design-Entscheidungen des Projekts.
Neue Einträge werden per `/grill-me` Sitzung erarbeitet und hier dokumentiert.

Format:
- **Kontext:** Warum musste diese Entscheidung getroffen werden?
- **Entscheidung:** Was wurde beschlossen?
- **Begründung:** Warum diese Option?
- **Konsequenzen:** Was folgt daraus?

---

## Offene Entscheidungen

| # | Thema | Priorität |
|---|---|---|
| ~~1~~ | ~~Kartenkomponente (Leaflet vs. Mapbox vs. SVG-Canvas)~~ | ✅ entschieden |
| ~~2~~ | ~~Authentifizierung & Rollenweiterleitung nach Login~~ | ✅ entschieden |
| ~~3~~ | ~~Echtzeit-Strategie (WebSocket vs. Polling)~~ | ✅ entschieden |
| ~~4~~ | ~~Dark Mode Scope (nur Settings-Screen oder systemweit)~~ | ✅ entschieden |
| ~~5~~ | ~~Fahrtmodus-Statusmaschine (XState vs. useState)~~ | ✅ entschieden |

---

## Entschiedene Punkte

### ✅ 5 — Fahrtmodus-Statusmaschine
**Datum:** 2026-06-18

**Kontext:** Fahrtmodus hat 4 Zustände (manuell, autom, autom nicht möglich, Wiederherstellung möglich). Übergangsregeln noch nicht vollständig spezifiziert. Modusänderung hat sowohl UI- als auch Aktions-Effekte (API-Calls, andere Komponenten). XState ist Neuland.

**Entscheidung:** `useReducer` mit TypeScript-Union-Types — kein XState

**Begründung:**
- XState: zu früh (Übergänge unspezifiziert) + Lernkurve für Neuland nicht gerechtfertigt
- `useState`: zu lose für Zustände mit Seiteneffekten
- `useReducer`: gibt Struktur einer State Machine (explizite Actions, typisierte Zustände) ohne Dependency
- Migrationspfad zu XState bleibt offen — Reducer-Logik lässt sich direkt übertragen

**Konsequenzen:**
- Kein XState im Projekt
- `useFahrtmodus()` Custom Hook mit `useReducer`
- Zustände als TypeScript Union: `type FahrtmodusState = 'manuell' | 'automatisch' | 'autom_nicht_moeglich' | 'wiederherstellung'`
- Actions: `SET_MODUS`, `SYSTEM_OVERRIDE`, `RESTORE` — werden ergänzt wenn Übergangsregeln klar sind
- Seiteneffekte (API-Calls) in `useEffect` als Reaktion auf State-Änderungen

---

### ✅ 4 — Dark Mode Scope
**Datum:** 2026-06-18

**Kontext:** Figma enthält einen Dark-Mode-Screen für Einstellungen. Operatoren arbeiten auch in dunklen Umgebungen (Nachtschicht). Dark Mode soll für alle Rollen gelten, manuell in den Einstellungen schaltbar, pro Gerät gespeichert.

**Entscheidung:** `next-themes` + Tailwind `darkMode: 'class'` — systemweit für alle Rollen

**Begründung:**
- `next-themes` ist die shadcn/ui-empfohlene Lösung — kein Custom-Code nötig
- Speichert Theme automatisch in `localStorage` (per Gerät)
- Verhindert Flash of unstyled content (FOUC) beim Laden via Script-Injection
- Toggle im Settings-Screen via `useTheme()` Hook — ein Einzeiler
- Tailwind `dark:` Klassen übernehmen das gesamte Styling

**Konsequenzen:**
- Dependency: `next-themes` ins Projekt
- `ThemeProvider` wraps das Root-Layout
- Tailwind-Config: `darkMode: 'class'` setzen
- Alle Komponenten mit `dark:` Varianten stylen (kann inkrementell gemacht werden)
- Dark-Color-Tokens aus Figma (`#2A2F3B` als Surface) in `globals.css` als CSS-Variable

---

### ✅ 3 — Echtzeit-Strategie
**Datum:** 2026-06-18

**Kontext:** Fahrzeugpositionen sollen flüssig (< 1s Delay) auf der Karte aktualisiert werden. App ist reiner Viewer (keine bidirektionale Kommunikation). Unter 20 gleichzeitige Nutzer. Backend wird zunächst gemockt — Priorität liegt auf Design/Workflow-Umsetzung.

**Entscheidung:** SSE (Server-Sent Events) als Zielarchitektur — Mock-Polling während Entwicklung

**Begründung:**
- Nur Server→Client: WebSockets wären Overkill (bidirektionales Protokoll für One-Way-Daten)
- SSE ist nativ im Browser, läuft über HTTP/1.1+, kein extra Protokoll-Overhead
- Mock-Phase: `setInterval` + statische Testdaten simulieren Bewegung
- Umstieg Mock → SSE: nur den Daten-Provider tauschen, Karten-Komponente bleibt unverändert

**Konsequenzen:**
- Mock-Service in `lib/mock/vehicles.ts` — gibt simulierte Positionen zurück
- Produktiv: `useVehicleStream()` Hook nutzt `EventSource` auf SSE-Endpoint
- Hook-Interface bleibt gleich (Mock und Produktion austauschbar via Env-Variable)
- Backend muss später `GET /stream/vehicles` als SSE-Endpoint bereitstellen

---

### ✅ 2 — Authentifizierung & Rollenweiterleitung
**Datum:** 2026-06-18

**Kontext:** 4 Benutzerrollen (Operator, Schichtleitung, Mitarbeiter, Gast), individuelle Accounts, separate Backend-API, persistente Session gewünscht.

**Entscheidung:** JWT + Next.js `middleware.ts` — kein Auth-Framework (kein NextAuth.js)

**Begründung:**
- Backend übernimmt Login-Validierung und gibt JWT zurück → Next.js ist nur Konsument
- JWT wird in `httpOnly` Cookie gespeichert (sicher, persistent, kein JS-Zugriff)
- `middleware.ts` liest Rolle aus JWT → redirectet nach Login auf rollenspezifische Startseite
- NextAuth.js wäre Overkill: designed für Next.js als Auth-Backend, nicht als Frontend

**Konsequenzen:**
- Kein Auth-Framework als Dependency
- Backend-API muss `POST /auth/login` → `{ token, role }` liefern
- `middleware.ts` im Projekt-Root schützt alle Routen und steuert Rollenweiterleitung
- Rollenstruktur: `operator → /karte`, `schichtleitung → /ereignisse`, `mitarbeiter → /auftraege`, `gast → /statistiken`
- Token-Refresh-Strategie muss mit Backend abgestimmt werden

---

### ✅ 1 — Kartenkomponente
**Datum:** 2026-06-18

**Kontext:** Die Kartenansicht zeigt Routenzug-Positionen auf einem Fabrikgelände. Es gibt keinen fertigen Grundriss — der muss noch als SVG erstellt werden. Routen sind weitgehend statisch. Live-Daten: nur Fahrzeugpositionen.

**Entscheidung:** `react-leaflet` mit `CRS.Simple`

**Begründung:**
- Kein Geobezug → Mapbox/OSM-Tiles unnötig und kostenpflichtig
- `CRS.Simple` ist Leaflets eingebauter Modus für nicht-geografische Karten (Fabrikpläne, Indoor-Maps)
- Fabrik-SVG als `imageOverlay`, Fahrzeuge als custom Marker, Routen als farbcodierte Polylines
- Zoom, Pan, Marker Out-of-the-Box — kein Custom-Canvas-Code nötig
- Kostenlos, große Community, gute React-Integration via `react-leaflet`

**Konsequenzen:**
- Abhängigkeit: `react-leaflet` + `leaflet` ins Projekt
- Fabrikgrundriss muss als SVG oder PNG bereitgestellt werden (Koordinatensystem festlegen)
- Fahrzeugpositionen kommen als `{x, y}` im lokalen Koordinatensystem, nicht als GPS
