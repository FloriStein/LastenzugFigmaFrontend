import { render, screen, fireEvent } from "@testing-library/react";
import { RoutenzugCard } from "./RoutenzugCard";

const BASE_PROPS = {
  name: "Routenzug A",
  aufträge: ["#212", "#209"],
  status: "fahrt-unterbrochen" as const,
};

describe("RoutenzugCard — Inhalt", () => {
  it("rendert den Namen", () => {
    render(<RoutenzugCard {...BASE_PROPS} />);
    expect(screen.getByText("Routenzug A")).toBeInTheDocument();
  });

  it("rendert Lieferungen für nicht-leere aufträge", () => {
    render(<RoutenzugCard {...BASE_PROPS} aufträge={["#212", "#209"]} />);
    expect(screen.getByText("Lieferungen: #212, #209")).toBeInTheDocument();
  });

  it("rendert einzelnen Auftrag ohne Komma", () => {
    render(<RoutenzugCard {...BASE_PROPS} aufträge={["#212"]} />);
    expect(screen.getByText("Lieferungen: #212")).toBeInTheDocument();
  });

  it("rendert 'keine Lieferungen' bei leerer aufträge-Liste", () => {
    render(<RoutenzugCard {...BASE_PROPS} aufträge={[]} />);
    expect(screen.getByText("keine Lieferungen")).toBeInTheDocument();
  });

  it("'keine Lieferungen' hat Farbe text-[#353535]", () => {
    const { container } = render(<RoutenzugCard {...BASE_PROPS} aufträge={[]} />);
    const span = container.querySelector('[class*="353535"]') as HTMLElement;
    expect(span).toBeInTheDocument();
    expect(span.textContent).toBe("keine Lieferungen");
  });

  it("Lieferungstext bei nicht-leerer Liste hat text-black", () => {
    const { container } = render(<RoutenzugCard {...BASE_PROPS} aufträge={["#1"]} />);
    const spans = container.querySelectorAll("span");
    const aufträgSpan = Array.from(spans).find((s) => s.textContent?.startsWith("Lieferungen"));
    expect(aufträgSpan?.className).toContain("text-black");
    expect(aufträgSpan?.className).not.toContain("353535");
  });
});

describe("RoutenzugCard — StatusBadge", () => {
  it('status="fahrt-unterbrochen" zeigt "Fahrt unterbrochen"', () => {
    render(<RoutenzugCard {...BASE_PROPS} status="fahrt-unterbrochen" />);
    expect(screen.getByText("Fahrt unterbrochen")).toBeInTheDocument();
  });

  it('status="fährt-automatisiert" zeigt "fährt automatisiert"', () => {
    render(<RoutenzugCard {...BASE_PROPS} status="fährt-automatisiert" />);
    expect(screen.getByText("fährt automatisiert")).toBeInTheDocument();
  });

  it('status="lädt" ohne ladestand zeigt "lädt"', () => {
    render(<RoutenzugCard {...BASE_PROPS} status="lädt" />);
    expect(screen.getByText("lädt")).toBeInTheDocument();
  });

  it('status="lädt" mit ladestand=71 zeigt "lädt (71%)"', () => {
    render(<RoutenzugCard {...BASE_PROPS} status="lädt" ladestand={71} />);
    expect(screen.getByText("lädt (71%)")).toBeInTheDocument();
  });

  it('status="lädt" mit ladestand=0 zeigt "lädt (0%)"', () => {
    render(<RoutenzugCard {...BASE_PROPS} status="lädt" ladestand={0} />);
    expect(screen.getByText("lädt (0%)")).toBeInTheDocument();
  });

  it('status="lädt" mit ladestand=100 zeigt "lädt (100%)"', () => {
    render(<RoutenzugCard {...BASE_PROPS} status="lädt" ladestand={100} />);
    expect(screen.getByText("lädt (100%)")).toBeInTheDocument();
  });

  it("ladestand wird bei nicht-lädt-Status ignoriert", () => {
    render(<RoutenzugCard {...BASE_PROPS} status="fährt-automatisiert" ladestand={50} />);
    expect(screen.queryByText(/50%/)).not.toBeInTheDocument();
  });
});

describe("RoutenzugCard — Interaktion", () => {
  it("ruft onClick auf wenn Card geklickt wird", () => {
    const onClick = vi.fn();
    const { container } = render(<RoutenzugCard {...BASE_PROPS} onClick={onClick} />);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("hat cursor-pointer wenn onClick angegeben", () => {
    const { container } = render(<RoutenzugCard {...BASE_PROPS} onClick={() => {}} />);
    expect((container.firstChild as HTMLElement).className).toContain("cursor-pointer");
  });

  it("kein cursor-pointer ohne onClick", () => {
    const { container } = render(<RoutenzugCard {...BASE_PROPS} />);
    expect((container.firstChild as HTMLElement).className).not.toContain("cursor-pointer");
  });
});
