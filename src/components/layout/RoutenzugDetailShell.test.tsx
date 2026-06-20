import { render, screen } from "@testing-library/react";
import { RoutenzugDetailShell } from "./RoutenzugDetailShell";

const SHELL_PROPS = {
  titelleiste: <div data-testid="titelleiste">Header</div>,
  kameraPanel: <div data-testid="kamera">Kamera</div>,
  fahrtInfoPanel: <div data-testid="fahrtinfo">FahrtInfo</div>,
  aktionenPanel: <div data-testid="aktionen">Aktionen</div>,
};

describe("RoutenzugDetailShell — Rendering", () => {
  it("rendert den Titelleiste-Slot", () => {
    render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(screen.getByTestId("titelleiste")).toBeInTheDocument();
  });

  it("rendert den KameraPanel-Slot", () => {
    render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(screen.getByTestId("kamera")).toBeInTheDocument();
  });

  it("rendert den FahrtInfoPanel-Slot", () => {
    render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(screen.getByTestId("fahrtinfo")).toBeInTheDocument();
  });

  it("rendert den AktionenPanel-Slot", () => {
    render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(screen.getByTestId("aktionen")).toBeInTheDocument();
  });

  it("alle 4 Slots gleichzeitig sichtbar", () => {
    render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Kamera")).toBeInTheDocument();
    expect(screen.getByText("FahrtInfo")).toBeInTheDocument();
    expect(screen.getByText("Aktionen")).toBeInTheDocument();
  });
});

describe("RoutenzugDetailShell — Layout-Klassen", () => {
  it("äußerer Wrapper hat h-screen und flex-col", () => {
    const { container } = render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("h-screen");
    expect(outer.className).toContain("flex-col");
  });

  it("Grid-Bereich hat grid-cols-3", () => {
    const { container } = render(<RoutenzugDetailShell {...SHELL_PROPS} />);
    expect(container.querySelector('[class*="grid-cols-3"]')).toBeInTheDocument();
  });
});

describe("RoutenzugDetailShell — Edge Cases", () => {
  it("leere Slots (null) rendern ohne Fehler", () => {
    expect(() =>
      render(
        <RoutenzugDetailShell
          titelleiste={null}
          kameraPanel={null}
          fahrtInfoPanel={null}
          aktionenPanel={null}
        />
      )
    ).not.toThrow();
  });

  it("Text-Children werden gerendert", () => {
    render(
      <RoutenzugDetailShell
        titelleiste={<span>T</span>}
        kameraPanel={<span>K</span>}
        fahrtInfoPanel={<span>F</span>}
        aktionenPanel={<span>A</span>}
      />
    );
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
