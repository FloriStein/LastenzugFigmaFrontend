import { render, screen } from "@testing-library/react";
import StatistikenPage from "./page";

vi.mock("recharts", () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
}));

describe("ST-01 — StatistikenPage — Seitenstruktur", () => {
  it("zeigt Seitentitel 'Statistiken'", () => {
    render(<StatistikenPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Statistiken" })).toBeInTheDocument();
  });

  it("zeigt Panel-Titel 'Ereignisaufkommen'", () => {
    render(<StatistikenPage />);
    expect(screen.getByRole("heading", { name: "Ereignisaufkommen" })).toBeInTheDocument();
  });

  it("zeigt Panel-Titel 'Nach Ereignisart'", () => {
    render(<StatistikenPage />);
    expect(screen.getByRole("heading", { name: "Nach Ereignisart" })).toBeInTheDocument();
  });

  it("zeigt Panel-Titel 'Betroffener Routenzug'", () => {
    render(<StatistikenPage />);
    expect(screen.getByRole("heading", { name: "Betroffener Routenzug" })).toBeInTheDocument();
  });

  it("zeigt Panel-Titel 'Nach Ort'", () => {
    render(<StatistikenPage />);
    expect(screen.getByRole("heading", { name: "Nach Ort" })).toBeInTheDocument();
  });
});

describe("ST-01 — StatistikenPage — Charts", () => {
  it("rendert AreaChart für Ereignisaufkommen", () => {
    render(<StatistikenPage />);
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
  });

  it("rendert PieChart für Nach-Ereignisart", () => {
    render(<StatistikenPage />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("rendert BarChart für Betroffener Routenzug", () => {
    render(<StatistikenPage />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});

describe("ST-01 — StatistikenPage — Donut-Zentrum", () => {
  it("zeigt Gesamtzahl '68' im Zentrum des Donut-Charts", () => {
    render(<StatistikenPage />);
    expect(screen.getByText("68")).toBeInTheDocument();
  });
});

describe("ST-01 — StatistikenPage — Nach-Ort-Panel", () => {
  it("zeigt Blase mit Wert '8'", () => {
    render(<StatistikenPage />);
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("zeigt Blase mit Wert '22'", () => {
    render(<StatistikenPage />);
    expect(screen.getByText("22")).toBeInTheDocument();
  });

  it("zeigt Blase mit Wert '1'", () => {
    render(<StatistikenPage />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("zeigt Label 'Position links'", () => {
    render(<StatistikenPage />);
    expect(screen.getByText("Position links")).toBeInTheDocument();
  });

  it("zeigt Label 'Position mitte'", () => {
    render(<StatistikenPage />);
    expect(screen.getByText("Position mitte")).toBeInTheDocument();
  });

  it("zeigt Label 'Position rechts'", () => {
    render(<StatistikenPage />);
    expect(screen.getByText("Position rechts")).toBeInTheDocument();
  });
});
