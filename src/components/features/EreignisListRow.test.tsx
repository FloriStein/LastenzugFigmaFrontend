import { render, screen, fireEvent } from "@testing-library/react";
import { EreignisListRow } from "./EreignisListRow";

const BASE_PROPS = {
  id: "#103",
  art: "Strecke blockiert",
  fahrzeug: "Routenzug A",
  status: "neu" as const,
  priorität: 3 as const,
  erstelltAt: "14:28 Uhr",
};

describe("EreignisListRow", () => {
  it("rendert alle Spalteninhalte", () => {
    render(<EreignisListRow {...BASE_PROPS} />);
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("Strecke blockiert")).toBeInTheDocument();
    expect(screen.getByText("Routenzug A")).toBeInTheDocument();
    expect(screen.getByText("neu")).toBeInTheDocument();
    expect(screen.getByText("14:28 Uhr")).toBeInTheDocument();
  });

  it('zeigt [offen] wenn kein Bearbeiter angegeben', () => {
    render(<EreignisListRow {...BASE_PROPS} />);
    expect(screen.getByText("[offen]")).toBeInTheDocument();
  });

  it("zeigt Bearbeiternamen wenn angegeben", () => {
    render(<EreignisListRow {...BASE_PROPS} bearbeiter="Maxi Muster" />);
    expect(screen.getByText("Maxi Muster")).toBeInTheDocument();
    expect(screen.queryByText("[offen]")).not.toBeInTheDocument();
  });

  it("rendert PrioritätBadge als SVG mit 4 Circles", () => {
    const { container } = render(<EreignisListRow {...BASE_PROPS} priorität={3} />);
    expect(container.querySelectorAll("circle")).toHaveLength(4);
  });

  it.each([
    ["neu" as const],
    ["warten" as const],
  ])("status=%s hat text-black Klasse (aktiv)", (status) => {
    const { container } = render(<EreignisListRow {...BASE_PROPS} status={status} />);
    const row = container.firstChild as HTMLElement;
    expect(row.className).toContain("text-black");
    expect(row.className).not.toContain("text-[#646A79]");
  });

  it.each([
    ["in-bearbeitung" as const],
    ["abgeschlossen" as const],
  ])("status=%s hat text-[#646A79] Klasse (gedimmt)", (status) => {
    const { container } = render(<EreignisListRow {...BASE_PROPS} status={status} />);
    const row = container.firstChild as HTMLElement;
    expect(row.className).toContain("text-[#646A79]");
    expect(row.className).not.toContain("text-black");
  });

  it("ruft onClick auf wenn Zeile geklickt wird", () => {
    const onClick = vi.fn();
    const { container } = render(<EreignisListRow {...BASE_PROPS} onClick={onClick} />);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("kein Cursor-Pointer ohne onClick", () => {
    const { container } = render(<EreignisListRow {...BASE_PROPS} />);
    const row = container.firstChild as HTMLElement;
    expect(row.className).not.toContain("cursor-pointer");
  });

  it("hat cursor-pointer mit onClick", () => {
    const { container } = render(<EreignisListRow {...BASE_PROPS} onClick={() => {}} />);
    const row = container.firstChild as HTMLElement;
    expect(row.className).toContain("cursor-pointer");
  });
});

describe("EreignisListRow — SL-01: Betroffen-Spalte", () => {
  it("kein showBetroffen → betroffen-Text nicht sichtbar", () => {
    render(<EreignisListRow {...BASE_PROPS} betroffen="Mitarbeitertransport" />);
    expect(screen.queryByText("Mitarbeitertransport")).not.toBeInTheDocument();
  });

  it("showBetroffen=true + betroffen-Wert → zeigt betroffen-Text", () => {
    render(<EreignisListRow {...BASE_PROPS} showBetroffen betroffen="Mitarbeitertransport" />);
    expect(screen.getByText("Mitarbeitertransport")).toBeInTheDocument();
  });

  it("showBetroffen=true + kein betroffen-Prop → zeigt '—'", () => {
    render(<EreignisListRow {...BASE_PROPS} showBetroffen />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("showBetroffen=true + betroffen=undefined → zeigt '—'", () => {
    render(<EreignisListRow {...BASE_PROPS} showBetroffen betroffen={undefined} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("showBetroffen=true → Grid enthält 250px Spalte", () => {
    const { container } = render(<EreignisListRow {...BASE_PROPS} showBetroffen />);
    const row = container.firstChild as HTMLElement;
    expect(row.className).toContain("250px");
  });

  it("showBetroffen=false → kein 250px im Grid", () => {
    const { container } = render(<EreignisListRow {...BASE_PROPS} />);
    const row = container.firstChild as HTMLElement;
    expect(row.className).not.toContain("250px");
  });

  it("betroffen-Wert mit Komma wird vollständig angezeigt", () => {
    render(
      <EreignisListRow
        {...BASE_PROPS}
        showBetroffen
        betroffen="Produktion A, Mitarbeitertransport"
      />
    );
    expect(screen.getByText("Produktion A, Mitarbeitertransport")).toBeInTheDocument();
  });

  it("showBetroffen ändert die anderen Spalteninhalte nicht", () => {
    render(<EreignisListRow {...BASE_PROPS} showBetroffen betroffen="Zone X" />);
    expect(screen.getByText("#103")).toBeInTheDocument();
    expect(screen.getByText("Strecke blockiert")).toBeInTheDocument();
    expect(screen.getByText("Routenzug A")).toBeInTheDocument();
    expect(screen.getByText("14:28 Uhr")).toBeInTheDocument();
  });
});
