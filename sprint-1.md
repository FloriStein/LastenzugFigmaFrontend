# Sprint 1 — Atoms & Nav-Molecules

**Session-Einstieg:** Lies dieses Dokument vollständig bevor du irgendwas tust.
Alle Figma-Specs sind bereits extrahiert — kein MCP-Aufruf nötig für diese Tickets.

---

## Kontext

Industrielles Logistik-Management für Routenzüge. Stack: Next.js 16, TypeScript strict,
Tailwind v4, shadcn/ui v4.11. Figma-Datei: `6iHSHiZwZ7ouNQ3KVUy6OK`.

Relevante Dokumente:
- `BRIEFING.md` — Gesamtüberblick, Architekturentscheidungen
- `backlog.md` — Alle 47 Tickets mit Schichten AT/MO/OR/TM/SC
- `design-audit.md` — Screens, Routing, ursprüngliche Token-Übersicht

Projektstruktur bereits vorhanden (`src/`), shadcn initialisiert, Design Tokens in
`src/app/globals.css` eingetragen. Skeleton-Dateien für die meisten Komponenten existieren
bereits — ausfüllen, nicht neu erstellen.

---

## Sprint-Scope (8 Tickets)

| ID | Name | Datei | Status |
|---|---|---|---|
| AT-01 | PrioritätBadge | `components/ui-custom/PrioritätBadge.tsx` | Neu |
| AT-02 | StatusBadge | `components/ui-custom/StatusBadge.tsx` | Neu |
| AT-03 | FilterBadge | `components/ui-custom/FilterBadge.tsx` | Skeleton vorhanden |
| AT-04 | Tab | via shadcn — kein eigener Wrapper | — |
| AT-05 | ListHeader | `components/ui-custom/ListHeader.tsx` | Skeleton vorhanden |
| MO-01 | SearchBar | `components/ui-custom/SearchBar.tsx` | Skeleton vorhanden |
| MO-02 | NavItem | `components/layout/NavItem.tsx` | Neu |
| MO-03 | UserCard | `components/layout/UserCard.tsx` | Neu |

**Implementierungsreihenfolge:** AT-01 → AT-02 → AT-03 → AT-05 → AT-04 (Config) →
MO-01 → MO-02 → MO-03

---

## Konventionen (nicht vergessen)

- Kein Default Export außer bei Next.js Page/Layout-Dateien
- Props-Interface direkt über der Komponente, kein `types/`-Verzeichnis
- shadcn-Komponenten nie direkt in `components/ui/` editieren
- Keine Kommentare außer wenn das Warum nicht offensichtlich ist
- `cn()` aus `@/lib/utils` für Klassen-Kombination nutzen

---

## AT-01 — PrioritätBadge

**Figma:** Component Set `#43:238` — 10 Varianten (5 dark + 5 blue)

### Visuell
4 Kreise nebeneinander (80×14px gesamt), je 14×14px, Abstand 22px.
Ausgefüllte Kreise = erreichte Priorität, Rahmen-Kreise = nicht erreicht.

| Variante | Kreise | Farbe |
|---|---|---|
| `prio=keine` / `prio=0b` | 0 gefüllt, 4 Rahmen | dark: #2A2F3B / blue: #146AA1 |
| `prio=1` / `prio=1b` | 1 gefüllt, 3 Rahmen | dark / blue |
| `prio=2` / `prio=2b` | 2 gefüllt, 2 Rahmen | dark / blue |
| `prio=3` / `prio=3b` | 3 gefüllt, 1 Rahmen | dark / blue |
| `prio=4` / `prio=4b` | 4 gefüllt, 0 Rahmen | dark / blue |

Dark-Variante (Standard): Farbe `#2A2F3B`
Blue-Variante (Hover/Auswahl): Farbe `#146AA1`

### Props-Interface
```ts
interface PrioritätBadgeProps {
  prio: 0 | 1 | 2 | 3 | 4;
  color?: "dark" | "blue";
}
```

