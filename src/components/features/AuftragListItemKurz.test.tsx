import { render, screen } from "@testing-library/react";
import { AuftragListItemKurz } from "./AuftragListItemKurz";

const BASE_PROPS = { id: "AUF-01", typ: "Lieferung", priorität: 2 as const };

describe("AuftragListItemKurz — Rendering", () => {
  it("zeigt die Auftrags-ID", () => {
    render(<AuftragListItemKurz {...BASE_PROPS} />);
    expect(screen.getByText("AUF-01")).toBeInTheDocument();
  });

  it("zeigt den Typ", () => {
    render(<AuftragListItemKurz {...BASE_PROPS} />);
    expect(screen.getByText("Lieferung")).toBeInTheDocument();
  });

  it("rendert PrioritätBadge als SVG", () => {
    const { container } = render(<AuftragListItemKurz {...BASE_PROPS} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("hat bg-dark-surface auf dem Wrapper", () => {
    const { container } = render(<AuftragListItemKurz {...BASE_PROPS} />);
    expect(container.querySelector('[class*="dark-surface"]')).toBeInTheDocument();
  });
});

describe("AuftragListItemKurz — Priorität-Varianten", () => {
  it.each([1, 2, 3, 4] as const)(
    "priorität=%i rendert ohne Fehler",
    (priorität) => {
      expect(() =>
        render(<AuftragListItemKurz id="X" typ="Lieferung" priorität={priorität} />)
      ).not.toThrow();
    }
  );
});

describe("AuftragListItemKurz — Typ-Varianten", () => {
  it('zeigt "Mitarbeitertransport"', () => {
    render(<AuftragListItemKurz id="AUF-02" typ="Mitarbeitertransport" priorität={1} />);
    expect(screen.getByText("Mitarbeitertransport")).toBeInTheDocument();
  });
});

describe("AuftragListItemKurz — Edge Cases", () => {
  it("leere ID rendert ohne Fehler", () => {
    expect(() =>
      render(<AuftragListItemKurz id="" typ="Lieferung" priorität={1} />)
    ).not.toThrow();
  });

  it("sehr langer Typ rendert ohne Fehler", () => {
    expect(() =>
      render(<AuftragListItemKurz id="X" typ={"A".repeat(100)} priorität={1} />)
    ).not.toThrow();
  });
});
