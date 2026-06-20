import { render, screen, fireEvent } from "@testing-library/react";
import { AktionenPanel } from "./AktionenPanel";

describe("AktionenPanel — Initial-Zustand (Fahrt-Tab)", () => {
  it('zeigt initial den "Fahrt" Tab', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(screen.getByRole("button", { name: /^fahrt$/i })).toBeInTheDocument();
  });

  it("zeigt initial FahrtmodusCard", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });

  it("zeigt initial keinen Nothalt-Button", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(screen.queryByRole("button", { name: /nothalt/i })).not.toBeInTheDocument();
  });
});

describe("AktionenPanel — Tab-Wechsel zu Fahrzeug", () => {
  it('Klick auf "Fahrzeug" Tab zeigt FahrzeugAktionCards', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^fahrzeug$/i }));
    expect(screen.getByRole("button", { name: /nothalt/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /langsam fahren/i })).toBeInTheDocument();
  });

  it('Fahrzeug-Tab versteckt FahrtmodusCard', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^fahrzeug$/i }));
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });
});

describe("AktionenPanel — Tab-Wechsel zu Kommunikation", () => {
  it('Klick auf "Kommunikation" Tab zeigt Platzhalter', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
    expect(screen.getByText(/kommunikation/i)).toBeInTheDocument();
  });

  it('Kommunikation-Tab versteckt FahrtmodusCard', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
    expect(screen.queryByText("Manuell")).not.toBeInTheDocument();
  });
});

describe("AktionenPanel — Zurück zum Fahrt-Tab", () => {
  it('Klick zurück auf "Fahrt" zeigt FahrtmodusCard wieder', () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    fireEvent.click(screen.getByRole("button", { name: /^fahrzeug$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^fahrt$/i }));
    expect(screen.getByText("Manuell")).toBeInTheDocument();
  });
});

describe("AktionenPanel — fahrtmodus-Varianten", () => {
  it.each([
    ["manuell" as const,              "Manuell"],
    ["autom-eingabe" as const,        "Automatisch"],
    ["autom-nicht-moeglich" as const, "Autom. nicht mögl."],
    ["wiederherstellung" as const,    "Wiederherstellung"],
  ])('fahrtmodus="%s" zeigt Label "%s"', (fahrtmodus, label) => {
    render(<AktionenPanel fahrtmodus={fahrtmodus} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

describe("AktionenPanel — onFahrtmodusAction", () => {
  it("ruft onFahrtmodusAction auf wenn FahrtmodusCard-Button geklickt", () => {
    const onFahrtmodusAction = vi.fn();
    render(<AktionenPanel fahrtmodus="manuell" onFahrtmodusAction={onFahrtmodusAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }));
    expect(onFahrtmodusAction).toHaveBeenCalledTimes(1);
  });

  it("kein Fehler wenn onFahrtmodusAction nicht angegeben", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "Auf Automatik umschalten" }))
    ).not.toThrow();
  });
});

describe("AktionenPanel — Edge Cases", () => {
  it("alle drei Tabs klicken wirft keine Fehler", () => {
    render(<AktionenPanel fahrtmodus="manuell" />);
    expect(() => {
      fireEvent.click(screen.getByRole("button", { name: /^fahrzeug$/i }));
      fireEvent.click(screen.getByRole("button", { name: /^kommunikation$/i }));
      fireEvent.click(screen.getByRole("button", { name: /^fahrt$/i }));
    }).not.toThrow();
  });
});
