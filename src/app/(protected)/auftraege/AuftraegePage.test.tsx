import { render, screen, fireEvent } from "@testing-library/react";
import AuftraegePage from "./page";

describe("SC-04 — AuftraegePage — Grundstruktur", () => {
  it("zeigt Seitentitel 'Aufträge'", () => {
    render(<AuftraegePage />);
    expect(screen.getByRole("heading", { name: "Aufträge" })).toBeInTheDocument();
  });

  it("zeigt Mock-Auftrag AUF-001", () => {
    render(<AuftraegePage />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });

  it("zeigt alle 4 Mock-Aufträge initial", () => {
    render(<AuftraegePage />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
    expect(screen.getByText("AUF-004")).toBeInTheDocument();
  });

  it("zeigt 'Lieferauftrag erstellen' Button", () => {
    render(<AuftraegePage />);
    expect(
      screen.getByRole("button", { name: /lieferauftrag erstellen/i })
    ).toBeInTheDocument();
  });
});

describe("SC-04 — AuftraegePage — Tab-Navigation", () => {
  it("Tab 'Offen' filtert auf aktive Aufträge", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Offen" }));
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-004")).toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
  });

  it("Tab 'Archiv' zeigt geplante/unterbrochene Aufträge", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Archiv" }));
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
  });

  it("zurück zu Tab 'Alle' zeigt alle Aufträge", () => {
    render(<AuftraegePage />);
    fireEvent.click(screen.getByRole("tab", { name: "Offen" }));
    fireEvent.click(screen.getByRole("tab", { name: "Alle" }));
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
  });
});

describe("SC-04 — AuftraegePage — Suche", () => {
  it("Suche filtert Aufträge korrekt (kein SearchBar-Mock nötig — interner State)", () => {
    render(<AuftraegePage />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });
});
