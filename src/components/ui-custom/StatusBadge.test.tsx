import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

const LABEL_MAP = [
  ["fahrt-unterbrochen",        "Fahrt unterbrochen"],
  ["autom-fahren-unterbrochen", "automatisiertes Fahren unterbrochen"],
  ["fährt-automatisiert",       "fährt automatisiert"],
  ["lädt",                      "lädt"],
  ["pause",                     "automatisierte Fahrt pausiert"],
  ["aktiv",                     "aktiv"],
  ["offen",                     "offen"],
  ["frei",                      "frei"],
  ["in-bearbeitung",            "in Bearbeitung"],
  ["geplant",                   "geplant"],
  ["abgeschlossen",             "abgeschlossen"],
  ["warten",                    "warten zur Erinnerung"],
  ["belegt",                    "belegt"],
  ["unterbrochen-gelb",         "unterbrochen"],
  ["fehlermeldung",             "Fehlermeldung"],
  ["lieferung",                 "Lieferung"],
  ["mitarbeitertransport",      "Mitarbeitertransport"],
  ["auftrag-abgeschlossen",     "abgeschlossen"],
] as const;

describe("StatusBadge", () => {
  it.each(LABEL_MAP)('type="%s" zeigt Label "%s"', (type, expectedLabel) => {
    render(<StatusBadge type={type} />);
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it('type="lädt" mit percent zeigt Prozentangabe', () => {
    render(<StatusBadge type="lädt" percent={42} />);
    expect(screen.getByText("lädt (42%)")).toBeInTheDocument();
  });

  it('type="lädt" ohne percent zeigt nur "lädt"', () => {
    render(<StatusBadge type="lädt" />);
    expect(screen.getByText("lädt")).toBeInTheDocument();
  });

  it("rendert ein <span>-Element", () => {
    const { container } = render(<StatusBadge type="aktiv" />);
    expect(container.querySelector("span")).toBeInTheDocument();
  });
});
