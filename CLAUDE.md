# FigmaDesignUmsetzung

## Projektziel
Konvertierung eines Figma-Designs (6–15 Screens, mehrere Flows) in ein funktionierendes Frontend mit Next.js, TypeScript und shadcn/ui.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Sprache:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Komponentenbibliothek:** shadcn/ui
- **Figma-Integration:** DesignSync (VS Code Extension)

## Entscheidungsprozess

Wenn wichtige Architektur- oder Design-Entscheidungen anstehen:
1. `/grill-me [Thema]` starten — strukturierte Befragung, eine Frage nach der anderen
2. Entscheidung + Begründung in `decisions.md` dokumentieren
3. Erst danach mit der Implementierung beginnen

Offene Entscheidungen immer zuerst in `decisions.md` nachschauen.

## Arbeitsablauf
1. **Design Audit** — Figma-Projekt via DesignSync auslesen: Screens, Tokens, Flows
2. **Projekt-Setup** — Next.js + shadcn/ui scaffold, Design Tokens in tailwind.config.ts
3. **Komponentenbibliothek** — Bottom-Up: Atoms → Molecules → Screens
4. **Routing & Flows** — App Router Seiten, Navigation, interaktive Zustände
5. **Polish** — Responsive, Accessibility, Edge Cases

## Projektstruktur (geplant)
```
src/
  app/
    (screens)/          # Route Groups pro Screen/Flow
      [screen-name]/
        page.tsx
  components/
    ui/                 # shadcn/ui Basis-Komponenten (nicht manuell bearbeiten)
    [feature]/          # Feature-spezifische zusammengesetzte Komponenten
  lib/
    utils.ts            # cn() und sonstige Hilfsfunktionen
  styles/
    globals.css
```

## Konventionen
- Komponentendateien: `PascalCase.tsx`
- Hilfsdateien: `kebab-case.ts`
- Props-Interfaces direkt über der Komponente definieren, kein eigenes `types/`-Verzeichnis außer es gibt mehr als 5 gemeinsam genutzte Typen
- Keine Default Exports außer bei Next.js Page/Layout-Dateien
- shadcn-Komponenten niemals direkt in `components/ui/` editieren — stattdessen in Feature-Komponenten wrappen
- Keine Kommentare außer wenn das Warum nicht offensichtlich ist

## Figma MCP Setup

Der Figma MCP-Server (`@figma/mcp`) ermöglicht direkten Zugriff auf Figma-Dateien aus Claude Code.

**Einrichtung (einmalig):**
1. Figma Personal Access Token holen: figma.com → Settings → Security → Personal access tokens
2. Token in `.claude/settings.local.json` eintragen als `FIGMA_API_KEY` (diese Datei ist gitignored)
3. Claude Code neu starten → MCP-Server wird automatisch aktiviert

**Nach der Einrichtung verfügbare Operationen:**
- Figma-Datei-Struktur und Frames auslesen
- Design Tokens (Farben, Typografie, Spacing) extrahieren
- Komponentenbeschreibungen und Props abrufen

## Design Tokens
Werden nach dem Design Audit in `tailwind.config.ts` eingetragen:
- Primär-/Sekundärfarben
- Typografie-Skala
- Spacing-Werte (sofern vom Figma-Standard abweichend)

## Status
- [x] Design Audit (Figma → Screens & Tokens inventarisieren) → `design-audit.md`
- [ ] Projekt-Scaffold (Next.js + shadcn/ui)
- [ ] Design Tokens konfigurieren
- [ ] Komponentenbibliothek aufbauen
- [ ] Screens implementieren
- [ ] Flows & Navigation verdrahten
