import { render, screen } from "@testing-library/react";
import { AuftragDetailFields } from "./AuftragDetailFields";

const BASE_PROPS = {
  artikel: "Karosserieteil #12312 (4 Stk.)",
  start: "Lager B",
  ziel: "Lager A",
  routenzug: "Routenzug A",
  ankunft: "12:10 Uhr (in 12min)",
  auftraggeber: "Alex Auftrag",
  erstellt: "10:50 Uhr",
  priorität: 2 as const,
};

describe("AuftragDetailFields — Labels", () => {
  it("zeigt Label 'Artikel'", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Artikel")).toBeInTheDocument();
  });

  it("zeigt Label 'Priorität'", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Priorität")).toBeInTheDocument();
  });

  it("zeigt Label 'Start'", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("zeigt Label 'Ziel'", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Ziel")).toBeInTheDocument();
  });

  it("zeigt Label 'Routenzug'", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Routenzug")).toBeInTheDocument();
  });

  it("zeigt Label 'Ankunft'", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Ankunft")).toBeInTheDocument();
  });

  it("zeigt Label 'Auftraggeber'", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Auftraggeber")).toBeInTheDocument();
  });

  it("zeigt Label 'Erstellt'", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Erstellt")).toBeInTheDocument();
  });
});

describe("AuftragDetailFields — Werte", () => {
  it("zeigt Artikel-Wert", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Karosserieteil #12312 (4 Stk.)")).toBeInTheDocument();
  });

  it("zeigt Start-Wert", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Lager B")).toBeInTheDocument();
  });

  it("zeigt Ziel-Wert", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Lager A")).toBeInTheDocument();
  });

  it("zeigt Routenzug-Wert", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Routenzug A")).toBeInTheDocument();
  });

  it("zeigt Ankunft-Wert", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("12:10 Uhr (in 12min)")).toBeInTheDocument();
  });

  it("zeigt Auftraggeber-Wert", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("Alex Auftrag")).toBeInTheDocument();
  });

  it("zeigt Erstellt-Wert", () => {
    render(<AuftragDetailFields {...BASE_PROPS} />);
    expect(screen.getByText("10:50 Uhr")).toBeInTheDocument();
  });
});

describe("AuftragDetailFields — PrioritätBadge", () => {
  it("rendert SVG für Priorität 1 (1 gefüllter Circle)", () => {
    const { container } = render(<AuftragDetailFields {...BASE_PROPS} priorität={1} />);
    const filled = [...container.querySelectorAll("circle")].filter(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled).toHaveLength(1);
  });

  it("rendert SVG für Priorität 2 (2 gefüllte Circles)", () => {
    const { container } = render(<AuftragDetailFields {...BASE_PROPS} priorität={2} />);
    const filled = [...container.querySelectorAll("circle")].filter(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled).toHaveLength(2);
  });

  it("rendert SVG für Priorität 3 (3 gefüllte Circles)", () => {
    const { container } = render(<AuftragDetailFields {...BASE_PROPS} priorität={3} />);
    const filled = [...container.querySelectorAll("circle")].filter(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled).toHaveLength(3);
  });

  it("rendert SVG für Priorität 4 (alle 4 Circles gefüllt)", () => {
    const { container } = render(<AuftragDetailFields {...BASE_PROPS} priorität={4} />);
    const filled = [...container.querySelectorAll("circle")].filter(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled).toHaveLength(4);
  });
});

describe("AuftragDetailFields — Edge Cases", () => {
  it("leerer Auftraggeber-String rendert ohne Fehler", () => {
    expect(() =>
      render(<AuftragDetailFields {...BASE_PROPS} auftraggeber="" />)
    ).not.toThrow();
  });

  it("sehr langer Artikel-Name rendert ohne Fehler", () => {
    expect(() =>
      render(
        <AuftragDetailFields
          {...BASE_PROPS}
          artikel="Ersatzteil für Produktionsanlage Typ-X Sektion B Einheit 42 (inkl. Zubehör, 200 Stk.)"
        />
      )
    ).not.toThrow();
  });

  it("andere Werte werden bei Änderung korrekt angezeigt", () => {
    render(<AuftragDetailFields {...BASE_PROPS} start="Halle C" ziel="Halle D" />);
    expect(screen.getByText("Halle C")).toBeInTheDocument();
    expect(screen.getByText("Halle D")).toBeInTheDocument();
  });
});
