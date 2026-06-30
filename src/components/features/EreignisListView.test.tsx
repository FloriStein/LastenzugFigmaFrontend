import { render, screen, fireEvent } from "@testing-library/react";
import { EreignisListView } from "./EreignisListView";
import type { Ereignis, EreignisFilter } from "@/types/ereignis";

const MOCK: Ereignis[] = [
  { id: "#103", art: "Kommunikationsanfrage", fahrzeug: "Routenzug B", status: "neu", priorität: 4, erstelltAt: "16:04 Uhr" },
  { id: "#102", art: "Strecke blockiert",     fahrzeug: "Routenzug A", status: "neu", priorität: 3, erstelltAt: "14:28 Uhr" },
  { id: "#101", art: "Verlassen Betriebsgelände", fahrzeug: "Routenzug B", status: "neu", priorität: 1, erstelltAt: "16:02 Uhr" },
  { id: "#100", art: "Sensordefekt",          fahrzeug: "Routenzug A", status: "neu", priorität: 3, erstelltAt: "16:00 Uhr" },
  { id: "#99",  art: "Weiterfahrt bestätigen", fahrzeug: "Routenzug A", status: "in-bearbeitung", bearbeiter: "Maxi Muster", priorität: 1, erstelltAt: "15:26 Uhr" },
  { id: "#96",  art: "Strecke blockiert",     fahrzeug: "Routenzug A", status: "warten", bearbeiter: "Tim Zabel", priorität: 3, erstelltAt: "14:28 Uhr" },
  { id: "#95",  art: "Strecke blockiert",     fahrzeug: "Routenzug A", status: "abgeschlossen", bearbeiter: "Tim Zabel", priorität: 1, erstelltAt: "6. Aug, 14:28 Uhr" },
];

function renderView(overrides: Partial<Parameters<typeof EreignisListView>[0]> = {}) {
  const props = {
    ereignisse: MOCK,
    activeTab: "alle" as const,
    onTabChange: vi.fn(),
    searchValue: "",
    onSearchChange: vi.fn(),
    ...overrides,
  };
  return render(<EreignisListView {...props} />);
}

describe("EreignisListView — Tabs", () => {
  it('zeigt alle 3 Tabs: Alle, Offen, Archiv', () => {
    renderView();
    expect(screen.getByRole("tab", { name: "Alle" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Offen" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Archiv" })).toBeInTheDocument();
  });

  it('ruft onTabChange mit "offen" wenn Offen-Tab geklickt', () => {
    const onTabChange = vi.fn();
    renderView({ onTabChange });
    fireEvent.click(screen.getByRole("tab", { name: "Offen" }));
    expect(onTabChange).toHaveBeenCalledWith("offen");
  });

  it('ruft onTabChange mit "archiv" wenn Archiv-Tab geklickt', () => {
    const onTabChange = vi.fn();
    renderView({ onTabChange });
    fireEvent.click(screen.getByRole("tab", { name: "Archiv" }));
    expect(onTabChange).toHaveBeenCalledWith("archiv");
  });

  it('ruft onTabChange mit "alle" wenn Alle-Tab geklickt', () => {
    const onTabChange = vi.fn();
    renderView({ activeTab: "offen", onTabChange });
    fireEvent.click(screen.getByRole("tab", { name: "Alle" }));
    expect(onTabChange).toHaveBeenCalledWith("alle");
  });
});

