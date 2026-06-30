import { render, screen, fireEvent } from "@testing-library/react";
import { AuftragFilterDialog } from "./AuftragFilterDialog";
import type { AuftragFilter } from "@/types/auftrag";

const EMPTY_FILTER: AuftragFilter = { status: [], art: [] };

function renderOpen(overrides: Partial<Parameters<typeof AuftragFilterDialog>[0]> = {}) {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    initialFilter: EMPTY_FILTER,
    onApply: vi.fn(),
    ...overrides,
  };
  return { ...render(<AuftragFilterDialog {...props} />), ...props };
}

describe("AuftragFilterDialog — Sichtbarkeit", () => {
  it("rendert nicht wenn open=false", () => {
    render(<AuftragFilterDialog open={false} onOpenChange={vi.fn()} initialFilter={EMPTY_FILTER} onApply={vi.fn()} />);
    expect(screen.queryByText("Filter")).not.toBeInTheDocument();
  });

  it("zeigt Titel 'Filter' wenn open=true", () => {
    renderOpen();
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("zeigt 'Anwenden' und 'Abbrechen' Buttons", () => {
    renderOpen();
    expect(screen.getByRole("button", { name: "Anwenden" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abbrechen" })).toBeInTheDocument();
  });
});

describe("AuftragFilterDialog — Status-Checkboxen", () => {
  it("zeigt 3 Status-Optionen", () => {
    renderOpen();
    expect(screen.getByRole("checkbox", { name: "Aktiv" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Geplant" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Unterbrochen" })).toBeInTheDocument();
  });

  it("alle Checkboxen initial deaktiviert", () => {
    renderOpen();
    screen.getAllByRole("checkbox").forEach((cb) => {
      expect(cb).not.toBeChecked();
    });
  });

  it("initialFilter.status=['aktiv'] → 'Aktiv' vorausgewählt", () => {
    renderOpen({ initialFilter: { ...EMPTY_FILTER, status: ["aktiv"] } });
    expect(screen.getByRole("checkbox", { name: "Aktiv" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Geplant" })).not.toBeChecked();
  });

  it("Klick auf 'Geplant' aktiviert die Checkbox", () => {
    renderOpen();
    fireEvent.click(screen.getByRole("checkbox", { name: "Geplant" }));
    expect(screen.getByRole("checkbox", { name: "Geplant" })).toBeChecked();
  });

  it("zweiter Klick deaktiviert die Checkbox wieder", () => {
    renderOpen();
    fireEvent.click(screen.getByRole("checkbox", { name: "Unterbrochen" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Unterbrochen" }));
    expect(screen.getByRole("checkbox", { name: "Unterbrochen" })).not.toBeChecked();
  });

  it("mehrere Status gleichzeitig aktivierbar", () => {
    renderOpen();
    fireEvent.click(screen.getByRole("checkbox", { name: "Aktiv" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Geplant" }));
    expect(screen.getByRole("checkbox", { name: "Aktiv" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Geplant" })).toBeChecked();
  });
});

describe("AuftragFilterDialog — Art-Checkboxen", () => {
  it("zeigt 3 Auftragsart-Optionen", () => {
    renderOpen();
    expect(screen.getByRole("checkbox", { name: "Lieferauftrag" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Mitarbeitertransport" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Leerfahrt" })).toBeInTheDocument();
  });

  it("initialFilter.art=['Leerfahrt'] → 'Leerfahrt' vorausgewählt", () => {
    renderOpen({ initialFilter: { ...EMPTY_FILTER, art: ["Leerfahrt"] } });
    expect(screen.getByRole("checkbox", { name: "Leerfahrt" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Lieferauftrag" })).not.toBeChecked();
  });

  it("Klick auf 'Mitarbeitertransport' wählt es aus", () => {
    renderOpen();
    fireEvent.click(screen.getByRole("checkbox", { name: "Mitarbeitertransport" }));
    expect(screen.getByRole("checkbox", { name: "Mitarbeitertransport" })).toBeChecked();
  });
});

describe("AuftragFilterDialog — Anwenden", () => {
  it("'Anwenden' ruft onApply mit ausgewählten Status auf", () => {
    const onApply = vi.fn();
    renderOpen({ onApply });
    fireEvent.click(screen.getByRole("checkbox", { name: "Aktiv" }));
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ status: ["aktiv"] }));
  });

  it("'Anwenden' ruft onApply mit ausgewählter Art auf", () => {
    const onApply = vi.fn();
    renderOpen({ onApply });
    fireEvent.click(screen.getByRole("checkbox", { name: "Leerfahrt" }));
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ art: ["Leerfahrt"] }));
  });

  it("'Anwenden' schließt den Dialog", () => {
    const onOpenChange = vi.fn();
    renderOpen({ onOpenChange });
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("'Anwenden' ohne Selektion übergibt leeren Filter", () => {
    const onApply = vi.fn();
    renderOpen({ onApply });
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    expect(onApply).toHaveBeenCalledWith(EMPTY_FILTER);
  });

  it("kombinierte Status + Art Selektion wird korrekt übergeben", () => {
    const onApply = vi.fn();
    renderOpen({ onApply });
    fireEvent.click(screen.getByRole("checkbox", { name: "Aktiv" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Lieferauftrag" }));
    fireEvent.click(screen.getByRole("button", { name: "Anwenden" }));
    const applied: AuftragFilter = onApply.mock.calls[0][0];
    expect(applied.status).toContain("aktiv");
    expect(applied.art).toContain("Lieferauftrag");
  });
});

describe("AuftragFilterDialog — Abbrechen", () => {
  it("'Abbrechen' ruft onApply nicht auf", () => {
    const onApply = vi.fn();
    renderOpen({ onApply });
    fireEvent.click(screen.getByRole("checkbox", { name: "Aktiv" }));
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(onApply).not.toHaveBeenCalled();
  });

  it("'Abbrechen' schließt den Dialog", () => {
    const onOpenChange = vi.fn();
    renderOpen({ onOpenChange });
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
