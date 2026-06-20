import { render } from "@testing-library/react";
import { Beschleunigungsanzeige } from "./Beschleunigungsanzeige";

describe("Beschleunigungsanzeige — Grundstruktur", () => {
  it("rendert ein SVG-Element", () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it('hat viewBox="0 0 66 24"', () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 66 24");
  });

  it("rendert genau 6 rect-Elemente", () => {
    const { container } = render(<Beschleunigungsanzeige value={3} />);
    expect(container.querySelectorAll("rect")).toHaveLength(6);
  });
});

describe("Beschleunigungsanzeige — Aktivierung", () => {
  it("value=0 → alle 6 Balken gedimmt (opacity ≤ 0.3)", () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    Array.from(container.querySelectorAll("rect")).forEach((r) => {
      expect(parseFloat(r.getAttribute("opacity") ?? "1")).toBeLessThanOrEqual(0.3);
    });
  });

  it("value=6 → alle 6 Balken aktiv (opacity > 0.9)", () => {
    const { container } = render(<Beschleunigungsanzeige value={6} />);
    Array.from(container.querySelectorAll("rect")).forEach((r) => {
      expect(parseFloat(r.getAttribute("opacity") ?? "0")).toBeGreaterThan(0.9);
    });
  });

  it("value=3 → erste 3 aktiv, letzte 3 gedimmt", () => {
    const { container } = render(<Beschleunigungsanzeige value={3} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    [0, 1, 2].forEach((i) =>
      expect(parseFloat(rects[i].getAttribute("opacity") ?? "0")).toBeGreaterThan(0.9)
    );
    [3, 4, 5].forEach((i) =>
      expect(parseFloat(rects[i].getAttribute("opacity") ?? "1")).toBeLessThanOrEqual(0.3)
    );
  });

  it("value=1 → nur erster Balken aktiv", () => {
    const { container } = render(<Beschleunigungsanzeige value={1} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    expect(parseFloat(rects[0].getAttribute("opacity") ?? "0")).toBeGreaterThan(0.9);
    expect(parseFloat(rects[1].getAttribute("opacity") ?? "1")).toBeLessThanOrEqual(0.3);
  });

  it("value=5 → erste 5 aktiv, letzter gedimmt", () => {
    const { container } = render(<Beschleunigungsanzeige value={5} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    [0, 1, 2, 3, 4].forEach((i) =>
      expect(parseFloat(rects[i].getAttribute("opacity") ?? "0")).toBeGreaterThan(0.9)
    );
    expect(parseFloat(rects[5].getAttribute("opacity") ?? "1")).toBeLessThanOrEqual(0.3);
  });
});

describe("Beschleunigungsanzeige — Farben", () => {
  it("Balken 1+2 (index 0, 1) sind grün (#51A135)", () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    expect(rects[0].getAttribute("fill")).toBe("#51A135");
    expect(rects[1].getAttribute("fill")).toBe("#51A135");
  });

  it("Balken 3+4 (index 2, 3) sind gelb (#DDB411)", () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    expect(rects[2].getAttribute("fill")).toBe("#DDB411");
    expect(rects[3].getAttribute("fill")).toBe("#DDB411");
  });

  it("Balken 5+6 (index 4, 5) sind rot (#C55141)", () => {
    const { container } = render(<Beschleunigungsanzeige value={0} />);
    const rects = Array.from(container.querySelectorAll("rect"));
    expect(rects[4].getAttribute("fill")).toBe("#C55141");
    expect(rects[5].getAttribute("fill")).toBe("#C55141");
  });
});

describe("Beschleunigungsanzeige — Edge Cases", () => {
  it("value=0 rendert ohne Fehler", () => {
    expect(() => render(<Beschleunigungsanzeige value={0} />)).not.toThrow();
  });

  it("value=6 rendert ohne Fehler", () => {
    expect(() => render(<Beschleunigungsanzeige value={6} />)).not.toThrow();
  });

  it.each([0, 1, 2, 3, 4, 5, 6])("value=%i rendert immer 6 Balken", (v) => {
    const { container } = render(<Beschleunigungsanzeige value={v} />);
    expect(container.querySelectorAll("rect")).toHaveLength(6);
  });
});
