import { render, screen, fireEvent } from "@testing-library/react";
import { AuftragListView } from "./AuftragListView";
import type { AuftragFilter } from "@/types/auftrag";

const MOCK_AUFTRÄGE = [
  {
    id: "AUF-001",
    linie: "L1",
    art: "Lieferauftrag",
    von: "Lager A",
    ab: "08:00",
    ziel: "Hauptgebäude",
    auftraggeber: "Sabine M.",
    status: "aktiv" as const,
    ankunft: "08:45",
  },
  {
    id: "AUF-002",
    linie: "L2",
    art: "Mitarbeitertransport",
    von: "Lager B",
    ab: "09:30",
    ziel: "Büro West",
    auftraggeber: "Jonas M.",
    status: "geplant" as const,
    ankunft: "10:00",
  },
  {
    id: "AUF-003",
    art: "Leerfahrt",
    von: "Haltestelle C",
    ab: "11:00",
    ziel: "Lager F",
    auftraggeber: "System",
    status: "unterbrochen" as const,
    ankunft: "11:30",
  },
];

const BASE_PROPS = {
  aufträge: MOCK_AUFTRÄGE,
  activeTab: "alle" as const,
  onTabChange: vi.fn(),
  searchValue: "",
  onSearchChange: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe("AuftragListView — Grundstruktur", () => {
  it("zeigt alle Aufträge im Tab 'Alle'", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
  });

  it("zeigt Tabs 'Alle', 'Offen', 'Archiv'", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByRole("tab", { name: "Alle" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Offen" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Archiv" })).toBeInTheDocument();
  });

  it("zeigt 'Lieferauftrag erstellen' Button", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByRole("button", { name: /lieferauftrag erstellen/i })).toBeInTheDocument();
  });

  it("zeigt Spalten-Header 'ID'", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
  });

  it("zeigt Spalten-Header 'Status / Ankunft'", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByText("Status / Ankunft")).toBeInTheDocument();
  });
});

describe("AuftragListView — Tab-Filterung", () => {
  it("Tab 'Offen' → nur aktive Aufträge", () => {
    render(<AuftragListView {...BASE_PROPS} activeTab="offen" />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
    expect(screen.queryByText("AUF-003")).not.toBeInTheDocument();
  });

  it("Tab 'Archiv' → nur geplante und unterbrochene Aufträge", () => {
    render(<AuftragListView {...BASE_PROPS} activeTab="archiv" />);
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
  });

  it("Tab 'Alle' → alle Aufträge sichtbar", () => {
    render(<AuftragListView {...BASE_PROPS} activeTab="alle" />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
  });
});

describe("AuftragListView — Suche", () => {
  it("Suche nach ID filtert korrekt", () => {
    render(<AuftragListView {...BASE_PROPS} searchValue="AUF-001" />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
  });

  it("Suche nach Art filtert korrekt", () => {
    render(<AuftragListView {...BASE_PROPS} searchValue="Leerfahrt" />);
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
  });

  it("keine Treffer → Leer-State 'Keine Aufträge gefunden.'", () => {
    render(<AuftragListView {...BASE_PROPS} searchValue="XXXXXX" />);
    expect(screen.getByText("Keine Aufträge gefunden.")).toBeInTheDocument();
  });

  it("Suche ist Case-Insensitive", () => {
    render(<AuftragListView {...BASE_PROPS} searchValue="lieferauftrag" />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });
});

describe("AuftragListView — Klick-Interaktion", () => {
  it("Klick auf Zeile ruft onRowClick mit ID auf", () => {
    const onRowClick = vi.fn();
    render(<AuftragListView {...BASE_PROPS} onRowClick={onRowClick} />);
    fireEvent.click(screen.getAllByRole("row")[0]);
    expect(onRowClick).toHaveBeenCalledWith("AUF-001");
  });

  it("'Lieferauftrag erstellen' ruft onNeuErstellen auf", () => {
    const onNeuErstellen = vi.fn();
    render(<AuftragListView {...BASE_PROPS} onNeuErstellen={onNeuErstellen} />);
    fireEvent.click(screen.getByRole("button", { name: /lieferauftrag erstellen/i }));
    expect(onNeuErstellen).toHaveBeenCalledTimes(1);
  });

  it("Tab-Klick ruft onTabChange auf", () => {
    const onTabChange = vi.fn();
    render(<AuftragListView {...BASE_PROPS} onTabChange={onTabChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Offen" }));
    expect(onTabChange).toHaveBeenCalledWith("offen");
  });
});

describe("AuftragListView — Edge Cases", () => {
  it("leere Auftragsliste → Leer-State sichtbar", () => {
    render(<AuftragListView {...BASE_PROPS} aufträge={[]} />);
    expect(screen.getByText("Keine Aufträge gefunden.")).toBeInTheDocument();
  });

  it("kein onRowClick → kein Fehler bei Klick", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(() => fireEvent.click(screen.getAllByRole("row")[0])).not.toThrow();
  });

  it("kein onNeuErstellen → kein Fehler bei Klick auf 'Erstellen'", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: /lieferauftrag erstellen/i }))
    ).not.toThrow();
  });

  it("einziger Auftrag bleibt nach Suche sichtbar", () => {
    render(<AuftragListView {...BASE_PROPS} aufträge={[MOCK_AUFTRÄGE[0]]} searchValue="AUF" />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
  });
});

const EMPTY_FILTER: AuftragFilter = { status: [], art: [] };

describe("AuftragListView — FD-02: Filter nach AuftragFilter", () => {
  it("kein filter-Prop → alle Aufträge sichtbar", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
  });

  it("filter.status=['aktiv'] → nur aktive Aufträge", () => {
    render(<AuftragListView {...BASE_PROPS} filter={{ ...EMPTY_FILTER, status: ["aktiv"] }} />);
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
    expect(screen.queryByText("AUF-003")).not.toBeInTheDocument();
  });

  it("filter.status=['geplant','unterbrochen'] → AUF-002 und AUF-003", () => {
    render(
      <AuftragListView
        {...BASE_PROPS}
        filter={{ ...EMPTY_FILTER, status: ["geplant", "unterbrochen"] }}
      />
    );
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
  });

  it("filter.art=['Leerfahrt'] → nur AUF-003", () => {
    render(<AuftragListView {...BASE_PROPS} filter={{ ...EMPTY_FILTER, art: ["Leerfahrt"] }} />);
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
  });

  it("filter.art=['Lieferauftrag','Mitarbeitertransport'] → AUF-001 und AUF-002", () => {
    render(
      <AuftragListView
        {...BASE_PROPS}
        filter={{ ...EMPTY_FILTER, art: ["Lieferauftrag", "Mitarbeitertransport"] }}
      />
    );
    expect(screen.getByText("AUF-001")).toBeInTheDocument();
    expect(screen.getByText("AUF-002")).toBeInTheDocument();
    expect(screen.queryByText("AUF-003")).not.toBeInTheDocument();
  });

  it("kombination status + art → nur Schnittmenge", () => {
    render(
      <AuftragListView
        {...BASE_PROPS}
        filter={{ status: ["aktiv"], art: ["Mitarbeitertransport"] }}
      />
    );
    expect(screen.queryByText("AUF-001")).not.toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
    expect(screen.getByText("Keine Aufträge gefunden.")).toBeInTheDocument();
  });

  it("Tab-Filter + AuftragFilter kombinieren sich", () => {
    render(
      <AuftragListView
        {...BASE_PROPS}
        activeTab="archiv"
        filter={{ ...EMPTY_FILTER, art: ["Leerfahrt"] }}
      />
    );
    expect(screen.getByText("AUF-003")).toBeInTheDocument();
    expect(screen.queryByText("AUF-002")).not.toBeInTheDocument();
  });
});

