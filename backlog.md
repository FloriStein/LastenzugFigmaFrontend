# Komponentenbacklog — Routenzüge

## Strategie

**Prinzip:** Bottom-Up nach Atomic Design. Figma Component Sets bilden die exakten Komponentengrenzen.
Jede Schicht wird vollständig abgeschlossen, bevor die nächste beginnt.

**Schnittregeln:**
1. Jeder Figma Component Set → genau eine React-Komponente mit Varianten über Props
2. Figma-Instances innerhalb eines Screens → Import der Komponente aus ihrer Schicht
3. Reine Layout-Wrapper (Sidebar + Main) → Templates, keine Features
4. Screens werden erst implementiert wenn alle enthaltenen Organismen existieren

**Schichten:**
```
Layer 1 — Atoms       (Figma Component Sets, keine Sub-Komponenten)
Layer 2 — Molecules   (aus Atoms zusammengesetzt, eigene Logik)
Layer 3 — Organisms   (Feature-Einheiten, enthalten Molecules)
Layer 4 — Templates   (Screen-Shells, nur Layout)
Layer 5 — Screens     (Pages, füllen Templates mit Organismen)
```

---

## Layer 1 — Atoms

Direkte Umsetzung von Figma Component Sets. Nur shadcn als Basis, keine eigene Logik.

### AT-01 — PrioritätBadge
- **Figma:** Component Set `#43:238`
- **Varianten:** `prio=1` (blau) | `prio=2` | `prio=3` | `prio=4` (höchste)
- **Datei:** `src/components/ui-custom/PrioritätBadge.tsx`
- **shadcn-Basis:** keine (reine SVG-Icons aus Figma)
- **Priorität:** P0
- **Deps:** —