describe("EreignisListView — Filterung nach Tab", () => {
  it('activeTab="alle" zeigt alle 7 Ereignisse', () => {
    renderView({ activeTab: "alle" });
    expect(screen.getAllByText(/^#\d+$/).length).toBe(7);
  });

  it('activeTab="offen" zeigt 5 Einträge (status=neu oder warten)', () => {
    renderView({ activeTab: "offen" });
    const ids = screen.getAllByText(/^#\d+$/);
    expect(ids.length).toBe(5);
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.getByText("#100")).toBeInTheDocument();
    expect(screen.getByText("#96")).toBeInTheDocument();
    expect(screen.queryByText("#99")).not.toBeInTheDocument();
    expect(screen.queryByText("#95")).not.toBeInTheDocument();
  });

  it('activeTab="archiv" zeigt 1 Eintrag (status=abgeschlossen)', () => {
    renderView({ activeTab: "archiv" });
    expect(screen.getAllByText(/^#\d+$/).length).toBe(1);
    expect(screen.getByText("#95")).toBeInTheDocument();
  });
});

describe("EreignisListView — Suche", () => {
  it('suche nach "Strecke" liefert 3 Treffer (Ereignisart)', () => {
    renderView({ searchValue: "Strecke" });
    expect(screen.getAllByText(/^#\d+$/).length).toBe(3);
    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.getByText("#96")).toBeInTheDocument();
    expect(screen.getByText("#95")).toBeInTheDocument();
  });

  it('suche ist case-insensitiv ("strecke" findet dieselben 3 Treffer wie "Strecke")', () => {
    renderView({ searchValue: "strecke" });
    expect(screen.getAllByText(/^#\d+$/).length).toBe(3);
  });

  it('suche nach Fahrzeug "Routenzug B" liefert 2 Treffer', () => {
    renderView({ searchValue: "Routenzug B" });
    expect(screen.getAllByText(/^#\d+$/).length).toBe(2);
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#101")).toBeInTheDocument();
  });

  it('suche ohne Treffer zeigt keine Zeilen', () => {
    renderView({ searchValue: "gibts-nicht" });
    expect(screen.queryAllByText(/^#\d+$/).length).toBe(0);
  });

  it("ruft onSearchChange auf wenn in SearchBar getippt wird", () => {
    const onSearchChange = vi.fn();
    renderView({ onSearchChange });
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Test" } });
    expect(onSearchChange).toHaveBeenCalledWith("Test");
  });

  it('suche + Tab-Filter kombinieren sich: "Strecke" im "offen"-Tab = 2 Treffer', () => {
    renderView({ searchValue: "Strecke", activeTab: "offen" });
    expect(screen.getAllByText(/^#\d+$/).length).toBe(2);
    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.getByText("#96")).toBeInTheDocument();
  });
});

describe("EreignisListView — Spaltenheader & Toolbar", () => {
  it("zeigt alle 7 Spaltenheader", () => {
    renderView();
    expect(screen.getByText("Ereignis-ID")).toBeInTheDocument();
    expect(screen.getByText("Ereignisart")).toBeInTheDocument();
    expect(screen.getByText("Fahrzeug")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Bearbeiter")).toBeInTheDocument();
    expect(screen.getByText("Priorität")).toBeInTheDocument();
    expect(screen.getByText("Erstellt")).toBeInTheDocument();
  });

  it("zeigt 2 Filter-Badges in der Toolbar", () => {
    renderView();
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("Fahrzeug:")).toBeInTheDocument();
  });

  it('zeigt "neuer Filter" und "als Ansicht speichern" Buttons', () => {
    renderView();
    expect(screen.getByText("neuer Filter")).toBeInTheDocument();
    expect(screen.getByText("als Ansicht speichern")).toBeInTheDocument();
  });
});

describe("EreignisListView — Row-Verlinkung", () => {
  const BASE_EREIGNISSE = [
    { id: "#102", art: "Strecke blockiert", fahrzeug: "Routenzug A",
      status: "neu" as const, priorität: 3 as const, erstelltAt: "14:28 Uhr" },
    { id: "#99", art: "Weiterfahrt bestätigen", fahrzeug: "Routenzug A",
      status: "in-bearbeitung" as const, priorität: 1 as const, erstelltAt: "15:26 Uhr",
      bearbeiter: "Maxi Muster" },
  ];

  const BASE_PROPS = {
    ereignisse: BASE_EREIGNISSE,
    activeTab: "alle" as const,
    onTabChange: vi.fn(),
    searchValue: "",
    onSearchChange: vi.fn(),
  };

  it("ruft onRowClick mit der Ereignis-ID auf wenn Row geklickt", () => {
    const onRowClick = vi.fn();
    render(<EreignisListView {...BASE_PROPS} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByText("#102"));
    expect(onRowClick).toHaveBeenCalledWith("#102");
  });

  it("ruft onRowClick mit der richtigen ID auf (zweite Row)", () => {
    const onRowClick = vi.fn();
    render(<EreignisListView {...BASE_PROPS} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByText("#99"));
    expect(onRowClick).toHaveBeenCalledWith("#99");
  });

  it("kein Fehler wenn onRowClick nicht angegeben und Row geklickt", () => {
    render(<EreignisListView {...BASE_PROPS} />);
    expect(() => fireEvent.click(screen.getByText("#102"))).not.toThrow();
  });

  it("onRowClick wird nicht aufgerufen wenn nicht angegeben", () => {
    const onRowClick = vi.fn();
    render(<EreignisListView {...BASE_PROPS} />);
    fireEvent.click(screen.getByText("#102"));
    expect(onRowClick).not.toHaveBeenCalled();
  });
});

const EMPTY_FILTER: EreignisFilter = { status: [], priorität: [], fahrzeug: "" };

describe("EreignisListView — FD-01: Filter nach EreignisFilter", () => {
  it("kein filter-Prop → alle Ereignisse des aktiven Tabs sichtbar", () => {
    renderView({ activeTab: "alle" });
    expect(screen.getAllByText(/^#\d+$/).length).toBe(7);
  });

  it("filter.status=['neu'] → nur 'neu'-Ereignisse sichtbar", () => {
    renderView({ filter: { ...EMPTY_FILTER, status: ["neu"] } });
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.queryByText("#99")).not.toBeInTheDocument();
    expect(screen.queryByText("#96")).not.toBeInTheDocument();
    expect(screen.queryByText("#95")).not.toBeInTheDocument();
  });

  it("filter.status=['abgeschlossen'] → nur abgeschlossene sichtbar", () => {
    renderView({ filter: { ...EMPTY_FILTER, status: ["abgeschlossen"] } });
    expect(screen.getByText("#95")).toBeInTheDocument();
    expect(screen.queryByText("#103")).not.toBeInTheDocument();
  });

  it("filter.status=['neu','warten'] → beide Status-Gruppen sichtbar", () => {
    renderView({ filter: { ...EMPTY_FILTER, status: ["neu", "warten"] } });
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#96")).toBeInTheDocument();
    expect(screen.queryByText("#99")).not.toBeInTheDocument();
  });

  it("filter.priorität=[3] → nur Priorität-3-Ereignisse sichtbar", () => {
    renderView({ filter: { ...EMPTY_FILTER, priorität: [3] } });
    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.getByText("#100")).toBeInTheDocument();
    expect(screen.getByText("#96")).toBeInTheDocument();
    expect(screen.queryByText("#103")).not.toBeInTheDocument();
    expect(screen.queryByText("#99")).not.toBeInTheDocument();
  });

  it("filter.fahrzeug='Routenzug B' → case-insensitive, nur B-Fahrzeuge", () => {
    renderView({ filter: { ...EMPTY_FILTER, fahrzeug: "Routenzug B" } });
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.queryByText("#102")).not.toBeInTheDocument();
  });

  it("filter.fahrzeug='routenzug b' → case-insensitiv gefunden", () => {
    renderView({ filter: { ...EMPTY_FILTER, fahrzeug: "routenzug b" } });
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.queryByText("#102")).not.toBeInTheDocument();
  });

  it("filter.fahrzeug='xxxxxxxxxxx' → keine Treffer", () => {
    renderView({ filter: { ...EMPTY_FILTER, fahrzeug: "xxxxxxxxxxx" } });
    expect(screen.queryAllByText(/^#\d+$/).length).toBe(0);
  });

  it("Tab-Filter + EreignisFilter kombinieren sich", () => {
    renderView({
      activeTab: "offen",
      filter: { ...EMPTY_FILTER, fahrzeug: "Routenzug B" },
    });
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.queryByText("#95")).not.toBeInTheDocument();
  });

  it("Suche + EreignisFilter kombinieren sich", () => {
    renderView({
      searchValue: "Strecke",
      filter: { ...EMPTY_FILTER, status: ["neu"] },
    });
    expect(screen.getByText("#102")).toBeInTheDocument();
    expect(screen.queryByText("#96")).not.toBeInTheDocument();
    expect(screen.queryByText("#95")).not.toBeInTheDocument();
  });
});

describe("EreignisListView — FD-01: Filter-Badges & Callbacks", () => {
  it("'neuer Filter' Button ruft onFilterOpen auf", () => {
    const onFilterOpen = vi.fn();
    renderView({ onFilterOpen });
    fireEvent.click(screen.getByText("neuer Filter"));
    expect(onFilterOpen).toHaveBeenCalledTimes(1);
  });

  it("kein onFilterOpen → kein Fehler bei Klick auf 'neuer Filter'", () => {
    renderView();
    expect(() => fireEvent.click(screen.getByText("neuer Filter"))).not.toThrow();
  });

  it("filter.status=['neu'] → Badge zeigt 'neu', nicht 'alle'", () => {
    renderView({ filter: { ...EMPTY_FILTER, status: ["neu"] } });
    expect(screen.queryByRole("button", { name: /Status:.*alle/ })).not.toBeInTheDocument();
    const statusBadge = screen.getAllByRole("button").find(
      (b) => b.textContent?.includes("Status:") && b.textContent?.includes("neu")
    );
    expect(statusBadge).toBeInTheDocument();
  });

  it("filter.fahrzeug='Routenzug B' → Fahrzeug-Badge zeigt 'Routenzug B'", () => {
    renderView({ filter: { ...EMPTY_FILTER, fahrzeug: "Routenzug B" } });
    const badge = screen.getAllByRole("button").find(
      (b) => b.textContent?.includes("Fahrzeug:") && b.textContent?.includes("Routenzug B")
    );
    expect(badge).toBeInTheDocument();
  });

  it("onFilterRemove('status') wird aufgerufen wenn Status-Badge × geklickt", () => {
    const onFilterRemove = vi.fn();
    renderView({
      filter: { ...EMPTY_FILTER, status: ["neu"] },
      onFilterRemove,
    });
    const removeButtons = screen.getAllByRole("button", { name: "×" });
    fireEvent.click(removeButtons[0]);
    expect(onFilterRemove).toHaveBeenCalledWith("status");
  });

  it("onFilterRemove('fahrzeug') wird aufgerufen wenn Fahrzeug-Badge × geklickt", () => {
    const onFilterRemove = vi.fn();
    renderView({
      filter: { ...EMPTY_FILTER, fahrzeug: "Routenzug A" },
      onFilterRemove,
    });
    const removeButton = screen.getByRole("button", { name: "×" });
    fireEvent.click(removeButton);
    expect(onFilterRemove).toHaveBeenCalledWith("fahrzeug");
  });
});