describe("AuftragListView — FD-02: Filter-Badges & Callbacks", () => {
  it("zeigt 'neuer Filter' Button", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(screen.getByRole("button", { name: /neuer Filter/i })).toBeInTheDocument();
  });

  it("'neuer Filter' ruft onFilterOpen auf", () => {
    const onFilterOpen = vi.fn();
    render(<AuftragListView {...BASE_PROPS} onFilterOpen={onFilterOpen} />);
    fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }));
    expect(onFilterOpen).toHaveBeenCalledTimes(1);
  });

  it("kein onFilterOpen → kein Fehler bei Klick", () => {
    render(<AuftragListView {...BASE_PROPS} />);
    expect(() => fireEvent.click(screen.getByRole("button", { name: /neuer Filter/i }))).not.toThrow();
  });

  it("filter.status=['aktiv'] → Status-Badge zeigt 'aktiv'", () => {
    render(<AuftragListView {...BASE_PROPS} filter={{ ...EMPTY_FILTER, status: ["aktiv"] }} />);
    const badge = screen.getAllByRole("button").find(
      (b) => b.textContent?.includes("Status:") && b.textContent?.includes("aktiv")
    );
    expect(badge).toBeInTheDocument();
  });

  it("filter.art=['Leerfahrt'] → Art-Badge zeigt 'Leerfahrt'", () => {
    render(<AuftragListView {...BASE_PROPS} filter={{ ...EMPTY_FILTER, art: ["Leerfahrt"] }} />);
    const badge = screen.getAllByRole("button").find(
      (b) => b.textContent?.includes("Art:") && b.textContent?.includes("Leerfahrt")
    );
    expect(badge).toBeInTheDocument();
  });

  it("onFilterRemove('status') aufgerufen wenn Status-Badge × geklickt", () => {
    const onFilterRemove = vi.fn();
    render(
      <AuftragListView
        {...BASE_PROPS}
        filter={{ ...EMPTY_FILTER, status: ["aktiv"] }}
        onFilterRemove={onFilterRemove}
      />
    );
    fireEvent.click(screen.getAllByRole("button", { name: "×" })[0]);
    expect(onFilterRemove).toHaveBeenCalledWith("status");
  });

  it("onFilterRemove('art') aufgerufen wenn Art-Badge × geklickt", () => {
    const onFilterRemove = vi.fn();
    render(
      <AuftragListView
        {...BASE_PROPS}
        filter={{ ...EMPTY_FILTER, art: ["Leerfahrt"] }}
        onFilterRemove={onFilterRemove}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "×" }));
    expect(onFilterRemove).toHaveBeenCalledWith("art");
  });
});