### Implementierung
Reine SVG-Kreise, kein shadcn. Inline-SVG mit 4 `<circle>`-Elementen.
Gefüllter Kreis: `fill=color`, kein Stroke.
Rahmen-Kreis: `fill=none`, `stroke=color`, `strokeWidth=1`.

---

## AT-02 — StatusBadge

**Figma:** Component Set `#65:535` — 18 Varianten

Universell einsetzbar: Fahrt-Status, Ereignis-Status, Auftrag-Typ.
Alle Varianten: `border-radius: 4px`, Text: Inter Medium 500, 15px.

### Alle Varianten mit Farben

**Fahrt-Status (voller Hintergrund):**
| type | bg | text | label |
|---|---|---|---|
| `fahrt-unterbrochen` | `#C55141` | `#FFFFFF` | "Fahrt unterbrochen" |
| `autom-fahren-unterbrochen` | `#C55141` | `#FFFFFF` | "automatisiertes Fahren unterbrochen" |
| `fährt-automatisiert` | `#51A135` | `#FFFFFF` | "fährt automatisiert" |
| `lädt` | `#2D5D7B` | `#FFFFFF` | "lädt (x%)" — `percent?: number` |
| `pause` | `#DDB411` | `#FFFFFF` | "automatisierte Fahrt pausiert" |

**Ereignis/Auftrag-Status (50% opacity Hintergrund):**
| type | bg (50% opacity) | text | label |
|---|---|---|---|
| `aktiv` | `#51A135` | `#103C00` | "aktiv" |
| `offen` | `#51A135` | `#103C00` | "offen" |
| `frei` | `#51A135` | `#103C00` | "frei" |
| `in-bearbeitung` | `#9A9EA0` | `#2A2F3B` | "in Bearbeitung" |
| `geplant` | `#9A9EA0` | `#2A2F3B` | "geplant" |
| `abgeschlossen` | `#9A9EA0` | `#1F3848` | "abgeschlossen" |
| `warten` | `#9A9EA0` | `#2A2F3B` | "warten zur Erinnerung" |
| `belegt` | `#FFC609` | `#5E4306` | "belegt" |
| `unterbrochen-gelb` | `#FFC609` | `#5E4306` | "unterbrochen" |
| `fehlermeldung` | `#C55141` | `#FFFFFF` | "Fehlermeldung" |

**Auftrag-Typ (50% opacity, Icon vorhanden):**
| type | bg (50% opacity) | text | label |
|---|---|---|---|
| `lieferung` | `#146AA1` | `#1F3848` | "Lieferung" |
| `mitarbeitertransport` | `#146AA1` | `#1F3848` | "Mitarbeitertransport" |
| `auftrag-abgeschlossen` | `#146AA1` | `#1F3848` | "abgeschlossen" |

### Props-Interface
```ts
type StatusBadgeType =
  | "fahrt-unterbrochen"
  | "autom-fahren-unterbrochen"
  | "fährt-automatisiert"
  | "lädt"
  | "pause"
  | "aktiv"
  | "offen"
  | "frei"
  | "in-bearbeitung"
  | "geplant"
  | "abgeschlossen"
  | "warten"
  | "belegt"
  | "unterbrochen-gelb"
  | "fehlermeldung"
  | "lieferung"
  | "mitarbeitertransport"
  | "auftrag-abgeschlossen";

interface StatusBadgeProps {
  type: StatusBadgeType;
  percent?: number;  // nur für "lädt"
}
```

### Implementierung
Keine shadcn-Basis nötig — simples `<span>` mit Tailwind-Klassen.
Für 50%-opacity-Hintergrund: `bg-[#51A135]/50` (Tailwind v4 Syntax).
Label wird aus `type` ermittelt — keine `label`-Prop nötig.

---

## AT-03 — FilterBadge

