import { render, screen } from "@testing-library/react";
import { FahrtInfoPanel } from "./FahrtInfoPanel";

const MOCK_AUFTRÄGE = [
  { id: "AUF-01", typ: "Lieferung", priorität: 2 as const },
  { id: "AUF-02", typ: "Mitarbeitertransport", priorität: 1 as const },
];

describe("FahrtInfoPanel — Fahrzeugstatus", () => {
  it('rendert StatusBadge für "fährt-automatisiert"', () => {
    render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={[]} />);
    expect(screen.getByText(/fährt automatisiert/i)).toBeInTheDocument();
  });

  it('rendert StatusBadge für "fahrt-unterbrochen"', () => {
    render(<FahrtInfoPanel fahrtStatus="fahrt-unterbrochen" aufträge={[]} />);
    expect(screen.getByText(/fahrt unterbrochen/i)).toBeInTheDocument();
  });

  it('rendert StatusBadge für "lädt"', () => {
    render(<FahrtInfoPanel fahrtStatus="lädt" aufträge={[]} />);
    expect(screen.getByText(/lädt/i)).toBeInTheDocument();
  });
});

describe("FahrtInfoPanel — Auftragsliste", () => {
  it("rendert alle Aufträge", () => {
    render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={MOCK_AUFTRÄGE} />);
    expect(screen.getByText("AUF-01")).toBeInTheDocument();
    expect(screen.getByText("AUF-02")).toBeInTheDocument();
  });

  it("zeigt Auftrags-Typ", () => {
    render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={MOCK_AUFTRÄGE} />);
    expect(screen.getByText("Lieferung")).toBeInTheDocument();
    expect(screen.getByText("Mitarbeitertransport")).toBeInTheDocument();
  });

  it('zeigt "Keine Aufträge" wenn Liste leer', () => {
    render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={[]} />);
    expect(screen.getByText(/keine aufträge/i)).toBeInTheDocument();
  });

  it('kein "Keine Aufträge" wenn Aufträge vorhanden', () => {
    render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={MOCK_AUFTRÄGE} />);
    expect(screen.queryByText(/keine aufträge/i)).not.toBeInTheDocument();
  });

  it("rendert PrioritätBadge für jeden Auftrag", () => {
    const { container } = render(
      <FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={MOCK_AUFTRÄGE} />
    );
    expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(MOCK_AUFTRÄGE.length);
  });
});

describe("FahrtInfoPanel — Einzelauftrag", () => {
  it("ein Auftrag wird korrekt gerendert", () => {
    render(
      <FahrtInfoPanel
        fahrtStatus="lädt"
        aufträge={[{ id: "AUF-99", typ: "Lieferung", priorität: 4 }]}
      />
    );
    expect(screen.getByText("AUF-99")).toBeInTheDocument();
  });
});

describe("FahrtInfoPanel — Edge Cases", () => {
  it("leere Auftragsliste rendert ohne Fehler", () => {
    expect(() =>
      render(<FahrtInfoPanel fahrtStatus="fährt-automatisiert" aufträge={[]} />)
    ).not.toThrow();
  });

  it("alle FahrtStatus-Werte rendern ohne Fehler", () => {
    for (const status of ["fährt-automatisiert", "fahrt-unterbrochen", "lädt"] as const) {
      expect(() =>
        render(<FahrtInfoPanel fahrtStatus={status} aufträge={[]} />)
      ).not.toThrow();
    }
  });
});
