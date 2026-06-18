# Design Audit — Routenzüge

Figma-Datei: `6iHSHiZwZ7ouNQ3KVUy6OK`
Auditiert: 2026-06-18

---

## 1. Anwendungstyp

Industrielles **Logistik-Management-System** für Routenzüge (Tugger Trains / Milk Run) in Fertigungs- und Lagerumgebungen. Desktop-first (1920×1080 und 1440×1024).

---

## 2. Benutzerrollen & Screens-Matrix

| Rolle | Beschreibung | Screens |
|---|---|---|
| **Operator** | Hauptnutzer, steuert/überwacht Routenzüge | Karten-, Linien-, Auftrags-, Ereignisansicht, Routenzug-Detail, Einstellungen |
| **Schichtleitung (SL)** | Supervisor, sieht Ereignisse + Statistiken | Ereignisansicht SL, Statistiken, Ereignis-Detail |
| **Mitarbeiter (MA)** | Fahrer/Werker, sieht Aufträge + Anzeigetafel | Aufträge MA, Anzeigetafel |
| **Gast** | Readonly-Zugang | Statistiken |
| **Fertigung/Werkstatt** | Werksicht | Eigene Ansicht |

---

## 3. Screens-Inventar

### Core Screens (implementierungspflichtig)

| Screen-Name | Frame-ID | Rolle | Priorität |
|---|---|---|---|
| Login | `393:16920` | alle | P0 |
| Kartenansicht | `508:18941` | Operator | P0 |
| Kartenansicht mit Suche | `508:18664` | Operator | P0 |
| Linienansicht | `508:19223` | Operator | P0 |
| Aufträge | `506:17806` | Operator | P0 |
| Aufträge Detail - Lieferung | `506:17953` | Operator | P1 |
| Aufträge Detail - Mitarbeitertransport | `506:18036` | Operator | P1 |
| Ereignisansicht | `501:17241` | Operator | P0 |
| Ereignisansicht mit Filter | `516:19538` | Operator | P1 |
| Aufträge mit Filterdialog | `514:22132` | Operator | P1 |
| Ereignis-Detail (Strecke blockiert) | `504:17602` | Operator | P1 |
| Routenzug-Detail 1 | `509:19875` | Operator | P0 |
| Routenzug-Detail 2 | `509:19650` | Operator | P1 |
| Routenzug-Detail 3 | `516:20172` | Operator | P1 |
| Routenzug-Detail - Strecke blockiert | `92:737` | Operator | P1 |
| Routenzug-Detail - abschließen | `510:20873` | Operator | P1 |
| Einstellungen | `510:21086` | Operator | P2 |
| Einstellungen (Dark Mode) | `510:21530` | Operator | P2 |
| Ereignisansicht SL | `512:17380` | Schichtleitung | P1 |
| Ereignis-Detail SL | `512:18527` | Schichtleitung | P1 |
| Statistiken | `512:19782` | Schichtleitung | P1 |
| Aufträge MA | `512:20406` | Mitarbeiter | P1 |
| Aufträge Detail MA | `513:21099` | Mitarbeiter | P1 |
| Anzeigetafel | `484:16547` | Mitarbeiter | P2 |
| Gast-Statistiken | `513:21421` | Gast | P2 |

### Szenario-Screens (Flows/States)

| Screen-Name | Frame-ID | Szenario |
|---|---|---|
| Routenzug-Detail - Strecke blockiert manuell | `162:1928` | Störungsfall manuell |
| Routenzug-Detail - Fahrspur vorgegeben | `197:2155` | Umleitung |
| Routenzug-Detail - Kommunikation | `516:37870–37996` | Kommunikation (4 States) |
| Ereignis-Detail - replay | `512:19148` | Ereignis nachspielen |
| Ereignis-Detail - abgeschlossen | `512:18166` | Archiv |

---

## 4. Design-System

### Farben

| Token-Name | Wert | Verwendung |
|---|---|---|
| `white` | `#FFFFFF` | Hintergründe, Karten |
| `gray-light` | `#F5F5F5` | Seitenhintergrund (Linienansicht) |
| `gray-bg` | `#E4E8E4` | Kartenansicht-Hintergrund |
| `gray-mid` | `#BCBCBC` | Section-Fills |
| `gray-border` | `#DBDBDB` | Trennlinien, Rahmen |
| `gray-muted` | `#9A9EA0` | Horizontale Linien |
| `gray-dark` | `#A8A8A8` | Linien-Section |
| `black` | `#000000` | Primärtext |
| `dark-surface` | `#2A2F3B` | Dark Mode Hintergrund |
| `blue-primary` | `#146AA1` | Akzentfarbe, Icons, aktive Elemente |
| `overlay` | `rgba(0,0,0,0.1)` | Section-Overlays |
| `filter-badge-bg` | `#E5E5E5` | Filter-Badge |

### Typografie

| Token-Name | Font | Weight | Size | Verwendung |
|---|---|---|---|---|
| `h1` | Inter | Bold 700 | 42px | Seitentitel (z.B. "Ereignisse") |
| `h4` | Inter | SemiBold 600 | 15px | Listen-/Abschnittsüberschriften |
| `paragraph` | Inter | Medium 500 | 15px | Fließtext, Labels |

