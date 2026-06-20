import { render, screen } from "@testing-library/react";
import LinienPage from "./page";

vi.mock("@/components/layout/KarteShell", () => ({
  KarteShell: ({
    children,
    activeItem,
  }: {
    children: React.ReactNode;
    activeItem?: string;
  }) => (
    <div data-testid="karte-shell" data-active={activeItem}>
      {children}
    </div>
  ),
}));

describe("SC-06 — LinienPage — Grundstruktur", () => {
  it("rendert Seitentitel 'Linienübersicht'", () => {
    render(<LinienPage />);
    expect(screen.getByRole("heading", { name: "Linienübersicht" })).toBeInTheDocument();
  });

  it("nutzt KarteShell mit activeItem='linien'", () => {
    render(<LinienPage />);
    expect(screen.getByTestId("karte-shell")).toHaveAttribute("data-active", "linien");
  });

  it("zeigt 'Hauptstandort' Block", () => {
    render(<LinienPage />);
    expect(screen.getByText("Hauptstandort")).toBeInTheDocument();
  });

  it("zeigt 'Standort B' Block", () => {
    render(<LinienPage />);
    expect(screen.getByText("Standort B")).toBeInTheDocument();
  });

  it("Standort-Blöcke haben rounded-[33px]", () => {
    const { container } = render(<LinienPage />);
    expect(container.querySelector('[class*="rounded-\\[33px\\]"]')).toBeInTheDocument();
  });
});

describe("SC-06 — LinienPage — SVG-Karte", () => {
  it("rendert SVG mit aria-label", () => {
    render(<LinienPage />);
    expect(screen.getByLabelText("Linienübersicht SVG")).toBeInTheDocument();
  });

  it("SVG hat rote Route (stroke #DB4C4C)", () => {
    const { container } = render(<LinienPage />);
    const roteRoute = container.querySelector('[stroke="#DB4C4C"]');
    expect(roteRoute).toBeInTheDocument();
  });

  it("SVG hat grüne Route (stroke #449D3C)", () => {
    const { container } = render(<LinienPage />);
    const grueneRoute = container.querySelector('[stroke="#449D3C"]');
    expect(grueneRoute).toBeInTheDocument();
  });

  it("rote Route hat strokeWidth=8", () => {
    const { container } = render(<LinienPage />);
    const roteRoute = container.querySelector('polyline[stroke="#DB4C4C"]');
    expect(roteRoute).toHaveAttribute("stroke-width", "8");
  });

  it("grüne Route hat strokeWidth=8", () => {
    const { container } = render(<LinienPage />);
    const grueneRoute = container.querySelector('polyline[stroke="#449D3C"]');
    expect(grueneRoute).toHaveAttribute("stroke-width", "8");
  });

  it("zeigt Station 'Hauptgebäude' im SVG", () => {
    render(<LinienPage />);
    expect(screen.getByText("Hauptgebäude")).toBeInTheDocument();
  });

  it("zeigt Station 'Lager A'", () => {
    render(<LinienPage />);
    expect(screen.getByText("Lager A")).toBeInTheDocument();
  });

  it("zeigt Station 'Lager F'", () => {
    render(<LinienPage />);
    expect(screen.getByText("Lager F")).toBeInTheDocument();
  });

  it("zeigt alle 10 Stationen als SVG-Text-Elemente", () => {
    const { container } = render(<LinienPage />);
    const textEls = container.querySelectorAll("svg text");
    expect(textEls.length).toBeGreaterThanOrEqual(10);
  });

  it("zeigt 10 Knoten-Kreise (circle)", () => {
    const { container } = render(<LinienPage />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(10);
  });

  it("Hauptgebäude-Knoten hat blauen Stroke (#146AA1)", () => {
    const { container } = render(<LinienPage />);
    const blueCircle = container.querySelector('circle[stroke="#146AA1"]');
    expect(blueCircle).toBeInTheDocument();
  });
});

describe("SC-06 — LinienPage — Legende", () => {
  it("zeigt Legende 'Route Rot'", () => {
    render(<LinienPage />);
    expect(screen.getByText("Route Rot")).toBeInTheDocument();
  });

  it("zeigt Legende 'Route Grün'", () => {
    render(<LinienPage />);
    expect(screen.getByText("Route Grün")).toBeInTheDocument();
  });

  it("Hintergrund hat bg-[#F5F5F5]", () => {
    const { container } = render(<LinienPage />);
    expect(container.querySelector('[class*="F5F5F5"]')).toBeInTheDocument();
  });
});
