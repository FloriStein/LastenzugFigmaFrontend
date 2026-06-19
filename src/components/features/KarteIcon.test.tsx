import { render } from "@testing-library/react";
import { KarteIcon } from "./KarteIcon";

describe("KarteIcon — SVG-Grundstruktur", () => {
  it.each([
    ["routenzug"],
    ["routenzug-selected"],
    ["routenzug-problem"],
    ["rsu"],
    ["kamera"],
  ] as const)('variant="%s" rendert ein SVG-Element', (variant) => {
    const { container } = render(<KarteIcon variant={variant} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("KarteIcon — Routenzug-Familie (28×31px)", () => {
  it('variant="routenzug" hat fill="#2A2F3B"', () => {
    const { container } = render(<KarteIcon variant="routenzug" />);
    const circle = container.querySelector("circle");
    expect(circle?.getAttribute("fill")).toBe("#2A2F3B");
  });

  it('variant="routenzug-selected" hat fill="#146AA1"', () => {
    const { container } = render(<KarteIcon variant="routenzug-selected" />);
    const circle = container.querySelector("circle");
    expect(circle?.getAttribute("fill")).toBe("#146AA1");
  });

  it('variant="routenzug-problem" hat fill="#C55141"', () => {
    const { container } = render(<KarteIcon variant="routenzug-problem" />);
    const circle = container.querySelector("circle");
    expect(circle?.getAttribute("fill")).toBe("#C55141");
  });

  it.each(["routenzug", "routenzug-selected", "routenzug-problem"] as const)(
    'variant="%s" hat Breite 28 und Höhe 31',
    (variant) => {
      const { container } = render(<KarteIcon variant={variant} />);
      const svg = container.querySelector("svg")!;
      expect(svg.getAttribute("width")).toBe("28");
      expect(svg.getAttribute("height")).toBe("31");
    }
  );

  it("routenzug hat Kreis und Polygon (Pin-Form)", () => {
    const { container } = render(<KarteIcon variant="routenzug" />);
    expect(container.querySelector("circle")).toBeInTheDocument();
    expect(container.querySelector("polygon")).toBeInTheDocument();
  });

  it("alle drei routenzug-Varianten teilen denselben Pfad-Typ (Kreis + Polygon)", () => {
    for (const v of ["routenzug", "routenzug-selected", "routenzug-problem"] as const) {
      const { container } = render(<KarteIcon variant={v} />);
      expect(container.querySelector("circle")).toBeInTheDocument();
      expect(container.querySelector("polygon")).toBeInTheDocument();
    }
  });
});

describe("KarteIcon — rsu & kamera (36×40px)", () => {
  it.each(["rsu", "kamera"] as const)('variant="%s" hat Breite 36 und Höhe 40', (variant) => {
    const { container } = render(<KarteIcon variant={variant} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("36");
    expect(svg.getAttribute("height")).toBe("40");
  });

  it('variant="rsu" rendert ein Rechteck', () => {
    const { container } = render(<KarteIcon variant="rsu" />);
    expect(container.querySelector("rect")).toBeInTheDocument();
  });

  it('variant="kamera" rendert Rechteck und Kreis (Linse)', () => {
    const { container } = render(<KarteIcon variant="kamera" />);
    expect(container.querySelector("rect")).toBeInTheDocument();
    expect(container.querySelector("circle")).toBeInTheDocument();
  });
});
