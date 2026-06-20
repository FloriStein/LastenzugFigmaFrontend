import { render, screen, fireEvent } from "@testing-library/react";
import { AuftragListRow } from "./AuftragListRow";

const BASE_PROPS = {
  id: "AUF-001",
  linie: "L1",
  art: "Lieferauftrag",
  von: "Lager A",
  ab: "08:00",
  ziel: "Hauptgebäude",
  auftraggeber: "Sabine M.",
  status: "aktiv" as const,
  ankunft: "08:45",
};

describe("AuftragListRow — Grundstruktur", () => {
  it("zeigt Auftrags-ID", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });

  it("zeigt Linie", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("L1")).toBeInTheDocument();
  });

  it("zeigt Art", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("Lieferauftrag")).toBeInTheDocument();
  });

  it("zeigt Von-Wert", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("Lager A")).toBeInTheDocument();
  });

  it("zeigt Ab-Zeit", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("08:00")).toBeInTheDocument();
  });

  it("zeigt Ziel", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("Hauptgebäude")).toBeInTheDocument();
  });

  it("zeigt Auftraggeber", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("Sabine M.")).toBeInTheDocument();
  });

  it("zeigt Ankunftszeit", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByText("08:45")).toBeInTheDocument();
  });

  it("hat h-[48px] Zeilen-Höhe", () => {
    const { container } = render(<AuftragListRow {...BASE_PROPS} />);
    expect(container.querySelector('[class*="h-\\[48px\\]"]')).toBeInTheDocument();
  });

  it("hat bg-[rgba(158,172,182,0.1)] Hintergrund", () => {
    const { container } = render(<AuftragListRow {...BASE_PROPS} />);
    expect(container.querySelector('[class*="158,172,182"]')).toBeInTheDocument();
  });

  it("hat role='row' für Accessibility", () => {
    render(<AuftragListRow {...BASE_PROPS} />);
    expect(screen.getByRole("row")).toBeInTheDocument();
  });
});

describe("AuftragListRow — Status-Badges", () => {
  it("status='aktiv' → Badge 'aktiv' sichtbar", () => {
    render(<AuftragListRow {...BASE_PROPS} status="aktiv" />);
    expect(screen.getByText("aktiv")).toBeInTheDocument();
  });

  it("status='geplant' → Badge 'geplant' sichtbar", () => {
    render(<AuftragListRow {...BASE_PROPS} status="geplant" />);
    expect(screen.getByText("geplant")).toBeInTheDocument();
  });

  it("status='unterbrochen' → Badge 'unterbrochen' sichtbar", () => {
    render(<AuftragListRow {...BASE_PROPS} status="unterbrochen" />);
    expect(screen.getByText("unterbrochen")).toBeInTheDocument();
  });
});

describe("AuftragListRow — Klick-Interaktion", () => {
  it("onClick wird aufgerufen", () => {
    const onClick = vi.fn();
    render(<AuftragListRow {...BASE_PROPS} onClick={onClick} />);
    fireEvent.click(screen.getByRole("row"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("kein Fehler ohne onClick", () => {
    expect(() => {
      render(<AuftragListRow {...BASE_PROPS} />);
      fireEvent.click(screen.getByRole("row"));
    }).not.toThrow();
  });
});

describe("AuftragListRow — Edge Cases", () => {
  it("fehlende Linie → zeigt '—'", () => {
    render(<AuftragListRow {...BASE_PROPS} linie={undefined} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("leere Ankunftszeit rendert ohne Fehler", () => {
    expect(() => render(<AuftragListRow {...BASE_PROPS} ankunft="" />)).not.toThrow();
  });

  it("sehr langer Auftraggeber-Name wird truncated (hat truncate-Klasse)", () => {
    const { container } = render(
      <AuftragListRow {...BASE_PROPS} auftraggeber="Sehr Langer Name Mit Vielen Zeichen" />
    );
    const spans = container.querySelectorAll(".truncate");
    expect(spans.length).toBeGreaterThan(0);
  });
});
