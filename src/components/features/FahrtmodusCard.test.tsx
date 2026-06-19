import { render, screen, fireEvent } from "@testing-library/react";
import { FahrtmodusCard } from "./FahrtmodusCard";

describe("FahrtmodusCard — Modus-Labels", () => {
  it('variant="manuell" zeigt Label "Manuell"', () => {
    render(<FahrtmodusCard variant="manuell" />);
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });

  it('variant="autom-eingabe" zeigt Label "Automatisch"', () => {
    render(<FahrtmodusCard variant="autom-eingabe" />);
    expect(screen.getByText("Automatisch")).toBeInTheDocument();
  });

  it('variant="autom-nicht-moeglich" zeigt Label "Autom. nicht mögl."', () => {
    render(<FahrtmodusCard variant="autom-nicht-moeglich" />);
    expect(screen.getByText("Autom. nicht mögl.")).toBeInTheDocument();
  });

  it('variant="wiederherstellung" zeigt Label "Wiederherstellung"', () => {
    render(<FahrtmodusCard variant="wiederherstellung" />);
    expect(screen.getByText("Wiederherstellung")).toBeInTheDocument();
  });
});

describe("FahrtmodusCard — Subtext", () => {
  it('manuell → Subtext "Fahrtmodus: Manuell"', () => {
    render(<FahrtmodusCard variant="manuell" />);
    expect(screen.getByText("Fahrtmodus: Manuell")).toBeInTheDocument();
  });

  it('autom-eingabe → Subtext "Eingabe erforderlich"', () => {
    render(<FahrtmodusCard variant="autom-eingabe" />);
    expect(screen.getByText("Eingabe erforderlich")).toBeInTheDocument();
  });

  it('autom-nicht-moeglich → Subtext "Automatisches Fahren nicht möglich"', () => {
    render(<FahrtmodusCard variant="autom-nicht-moeglich" />);
    expect(screen.getByText("Automatisches Fahren nicht möglich")).toBeInTheDocument();
  });

  it('wiederherstellung → Subtext "Wiederherstellung möglich"', () => {
    render(<FahrtmodusCard variant="wiederherstellung" />);
    expect(screen.getByText("Wiederherstellung möglich")).toBeInTheDocument();
  });
});

describe("FahrtmodusCard — Primär-Button-Text", () => {
  it.each([
    ["manuell" as const,              "Auf Automatik umschalten"],
    ["autom-eingabe" as const,        "Bestätigen"],
    ["autom-nicht-moeglich" as const, "Manuell fahren"],
    ["wiederherstellung" as const,    "Wiederherstellen"],
  ])('variant="%s" Button-Text ist "%s"', (variant, expectedText) => {
    render(<FahrtmodusCard variant={variant} />);
    expect(screen.getByRole("button", { name: expectedText })).toBeInTheDocument();
  });
});

describe("FahrtmodusCard — Interaktion", () => {
  it("ruft onPrimaryAction auf wenn Button geklickt", () => {
    const onPrimaryAction = vi.fn();
    render(<FahrtmodusCard variant="manuell" onPrimaryAction={onPrimaryAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }));
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  });

  it("kein Fehler wenn onPrimaryAction nicht angegeben und Button geklickt", () => {
    render(<FahrtmodusCard variant="manuell" />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }))
    ).not.toThrow();
  });

  it("onPrimaryAction wird bei jedem Variant ausgelöst", () => {
    for (const v of ["manuell", "autom-nicht-moeglich", "wiederherstellung"] as const) {
      const fn = vi.fn();
      const { unmount } = render(<FahrtmodusCard variant={v} onPrimaryAction={fn} />);
      fireEvent.click(screen.getByRole("button"));
      expect(fn).toHaveBeenCalledTimes(1);
      unmount();
    }
  });
});

describe("FahrtmodusCard — Badge-Farben", () => {
  it('manuell: Badge hat bg-[#353535]', () => {
    const { container } = render(<FahrtmodusCard variant="manuell" />);
    expect(container.querySelector('[class*="353535"]')).toBeInTheDocument();
  });

  it('autom-eingabe: Badge hat bg-[#146AA1]', () => {
    const { container } = render(<FahrtmodusCard variant="autom-eingabe" />);
    expect(container.querySelector('[class*="146AA1"]')).toBeInTheDocument();
  });

  it('autom-nicht-moeglich: Badge hat bg-[#C55141]', () => {
    const { container } = render(<FahrtmodusCard variant="autom-nicht-moeglich" />);
    expect(container.querySelector('[class*="C55141"]')).toBeInTheDocument();
  });

  it('wiederherstellung: Badge hat bg-[#DDB411]', () => {
    const { container } = render(<FahrtmodusCard variant="wiederherstellung" />);
    expect(container.querySelector('[class*="DDB411"]')).toBeInTheDocument();
  });
});

describe("FahrtmodusCard — Eingabefeld", () => {
  it('variant="autom-eingabe" rendert ein Eingabefeld', () => {
    render(<FahrtmodusCard variant="autom-eingabe" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it('andere Varianten rendern kein Eingabefeld', () => {
    for (const v of ["manuell", "autom-nicht-moeglich", "wiederherstellung"] as const) {
      const { unmount } = render(<FahrtmodusCard variant={v} />);
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      unmount();
    }
  });
});