**Figma:** Component Set `#88:920` — 3 Varianten
**Datei:** `src/components/ui-custom/FilterBadge.tsx` (Skeleton ausfüllen)

### Visuell
Höhe: 27px, border-radius: 4px
Struktur: [Filter-Icon 14×14px] [**Header:** bold 15px] [text: medium 15px] [Chevron ▾]
Padding auto-width: `4px 16px 4px 7px`

| Variante | bg | Verwendung |
|---|---|---|
| `default` (fixed 354px) | `#E5E5E5` | Ausklapp-Badge ohne Text-Overflow |
| `auto-width` | `#E5E5E5` | Standard in Filter-Toolbar |
| `selected` (Variant3) | `#CECECE` | Aktiv/ausgewählt |

Farben: bg `#E5E5E5`, Icon `#929292`, Text (Header+Label) `#515358`

### Props-Interface
```ts
interface FilterBadgeProps {
  header: string;
  text: string;
  variant?: "auto-width" | "selected";
  onRemove?: () => void;
  onExpand?: () => void;
}
```

---

## AT-05 — ListHeader (Listenüberschrift)

**Figma:** Component Set `#65:489` — 5 Varianten
**Datei:** `src/components/ui-custom/ListHeader.tsx` (Skeleton ausfüllen)

### Visuell
Text: Inter SemiBold 600, 15px, schwarz `#000000`
Sortier-Icon: 9×5px Chevron (sort=down/up) oder 18×18px Icon (hover), 12px gap zum Text

| Variante | Inhalt |
|---|---|
| `sort=Default` | Nur Text |
| `sort=down` | Text + Chevron ▾ |
| `sort=up` | Text + Chevron ▴ |
| `sort=up hover` / `sort=down hover` | Text + größeres 18×18px Sort-Icon |

### Props-Interface
```ts
interface ListHeaderProps {
  label: string;
  sort?: "none" | "asc" | "desc";
  onSort?: () => void;
}
```

---

## AT-04 — Tab-Konfiguration

**Figma:** Component Set `#74:570` — 3 Varianten
**Keine eigene Datei** — shadcn `<Tabs>` direkt, aber Styling anpassen.

### Visuell (wichtig: von shadcn-Default abweichend)
Struktur pro Tab:
```
[spacer 20px] [label Inter Bold 700 / Medium 500, 18px] [spacer 20px/21px]
[bottom-bar: h=7, border-radius 3.5px 3.5px 0 0]
```

| Zustand | Text | Bottom-Bar |
|---|---|---|
| `active=true` | Bold 700 #000000 | #146AA1 (blau) |
| `active=active3` (partial) | Medium 500 #353B4A | rgba(20,106,161,0.2) |
| `active=false` | Medium 500 #353B4A | transparent (kein Fill) |

In `globals.css` oder via shadcn-Variante konfigurieren. Kein eigener Wrapper nötig,
aber der Standard-shadcn-TabsTrigger muss gestylt werden.

**CSS-Override in globals.css ergänzen:**
```css
@layer base {
  [role="tab"] {
    @apply font-medium text-[18px] text-[#353B4A] rounded-none border-b-[7px] border-transparent;
  }
  [role="tab"][data-state="active"] {
    @apply font-bold text-black border-blue-primary;
  }
}
```

---

## MO-01 — SearchBar

**Figma:** Component Set `#78:518` — `type=search` (353×32px) & `type=small search` (297.84×27px)
**Datei:** `src/components/ui-custom/SearchBar.tsx` (Skeleton ausfüllen)

### Visuell
- bg: `#F5F7F8`
- border: 1px solid `#646A79`, border-radius 10px
- Placeholder-Text: Inter Medium 500, 15px, Farbe `#646A79`, padding-left 15px
- Search-Icon: 12×12px SVG, Farbe `#646A79`, rechts bei x=324 (default) / x=273 (small)