### AT-02 — StatusBadge
- **Figma:** Component Set `#65:535`
- **Varianten:** `fahrt-unterbrochen` (#C55141) | `lädt` (#2D5D7B) | `fährt-automatisiert` (#51A135)
- **Datei:** `src/components/ui-custom/StatusBadge.tsx`
- **shadcn-Basis:** `<Badge>`
- **Priorität:** P0
- **Deps:** —

### AT-03 — FilterBadge
- **Figma:** Component Set `#88:920`
- **Varianten:** `auto-width`
- **Props:** `label: string`, `onRemove?: () => void`
- **Datei:** `src/components/ui-custom/FilterBadge.tsx` *(Skeleton existiert, ausfüllen)*
- **shadcn-Basis:** `<Badge>`
- **Priorität:** P1
- **Deps:** —

### AT-04 — Tab
- **Figma:** Component Set `#74:570`
- **Varianten:** `active=true` | `active=false`
- **Props:** `label: string`, `count?: number`, `active: boolean`, `onClick: () => void`
- **Datei:** wrappen via shadcn `<Tabs>` direkt — kein eigener Wrapper nötig
- **Priorität:** P0
- **Deps:** —

### AT-05 — ListHeader
- **Figma:** Component Set `#65:489`
- **Varianten:** `sort=Default`
- **Props:** `title: string`
- **Datei:** `src/components/ui-custom/ListHeader.tsx` *(Skeleton existiert, ausfüllen)*
- **shadcn-Basis:** —
- **Priorität:** P0
- **Deps:** —

### AT-06 — SecondaryButton
- **Figma:** Component Set `#74:518`
- **Varianten:** `neu` | `ansicht speichern` | generisch
- **Props:** `label: string`, `icon?: ReactNode`, `variant?: "default" | "ghost"`
- **Datei:** wrappen via shadcn `<Button variant="outline">` — kein eigener Wrapper
- **Priorität:** P1
- **Deps:** —

### AT-07 — Beschleunigungsanzeige
- **Figma:** Component Set `#165:1657`
- **Beschreibung:** Vertikale Balkenanzeige für G-Kraft/Beschleunigung (6 Segmente)
- **Props:** `value: number` (0–6)
- **Datei:** `src/components/ui-custom/Beschleunigungsanzeige.tsx`
- **Priorität:** P1
- **Deps:** —

### AT-08 — KarteIcon
- **Figma:** Component Set `#118:1198`
- **Varianten:** `routenzug` | `rsu` | `kamera` | `routenzug-problem` | `Variant8`
- **Beschreibung:** Map-Marker-Icons für Leaflet-Karte (als SVG oder DivIcon)
- **Datei:** `src/components/features/KarteIcon.tsx`
- **Priorität:** P0
- **Deps:** `react-leaflet` installiert

### AT-09 — PrioritätIcon (Connection)
- **Figma:** Component Set `#123:992`
- **Beschreibung:** Verbindungsqualitäts-Icon im Kamera-HUD
- **Datei:** `src/components/ui-custom/ConnectionIcon.tsx`
- **Priorität:** P1
- **Deps:** —

---

## Layer 2 — Molecules

Kombinieren Atoms, haben eigene Props/State, keine Figma Component Sets.

### MO-01 — SearchBar
- **Figma:** Component Set `#78:518` (`type=search`)
- **Props:** `value: string`, `onChange: (v: string) => void`, `placeholder?: string`
- **Datei:** `src/components/ui-custom/SearchBar.tsx` *(Skeleton existiert, ausfüllen)*
- **Priorität:** P0
- **Deps:** AT-06 (SecondaryButton als Clear-Action)

### MO-02 — NavItem
- **Figma:** Component Sets `#58:398` (Ereignisse) | `#58:408` (Lieferungen) | `#58:429` (Einstellungen)
- **Props:** `label: string`, `icon: ReactNode`, `href: string`, `active?: boolean`, `subItems?: { label: string; href: string }[]`
- **Datei:** `src/components/layout/NavItem.tsx`
- **Priorität:** P0
- **Deps:** —

### MO-03 — UserCard
- **Figma:** Kein eigenes Component Set — in Sidebar eingebettet (`#502:17497`)
- **Props:** `name: string`, `avatarUrl?: string`, `onLogout: () => void`
- **Datei:** `src/components/layout/UserCard.tsx`
- **Priorität:** P0
- **Deps:** AT-06 (SecondaryButton für Abmelden)

### MO-04 — EreignisListRow
- **Figma:** Kein Component Set — `EL-80d30c45` Template, in `#501:17243` verwendet
- **Props:** `id: string`, `art: string`, `fahrzeug: string`, `status: EreignisStatus`, `bearbeiter?: string`, `priorität: 1|2|3|4`, `erstelltAt: Date`
- **Datei:** `src/components/features/EreignisListRow.tsx`
- **Priorität:** P0
- **Deps:** AT-01 (PrioritätBadge)

### MO-05 — RoutenzugCard
- **Figma:** Kein Component Set — `EL-b89c9661` / `EL-53e33e25` in Kartenansicht Panel `#508:19036`
- **Props:** `name: string`, `aufträge: string[]`, `status: FahrtStatus`, `onClick: () => void`
- **Datei:** `src/components/features/RoutenzugCard.tsx`
- **Priorität:** P0
- **Deps:** AT-02 (StatusBadge)

### MO-06 — AuftragListRow
- **Figma:** Anlehnung an Aufträge-Screen `#506:17806`
- **Props:** `id: string`, `typ: "Lieferung" | "Mitarbeitertransport"`, `von: string`, `nach: string`, `priorität: 1|2|3|4`, `status: AuftragStatus`
- **Datei:** `src/components/features/AuftragListRow.tsx`
- **Priorität:** P0
- **Deps:** AT-01 (PrioritätBadge)

### MO-07 — AuftragListItemKurz
- **Figma:** `#509:20782` "Auftrag Listeneintrag kurz" in Routenzug-Detail
- **Props:** `id: string`, `typ: string`, `priorität: 1|2|3|4`
- **Datei:** `src/components/features/AuftragListItemKurz.tsx`
- **Priorität:** P1
- **Deps:** AT-01 (PrioritätBadge)

### MO-08 — FahrzeugAktionCard
- **Figma:** `#509:20867` / `#509:20859` "Fahrzeug-Aktionen" in Routenzug-Detail
- **Props:** `label: string`, `icon: ReactNode`, `variant: "danger" | "warning"`, `onClick: () => void`
- **Datei:** `src/components/features/FahrzeugAktionCard.tsx`
- **Priorität:** P1
- **Deps:** —

---

## Layer 3 — Organisms

Feature-Einheiten, die eigenständige Bildschirmbereiche abbilden.

### OR-01 — Sidebar
- **Figma:** Component Set `#59:534` (4 Varianten: Property 1=Variant4 etc.)
- **Props:** `role: Role`, `activeRoute: string`
- **Datei:** `src/components/layout/Sidebar.tsx` *(Skeleton existiert, ausfüllen)*
- **Beschreibung:** Volle Sidebar (266px, dunkel #2A2F3B) mit UserCard + NavItems + Logout
- **Priorität:** P0
- **Deps:** MO-02 (NavItem), MO-03 (UserCard)

### OR-02 — SidebarKarte
- **Figma:** Component Set `#104:2186`
- **Props:** `activeItem?: string`
- **Datei:** `src/components/layout/SidebarKarte.tsx` *(Skeleton existiert, ausfüllen)*
- **Beschreibung:** Kompakt-Sidebar (92px) für Kartenansicht, nur Icons
- **Priorität:** P0
- **Deps:** —

### OR-03 — EreignisTitelleiste
- **Figma:** Component Set `#516:26010` / `#361:5564` (mit Buttons + Connection-Status)
- **Props:** `title: string`, `connectionStatus: "connected" | "disconnected"`, `onAbschließen?: () => void`, `onTrennen?: () => void`
- **Datei:** `src/components/features/EreignisTitelleiste.tsx` *(Skeleton existiert, ausfüllen)*
- **Beschreibung:** Blauer Header-Bar (1920×148px) mit Routenzug-Name, Aktions-Buttons
- **Priorität:** P0
- **Deps:** AT-09 (ConnectionIcon)

### OR-04 — FahrtmodusCard
- **Figma:** Component Set `#179:2498` (4 Varianten)
- **Varianten:** `manuell` | `autom-eingabe` | `autom-nicht-moeglich` | `wiederherstellung`
- **Datei:** `src/components/features/FahrtmodusCard.tsx` *(Skeleton existiert, ausfüllen)*
- **State:** via `useReducer` + Union Types (Entscheidung #5)
- **Priorität:** P1
- **Deps:** —

### OR-05 — KameraPanel
- **Figma:** `#509:19876` / `#509:19885` in Routenzug-Detail-1
- **Props:** `frontImageUrl: string`, `sideImageUrl?: string`, `speedKmh: number`, `acceleration: number`
- **Datei:** `src/components/features/KameraPanel.tsx`
- **Beschreibung:** Kamera-Feed (Vorne + Seite), Speed-HUD, Beschleunigungsanzeige, Hindernis-Markierung
- **Priorität:** P1
- **Deps:** AT-07 (Beschleunigungsanzeige), AT-09 (ConnectionIcon)

### OR-06 — FahrtInfoPanel
- **Figma:** `#509:20742` "fahrz+status" in Routenzug-Detail-1
- **Props:** `fahrtStatus: FahrtStatus`, `aktuellerAuftrag?: Auftrag`, `anhänger?: Auftrag[]`
- **Datei:** `src/components/features/FahrtInfoPanel.tsx`
- **Beschreibung:** Tab-Bereich mit Fahrzeuginformationen / Betriebsstatus, Fahrtstatus-Badge, Auftrag-Referenz
- **Priorität:** P1
- **Deps:** AT-02 (StatusBadge), MO-07 (AuftragListItemKurz), AT-04 (Tab)

### OR-07 — AktionenPanel
- **Figma:** `#509:20808` "aktionen+komm" in Routenzug-Detail-1
- **Props:** `activeTab: "fahrt" | "fahrzeug" | "kommunikation"`, `fahrtmodus: FahrtmodusVariant`
- **Datei:** `src/components/features/AktionenPanel.tsx`
- **Beschreibung:** Tab-Wechsler (Fahrt | Fahrzeug | Kommunikation) + FahrtmodusCard + FahrzeugAktionen
- **Priorität:** P1
- **Deps:** OR-04 (FahrtmodusCard), MO-08 (FahrzeugAktionCard), AT-04 (Tab)

### OR-08 — EreignisListView
- **Figma:** `#501:17243` + Toolbar in Ereignisansicht
- **Props:** `ereignisse: Ereignis[]`, `filters: Filter[]`, `onFilterChange: ...`
- **Datei:** `src/components/features/EreignisListView.tsx`
- **Beschreibung:** Searchbar + Tabs + ColumnHeaders + Liste von EreignisListRows
- **Priorität:** P0
- **Deps:** MO-01 (SearchBar), AT-04 (Tab), AT-05 (ListHeader), MO-04 (EreignisListRow)

### OR-09 — RoutenzugListPanel
- **Figma:** `#508:19030` (dunkles Panel 505px) in Kartenansicht
- **Props:** `routenzüge: Routenzug[]`, `onSelect: (id: string) => void`
- **Datei:** `src/components/features/RoutenzugListPanel.tsx`
- **Beschreibung:** Sliding Panel links mit Liste von RoutenzugCards
- **Priorität:** P0
- **Deps:** MO-05 (RoutenzugCard)

### OR-10 — MapCanvas
- **Figma:** Hintergrundebenen in Kartenansicht (`#508:18942` bis `#508:18993`)
- **Props:** `routenzüge: RoutenzugPosition[]`, `onSelect: (id: string) => void`
- **Datei:** `src/components/features/MapCanvas.tsx`
- **Beschreibung:** Leaflet-Karte mit CRS.Simple (Entscheidung #1), SVG-Layer für Gelände/Straßen/Gebäude, Map-Marker via KarteIcon
- **Priorität:** P0
- **Deps:** AT-08 (KarteIcon), `react-leaflet`

### OR-11 — AuftragListView
- **Figma:** Aufträge-Screen `#506:17806`
- **Props:** `aufträge: Auftrag[]`, `filters: Filter[]`
- **Datei:** `src/components/features/AuftragListView.tsx`
- **Priorität:** P1
- **Deps:** MO-01 (SearchBar), AT-04 (Tab), AT-05 (ListHeader), MO-06 (AuftragListRow)

---

## Layer 4 — Templates

Reine Layout-Shells ohne eigene Business-Logik.

### TM-01 — OperatorShell
- **Datei:** `src/app/(operator)/layout.tsx` *(existiert, Sidebar einbinden)*
- **Beschreibung:** Sidebar (266px) + flex-1 main — für alle Operator-Screens außer Karte
- **Priorität:** P0
- **Deps:** OR-01 (Sidebar)

### TM-02 — KarteShell
- **Datei:** `src/components/layout/KarteShell.tsx`
- **Beschreibung:** SidebarKarte (92px) + full-bleed Map — kein Scroll, height: 100vh
- **Priorität:** P0
- **Deps:** OR-02 (SidebarKarte)

### TM-03 — RoutenzugDetailShell
- **Datei:** `src/components/layout/RoutenzugDetailShell.tsx`
- **Beschreibung:** EreignisTitelleiste (148px) + Grid: [KameraPanel + FahrtInfoPanel + AktionenPanel]
- **Priorität:** P1
- **Deps:** OR-03 (EreignisTitelleiste)

### TM-04 — DetailShell (generisch)
- **Datei:** `src/components/layout/DetailShell.tsx`
- **Beschreibung:** Sidebar + Zurück-Button + Detail-Content — für Ereignis-Detail, Auftrags-Detail
- **Priorität:** P1
- **Deps:** OR-01 (Sidebar)

---

## Layer 5 — Screens (Pages)

Screens werden erst gestartet wenn alle Deps aus Layer 3/4 abgehakt sind.

### SC-01 — Login
- **Figma:** `#393:16920`
- **Datei:** `src/app/(auth)/login/page.tsx`
- **Priorität:** P0
- **Deps:** AT-06 (Button), MO-01 (Input)

### SC-02 — Kartenansicht
- **Figma:** `#508:18941`
- **Datei:** `src/app/(operator)/karte/page.tsx`
- **Priorität:** P0
- **Deps:** TM-02, OR-09, OR-10, MO-01 (Search)

### SC-03 — Ereignisansicht
- **Figma:** `#501:17241`
- **Datei:** `src/app/(operator)/ereignisse/page.tsx`
- **Priorität:** P0
- **Deps:** TM-01, OR-08

### SC-04 — Aufträge
- **Figma:** `#506:17806`
- **Datei:** `src/app/(operator)/auftraege/page.tsx`
- **Priorität:** P0
- **Deps:** TM-01, OR-11

### SC-05 — Routenzug-Detail
- **Figma:** `#509:19875`
- **Datei:** `src/app/(operator)/routenzug/[id]/page.tsx`
- **Priorität:** P0
- **Deps:** TM-03, OR-05, OR-06, OR-07

### SC-06 — Linienansicht
- **Figma:** `#508:19223`
- **Datei:** `src/app/(operator)/linien/page.tsx`
- **Priorität:** P0
- **Deps:** TM-01 (Sidebar)

### SC-07 — Ereignis-Detail (Strecke blockiert)
- **Figma:** `#504:17602`
- **Datei:** `src/app/(operator)/ereignisse/[id]/page.tsx`
- **Priorität:** P1
- **Deps:** TM-04, OR-03, OR-04

### SC-08 — Auftrags-Detail Lieferung
- **Figma:** `#506:17953`
- **Datei:** `src/app/(operator)/auftraege/[id]/page.tsx`
- **Priorität:** P1
- **Deps:** TM-04

### SC-09 — Auftrags-Detail Mitarbeitertransport
- **Figma:** `#506:18036`
- **Datei:** `src/app/(operator)/auftraege/[id]/page.tsx` *(selbe Route, Typ-Unterscheidung)*
- **Priorität:** P1
- **Deps:** TM-04

### SC-10 — Einstellungen
- **Figma:** `#510:21086` / `#510:21530` (Dark Mode)
- **Datei:** `src/app/(operator)/einstellungen/page.tsx`
- **Priorität:** P2
- **Deps:** TM-01, next-themes Toggle

### SC-11 — Ereignisansicht SL
- **Figma:** `#512:17380`
- **Datei:** `src/app/(schichtleitung)/ereignisse/page.tsx`
- **Priorität:** P1
- **Deps:** TM-01, OR-08

### SC-12 — Statistiken SL
- **Figma:** `#512:19782`
- **Datei:** `src/app/(schichtleitung)/statistiken/page.tsx`
- **Priorität:** P1
- **Deps:** TM-01

### SC-13 — Aufträge MA
- **Figma:** `#512:20406`
- **Datei:** `src/app/(mitarbeiter)/auftraege/page.tsx`
- **Priorität:** P1
- **Deps:** TM-01, OR-11

### SC-14 — Anzeigetafel
- **Figma:** `#484:16547`
- **Datei:** `src/app/(mitarbeiter)/anzeigetafel/page.tsx`
- **Priorität:** P2
- **Deps:** —

### SC-15 — Gast-Statistiken
- **Figma:** `#513:21421`
- **Datei:** `src/app/(gast)/statistiken/page.tsx`
- **Priorität:** P2
- **Deps:** TM-01

---

## Zusammenfassung

| Schicht | Anzahl Items | P0 | P1 | P2 |
|---|---|---|---|---|
| Layer 1 — Atoms | 9 | 4 | 5 | 0 |
| Layer 2 — Molecules | 8 | 5 | 3 | 0 |
| Layer 3 — Organisms | 11 | 5 | 6 | 0 |
| Layer 4 — Templates | 4 | 2 | 2 | 0 |
| Layer 5 — Screens | 15 | 6 | 7 | 2 |
| **Total** | **47** | **22** | **23** | **2** |

**Empfohlene Implementierungsreihenfolge (Sprints):**
1. AT-01 bis AT-05 + MO-01 bis MO-03 (Atoms + Nav)
2. OR-01 + OR-02 + TM-01 + TM-02 (Sidebars + Shells)
3. OR-08 bis OR-10 (List Views + Map)
4. SC-02 bis SC-04 + SC-06 (P0 Screens)
5. OR-03 bis OR-07 + TM-03/TM-04 (Detail-Komponenten)
6. SC-05 + SC-07 bis SC-09 (Detail-Screens)
7. P1 Rollen-Screens (SL, MA)
8. P2 + Polish (Dark Mode, A11y, Responsive)
