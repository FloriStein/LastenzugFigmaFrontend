import { render, screen, fireEvent } from "@testing-library/react";
import { AuftragDetailHeader } from "./AuftragDetailHeader";

const BASE_PROPS = {
  id: "212",
  art: "Lieferung",
  status: "aktiv" as const,
  onBack: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe("AuftragDetailHeader — Breadcrumb", () => {
  it("zeigt 'Aufträge' als statischen Text", () => {
    render(<AuftragDetailHeader {...BASE_PROPS} />);
    expect(screen.getByText("Aufträge")).toBeInTheDocument();
  });

  it("zeigt '{art} #{id}' als kombinierten Text", () => {
    render(<AuftragDetailHeader {...BASE_PROPS} />);
    expect(screen.getByText("Lieferung #212")).toBeInTheDocument();
  });

  it("zeigt andere Art und ID korrekt", () => {
    render(<AuftragDetailHeader {...BASE_PROPS} id="99" art="Transport" />);
    expect(screen.getByText("Transport #99")).toBeInTheDocument();
  });
});

describe("AuftragDetailHeader — Status-Badge", () => {
  it("status='aktiv' → Badge-Text 'aktiv'", () => {
    render(<AuftragDetailHeader {...BASE_PROPS} status="aktiv" />);
    expect(screen.getByText("aktiv")).toBeInTheDocument();
  });

  it("status='geplant' → Badge-Text 'geplant'", () => {
    render(<AuftragDetailHeader {...BASE_PROPS} status="geplant" />);
    expect(screen.getByText("geplant")).toBeInTheDocument();
  });

  it("status='unterbrochen' → Badge-Text 'unterbrochen'", () => {
    render(<AuftragDetailHeader {...BASE_PROPS} status="unterbrochen" />);
    expect(screen.getByText("unterbrochen")).toBeInTheDocument();
  });
});

describe("AuftragDetailHeader — Zurück-Button", () => {
  it("Button hat aria-label 'Zurück zu Aufträge'", () => {
    render(<AuftragDetailHeader {...BASE_PROPS} />);
    expect(screen.getByRole("button", { name: "Zurück zu Aufträge" })).toBeInTheDocument();
  });

  it("Klick auf Zurück-Button ruft onBack auf", () => {
    const onBack = vi.fn();
    render(<AuftragDetailHeader {...BASE_PROPS} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: "Zurück zu Aufträge" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("onBack wird nur einmal aufgerufen pro Klick", () => {
    const onBack = vi.fn();
    render(<AuftragDetailHeader {...BASE_PROPS} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: "Zurück zu Aufträge" }));
    fireEvent.click(screen.getByRole("button", { name: "Zurück zu Aufträge" }));
    expect(onBack).toHaveBeenCalledTimes(2);
  });
});

describe("AuftragDetailHeader — Edge Cases", () => {
  it("sehr lange ID wird ohne Fehler gerendert", () => {
    expect(() =>
      render(<AuftragDetailHeader {...BASE_PROPS} id="AUF-2024-99999" />)
    ).not.toThrow();
  });

  it("sehr langer art-Name wird ohne Fehler gerendert", () => {
    expect(() =>
      render(<AuftragDetailHeader {...BASE_PROPS} art="Langstreckentransport mit Sonderbehandlung" />)
    ).not.toThrow();
  });
});