| Variante | Breite | Höhe |
|---|---|---|
| `default` | 353px | 32px |
| `small` | 297.84px ≈ 298px | 27px |

### Props-Interface
```ts
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "default" | "small";
}
```

### Implementierung
shadcn `<Input>` als Basis mit Custom-Styling. Icon via absolute positioning rechts.

---

## MO-02 — NavItem

**Figma:** Component Sets `#58:398` (Ereignisse), `#58:408` (Lieferungen), `#58:429` (Einstellungen)
**Datei:** `src/components/layout/NavItem.tsx` (neu anlegen)

### Visuell (gemeinsam für alle drei)
- Layout: Gesamt 129–149×22px
- Icon: SVG, ~20×13–16px, links
- Text: Inter, 18px, weiß `#FFFFFF` immer
  - `selected=true`: **Bold 700**
  - `selected=false`: Medium 500

Sub-Items (aus Ereignisansicht sichtbar):
- Eingerückt (padding-left 55px), gleiche Textgröße 18px Medium, weiß
- Varianten: "Offen", "Alle", "Archiv"

### Props-Interface
```ts
interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
  subItems?: Array<{ label: string; href: string }>;
}
```

### Implementierung
- Kein shadcn — natives `<a>` / Next.js `<Link>`
- Icons werden als Inline-SVG übergeben (keine Icon-Library in diesem Projekt)
- Sub-Items mit `flex-col pl-[55px] gap-[10px]`
- Aktiver Zustand über `usePathname()` aus `next/navigation` ermitteln

---

## MO-03 — UserCard

**Figma:** Kein eigenes Component Set — eingebettet in Sidebar (`#502:17497`)
**Datei:** `src/components/layout/UserCard.tsx` (neu anlegen)

### Visuell
Gesamt ca. 219×55px
- Avatar: Kreis ~45×45px, Farbe `#D9D9D9` (Platzhalter)
- Name: Inter Bold 700, 18px, weiß `#FFFFFF`
- Logout-Button: 122×25px, bg `rgba(255,255,255,0.22)`, border-radius 4px
  - Text: Inter SemiBold 600, 14px, weiß — "abmelden"
  - Kleines X-Icon rechts (11.81×11.84px)

### Props-Interface
```ts
interface UserCardProps {
  name: string;
  avatarUrl?: string;
  onLogout: () => void;
}
```

---

## Verifikation

Nach Implementierung aller Tickets:

```bash
# TypeScript-Check (muss 0 Fehler zeigen)
npx tsc --noEmit

# Dev-Server starten und visuell prüfen
npm run dev
```

**Manuelle Checks:**
- [ ] PrioritätBadge: 4 Stufen visuell unterscheidbar, dark/blue-Farbe korrekt
- [ ] StatusBadge: Alle 18 Varianten rendern ohne Fehler
- [ ] FilterBadge: auto-width wächst mit Text-Länge
- [ ] ListHeader: Sortier-Pfeile bei `sort=asc/desc` sichtbar
- [ ] Tab: Aktiver Tab hat blauen Unterstrich, inaktiv grau
- [ ] SearchBar: Fokus zeigt border-Farbe, placeholder sichtbar
- [ ] NavItem: active-Zustand fett, sub-items eingerückt
- [ ] UserCard: Avatar + Name + Logout-Button

---

## Nächste Session (Sprint 2)

Nach Sprint 1 weitermachen mit:
- **OR-01 — Sidebar** (nutzt NavItem + UserCard)
- **OR-02 — SidebarKarte** (Skeleton vorhanden, ausfüllen)
- **TM-01 — OperatorShell** (layout.tsx mit Sidebar fertig verdrahten)
- **TM-02 — KarteShell** (neu)

Figma-Refs für Sprint 2:
- Sidebar Component Set: `#59:534`
- SidebarKarte Component Set: `#104:2186`
- Kartenansicht-Screen: `#508:18941`