### Spacing & Layout

- **Desktop-Canvas:** 1920×1080px
- **Wireframe-Canvas:** 1440×1024px
- **Sidebar-Breite:** 266px
- **Sidebar Karte (kompakt):** 92px
- **Suchleiste:** 353×32px

---

## 5. Komponenten-Bibliothek (Figma → shadcn/ui Mapping)

| Figma-Komponente | Component-Set-ID | shadcn/ui Basis | Eigene Wrapper-Komponente |
|---|---|---|---|
| **Sidebar** | `59:534` | — | `components/layout/Sidebar.tsx` |
| **Eingabeleiste** (Suche) | `78:518` | `<Input>` | `components/ui-custom/SearchBar.tsx` |
| **Tab** (aktiv/inaktiv) | `74:570` | `<Tabs>` | — (shadcn direkt) |
| **Buttons secondary** | `74:518` | `<Button variant="outline">` | — |
| **Filter-Badge** | `88:920` | `<Badge>` | `components/ui-custom/FilterBadge.tsx` |
| **Listenüberschrift** | `65:489` | — | `components/ui-custom/ListHeader.tsx` |
| **Fahrtmodus** | `179:2498` | `<Badge>` / `<Card>` | `components/features/FahrtmodusCard.tsx` |
| **Sidebar Karte** | `104:2186` | — | `components/layout/SidebarKarte.tsx` |
| **ereignisbea titelleiste** | `516:26010` | — | `components/features/EreignisTitelleiste.tsx` |

### Fahrtmodus-Varianten (wichtig für Logik)

| Variante | Figma-ID | Bedeutung |
|---|---|---|
| `modus=manuell, eingabe notw=false` | `179:2497` | Manuelle Steuerung, kein Input nötig |
| `modus=autom, eingabe notw=true` | `179:2514` | Automatik, Input erforderlich |
| `modus=autom nicht mög, eingabe notw=true` | `379:7041` | Automatik nicht möglich |
| `modus=wd mögl, eingabe notw=false` | `377:8310` | Wiederherstellung möglich |

---

## 6. Routing-Struktur (Next.js App Router)

```
app/
  (auth)/
    login/
      page.tsx                    → Login #393:16920

  (operator)/
    layout.tsx                    → Shell mit Sidebar
    karte/
      page.tsx                    → Kartenansicht #508:18941
    linien/
      page.tsx                    → Linienansicht #508:19223
    auftraege/
      page.tsx                    → Aufträge #506:17806
      [id]/
        page.tsx                  → Auftrags-Detail
    ereignisse/
      page.tsx                    → Ereignisansicht #501:17241
      [id]/
        page.tsx                  → Ereignis-Detail
    routenzug/
      [id]/
        page.tsx                  → Routenzug-Detail #509:19875
    einstellungen/
      page.tsx                    → Einstellungen #510:21086

  (schichtleitung)/
    layout.tsx
    ereignisse/
      page.tsx                    → Ereignisansicht SL #512:17380
      [id]/
        page.tsx
    statistiken/
      page.tsx                    → Statistiken #512:19782

  (mitarbeiter)/
    layout.tsx
    auftraege/
      page.tsx                    → Aufträge MA #512:20406
      [id]/
        page.tsx
    anzeigetafel/
      page.tsx                    → Anzeigetafel #484:16547

  (gast)/
    statistiken/
      page.tsx                    → Gast-Statistiken #513:21421
```

---

## 7. Hauptflows

### Flow 1: Operator — Kartenansicht → Routenzug-Detail
1. Kartenansicht (`/karte`) — Übersicht aller aktiven Routenzüge auf Fabrikkarte
2. Suche (`/karte?search=…`) — Eingabeleiste aktivieren
3. Routenzug-Detail (`/routenzug/[id]`) — Tab 1, 2, 3 und Kommunikation
4. Strecke blockiert → Detail mit Fahrtmodus-Auswahl

### Flow 2: Operator — Ereignisbearbeitung
1. Ereignisansicht (`/ereignisse`) — Liste mit Filter/Tab
2. Filter-Dialog → gefilterte Ansicht
3. Ereignis-Detail (`/ereignisse/[id]`) — Strecke blockiert, Replay, Abschluss

### Flow 3: Schichtleitung — Ereignisse überwachen
1. Ereignisansicht SL → Ereignis-Detail → Statistiken

### Flow 4: Mitarbeiter — Aufträge
1. Aufträge MA → Auftrags-Detail (Lieferung / Transport) → Anzeigetafel

---

## 8. Offene Fragen für Implementierung

- [ ] Echtzeitdaten: WebSocket oder Polling für Kartenpositionen?
- [ ] Dark Mode: Nur Einstellungs-Screen oder systemweit?
- [ ] Authentifizierung: Rollenbasierte Weiterleitung nach Login?
- [ ] Kartenkomponente: Leaflet, Mapbox oder eigenes SVG-Canvas?
- [ ] Fahrtmodus-Logik: Statusmaschine oder einfache State-Variable?
