import { render, screen, fireEvent } from "@testing-library/react";
import { EreignisTitelleiste } from "./EreignisTitelleiste";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const BASE_PROPS = {
  title: "Strecke blockiert · Routenzug A",
  connectionStatus: "connected" as const,
};

describe("EreignisTitelleiste — Grundstruktur", () => {
  it("rendert den Titel", () => {
    render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(screen.getByText("Strecke blockiert · Routenzug A")).toBeInTheDocument();
  });

  it("hat blauen Hintergrund (bg-[#146AA1])", () => {
    const { container } = render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(container.firstChild as HTMLElement).toHaveClass("bg-[#146AA1]");
  });

  it("hat Höhe h-[148px]", () => {
    const { container } = render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(container.firstChild as HTMLElement).toHaveClass("h-[148px]");
  });

  it("rendert ConnectionIcon als SVG", () => {
    const { container } = render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("EreignisTitelleiste — ConnectionIcon-Varianten", () => {
  it('connectionStatus="connected" → kein X-Overlay', () => {
    const { container } = render(
      <EreignisTitelleiste {...BASE_PROPS} connectionStatus="connected" />
    );
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });

  it('connectionStatus="disconnected" → X-Overlay sichtbar', () => {
    const { container } = render(
      <EreignisTitelleiste {...BASE_PROPS} connectionStatus="disconnected" />
    );
    expect(container.querySelector("line")).toBeInTheDocument();
  });
});

describe("EreignisTitelleiste — Buttons (optional)", () => {
  it('ohne onAbschließen kein "Abschließen"-Button', () => {
    render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(screen.queryByRole("button", { name: /abschließen/i })).not.toBeInTheDocument();
  });

  it('ohne onTrennen kein "Trennen"-Button', () => {
    render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(screen.queryByRole("button", { name: /trennen/i })).not.toBeInTheDocument();
  });

  it("ruft onAbschließen auf wenn Button geklickt", () => {
    const onAbschließen = vi.fn();
    render(<EreignisTitelleiste {...BASE_PROPS} onAbschließen={onAbschließen} />);
    fireEvent.click(screen.getByRole("button", { name: /abschließen/i }));
    expect(onAbschließen).toHaveBeenCalledTimes(1);
  });

  it("ruft onTrennen auf wenn Button geklickt", () => {
    const onTrennen = vi.fn();
    render(<EreignisTitelleiste {...BASE_PROPS} onTrennen={onTrennen} />);
    fireEvent.click(screen.getByRole("button", { name: /trennen/i }));
    expect(onTrennen).toHaveBeenCalledTimes(1);
  });

  it("beide Buttons gleichzeitig möglich", () => {
    render(
      <EreignisTitelleiste
        {...BASE_PROPS}
        onAbschließen={vi.fn()}
        onTrennen={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /abschließen/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /trennen/i })).toBeInTheDocument();
  });
});

describe("EreignisTitelleiste — Zurück-Link (optional)", () => {
  it("kein Zurück-Link ohne backHref", () => {
    render(<EreignisTitelleiste {...BASE_PROPS} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("rendert Zurück-Link mit korrektem href wenn backHref angegeben", () => {
    render(<EreignisTitelleiste {...BASE_PROPS} backHref="/ereignisse" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/ereignisse");
  });

  it('Zurück-Link enthält "Zurück"-Text', () => {
    render(<EreignisTitelleiste {...BASE_PROPS} backHref="/ereignisse" />);
    expect(screen.getByRole("link")).toHaveTextContent(/zurück/i);
  });
});

describe("EreignisTitelleiste — Edge Cases", () => {
  it("leerer Titel rendert ohne Fehler", () => {
    expect(() =>
      render(<EreignisTitelleiste title="" connectionStatus="connected" />)
    ).not.toThrow();
  });

  it("sehr langer Titel rendert ohne Overflow-Fehler", () => {
    const longTitle = "A".repeat(200);
    expect(() =>
      render(<EreignisTitelleiste title={longTitle} connectionStatus="connected" />)
    ).not.toThrow();
  });
});
