import { render, screen } from "@testing-library/react";
import { KameraPanel } from "./KameraPanel";

const BASE_PROPS = {
  frontImageUrl: "/mock/front.jpg",
  speedKmh: 12,
  acceleration: 2,
};

describe("KameraPanel — Grundstruktur", () => {
  it("rendert Kamera-Vorne-Bild (img mit alt='Kamera Vorne')", () => {
    render(<KameraPanel {...BASE_PROPS} />);
    expect(screen.getByAltText("Kamera Vorne")).toBeInTheDocument();
  });

  it("img Kamera Vorne hat korrekte src", () => {
    render(<KameraPanel {...BASE_PROPS} />);
    expect(screen.getByAltText("Kamera Vorne")).toHaveAttribute("src", "/mock/front.jpg");
  });

  it("zeigt Geschwindigkeit als Zahl", () => {
    render(<KameraPanel {...BASE_PROPS} />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("zeigt 'km/h' Einheit", () => {
    render(<KameraPanel {...BASE_PROPS} />);
    expect(screen.getByText("km/h")).toBeInTheDocument();
  });

  it("rendert ConnectionIcon (SVG)", () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("rendert Beschleunigungsanzeige (6 rect-Elemente)", () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} />);
    const beschSvg = container.querySelector('svg[viewBox="0 0 66 24"]');
    expect(beschSvg?.querySelectorAll("rect")).toHaveLength(6);
  });

  it("hat schwarzen Hintergrund", () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} />);
    expect(container.querySelector('[class*="bg-black"]')).toBeInTheDocument();
  });
});

describe("KameraPanel — Kamera Seite", () => {
  it("kein Seite-Bild wenn sideImageUrl nicht angegeben", () => {
    render(<KameraPanel {...BASE_PROPS} />);
    expect(screen.queryByAltText("Kamera Seite")).not.toBeInTheDocument();
  });

  it("rendert Seite-Bild wenn sideImageUrl angegeben", () => {
    render(<KameraPanel {...BASE_PROPS} sideImageUrl="/mock/side.jpg" />);
    expect(screen.getByAltText("Kamera Seite")).toBeInTheDocument();
  });

  it("Seite-Bild hat korrekte src", () => {
    render(<KameraPanel {...BASE_PROPS} sideImageUrl="/mock/side.jpg" />);
    expect(screen.getByAltText("Kamera Seite")).toHaveAttribute("src", "/mock/side.jpg");
  });
});

describe("KameraPanel — ConnectionIcon-Status", () => {
  it('connectionStatus="connected" → kein X-Overlay', () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} connectionStatus="connected" />);
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });

  it('connectionStatus="disconnected" → X-Overlay sichtbar', () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} connectionStatus="disconnected" />);
    expect(container.querySelector("line")).toBeInTheDocument();
  });

  it('kein connectionStatus → default "connected" (kein X-Overlay)', () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} />);
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });
});

describe("KameraPanel — Speed-HUD Varianten", () => {
  it("zeigt speedKmh=0", () => {
    render(<KameraPanel {...BASE_PROPS} speedKmh={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("zeigt speedKmh=120", () => {
    render(<KameraPanel {...BASE_PROPS} speedKmh={120} />);
    expect(screen.getByText("120")).toBeInTheDocument();
  });
});

describe("KameraPanel — Beschleunigung", () => {
  it("acceleration=0 → alle Balken gedimmt", () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} acceleration={0} />);
    const beschSvg = container.querySelector('svg[viewBox="0 0 66 24"]');
    Array.from(beschSvg?.querySelectorAll("rect") ?? []).forEach((r) => {
      expect(parseFloat(r.getAttribute("opacity") ?? "1")).toBeLessThanOrEqual(0.3);
    });
  });

  it("acceleration=6 → alle Balken aktiv", () => {
    const { container } = render(<KameraPanel {...BASE_PROPS} acceleration={6} />);
    const beschSvg = container.querySelector('svg[viewBox="0 0 66 24"]');
    Array.from(beschSvg?.querySelectorAll("rect") ?? []).forEach((r) => {
      expect(parseFloat(r.getAttribute("opacity") ?? "0")).toBeGreaterThan(0.9);
    });
  });
});

describe("KameraPanel — Edge Cases", () => {
  it("leere frontImageUrl rendert ohne Fehler", () => {
    expect(() => render(<KameraPanel {...BASE_PROPS} frontImageUrl="" />)).not.toThrow();
  });

  it("speedKmh und acceleration kombiniert rendert ohne Fehler", () => {
    expect(() =>
      render(<KameraPanel frontImageUrl="/x.jpg" speedKmh={0} acceleration={0} />)
    ).not.toThrow();
  });
});
