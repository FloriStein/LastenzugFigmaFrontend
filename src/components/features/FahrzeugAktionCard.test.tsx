import { render, screen, fireEvent } from "@testing-library/react";
import { FahrzeugAktionCard } from "./FahrzeugAktionCard";

const ICON = <svg data-testid="test-icon" />;
const BASE_PROPS = { label: "Nothalt", icon: ICON, variant: "danger" as const, onClick: vi.fn() };

describe("FahrzeugAktionCard — Rendering", () => {
  it("zeigt das Label", () => {
    render(<FahrzeugAktionCard {...BASE_PROPS} />);
    expect(screen.getByText("Nothalt")).toBeInTheDocument();
  });

  it("rendert den Icon-Slot", () => {
    render(<FahrzeugAktionCard {...BASE_PROPS} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("ist ein Button", () => {
    render(<FahrzeugAktionCard {...BASE_PROPS} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Button ist durch den Label-Text zugänglich", () => {
    render(<FahrzeugAktionCard {...BASE_PROPS} />);
    expect(screen.getByRole("button", { name: /nothalt/i })).toBeInTheDocument();
  });
});

describe("FahrzeugAktionCard — Varianten", () => {
  it('variant="danger" enthält rote Farbe (#C55141)', () => {
    const { container } = render(<FahrzeugAktionCard {...BASE_PROPS} variant="danger" />);
    expect(container.querySelector('[class*="C55141"]')).toBeInTheDocument();
  });

  it('variant="warning" enthält gelbe Farbe (#DDB411)', () => {
    const { container } = render(
      <FahrzeugAktionCard {...BASE_PROPS} variant="warning" label="Langsam fahren" />
    );
    expect(container.querySelector('[class*="DDB411"]')).toBeInTheDocument();
  });

  it('variant="danger" enthält keine gelbe Farbe', () => {
    const { container } = render(<FahrzeugAktionCard {...BASE_PROPS} variant="danger" />);
    expect(container.querySelector('[class*="DDB411"]')).not.toBeInTheDocument();
  });

  it('variant="warning" enthält keine rote Farbe', () => {
    const { container } = render(
      <FahrzeugAktionCard {...BASE_PROPS} variant="warning" />
    );
    expect(container.querySelector('[class*="C55141"]')).not.toBeInTheDocument();
  });
});

describe("FahrzeugAktionCard — Interaktion", () => {
  it("ruft onClick auf wenn geklickt", () => {
    const onClick = vi.fn();
    render(<FahrzeugAktionCard {...BASE_PROPS} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("onClick wird exakt einmal pro Klick aufgerufen", () => {
    const onClick = vi.fn();
    render(<FahrzeugAktionCard {...BASE_PROPS} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

describe("FahrzeugAktionCard — Edge Cases", () => {
  it("leerer Label rendert ohne Fehler", () => {
    expect(() =>
      render(<FahrzeugAktionCard label="" icon={ICON} variant="danger" onClick={vi.fn()} />)
    ).not.toThrow();
  });

  it("kein Icon (null) rendert ohne Fehler", () => {
    expect(() =>
      render(<FahrzeugAktionCard label="Nothalt" icon={null} variant="danger" onClick={vi.fn()} />)
    ).not.toThrow();
  });

  it("beide Varianten rendern ohne Fehler", () => {
    for (const v of ["danger", "warning"] as const) {
      expect(() =>
        render(<FahrzeugAktionCard label="X" icon={null} variant={v} onClick={vi.fn()} />)
      ).not.toThrow();
    }
  });
});
