import { render, screen } from "@testing-library/react";
import AnzeigetafelPage from "./page";

describe("ANZ-01 — AnzeigetafelPage — Header", () => {
  it("zeigt 'Haltestelle' als Untertitel", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("Haltestelle")).toBeInTheDocument();
  });

  it("zeigt 'Lager A' als Haltestellenname", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("Lager A")).toBeInTheDocument();
  });

  it("zeigt Mock-Uhrzeit '11:35'", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("11:35")).toBeInTheDocument();
  });
});

describe("ANZ-01 — AnzeigetafelPage — Spalten-Header", () => {
  it("zeigt Spalte 'Linie'", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("Linie")).toBeInTheDocument();
  });

  it("zeigt Spalte 'Richtung'", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("Richtung")).toBeInTheDocument();
  });

  it("zeigt Spalte 'Abfahrt'", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("Abfahrt")).toBeInTheDocument();
  });
});

describe("ANZ-01 — AnzeigetafelPage — Abfahrts-Reihen", () => {
  it("zeigt 3 Abfahrts-Reihen", () => {
    const { container } = render(<AnzeigetafelPage />);
    const rows = container.querySelectorAll('[class*="h-49.5"]');
    expect(rows).toHaveLength(3);
  });

  it("zeigt Richtung 'Hauptgebäude' (zweimal vorhanden)", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getAllByText("Hauptgebäude")).toHaveLength(2);
  });

  it("zeigt Richtung 'Lager M'", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("Lager M")).toBeInTheDocument();
  });

  it("zeigt Via-Text für Abfahrt 1", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("via Lager H → Halle A → Lager F → Lager E")).toBeInTheDocument();
  });

  it("zeigt Via-Text für Abfahrt 2", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("via Lager H → Lager F → Lager E")).toBeInTheDocument();
  });

  it("zeigt Via-Text für Abfahrt 3", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("via Lager H → Hauptgebäude → Lager L")).toBeInTheDocument();
  });
});

describe("ANZ-01 — AnzeigetafelPage — Abfahrtszeiten", () => {
  it("zeigt Abfahrt 'in 9min'", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("in 9min")).toBeInTheDocument();
  });

  it("zeigt Abfahrt 'in 2h 9min'", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("in 2h 9min")).toBeInTheDocument();
  });

  it("zeigt Abfahrt 'in 3h 9min'", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("in 3h 9min")).toBeInTheDocument();
  });
});

describe("ANZ-01 — AnzeigetafelPage — Statusmeldungen", () => {
  it("zeigt Verspätung '1min verspätet' für Abfahrt 1", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("1min verspätet")).toBeInTheDocument();
  });

  it("zeigt 'Umleitung'-Badge für Abfahrt 2", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("Umleitung")).toBeInTheDocument();
  });

  it("zeigt Umleitungstext 'Haltestelle Halle A entfällt'", () => {
    render(<AnzeigetafelPage />);
    expect(screen.getByText("Haltestelle Halle A entfällt")).toBeInTheDocument();
  });

  it("Abfahrt 3 hat keine Verspätung und keine Umleitung", () => {
    render(<AnzeigetafelPage />);
    expect(screen.queryAllByText("Umleitung")).toHaveLength(1);
    expect(screen.queryAllByText(/verspätet/)).toHaveLength(1);
  });
});

describe("ANZ-01 — AnzeigetafelPage — Edge Cases", () => {
  it("rendert ohne Fehler", () => {
    expect(() => render(<AnzeigetafelPage />)).not.toThrow();
  });

  it("Header-Bereich hat dunklen Hintergrund (bg-dark-surface)", () => {
    const { container } = render(<AnzeigetafelPage />);
    expect(container.querySelector('[class*="bg-dark-surface"]')).toBeInTheDocument();
  });

  it("Umleitung-Badge hat orangen Hintergrund", () => {
    const { container } = render(<AnzeigetafelPage />);
    const badge = container.querySelector('[class*="233,119,6"]');
    expect(badge).toBeInTheDocument();
  });
});
