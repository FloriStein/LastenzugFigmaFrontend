import { render, screen } from "@testing-library/react";
import { DetailShell } from "./DetailShell";

describe("DetailShell — Rendering", () => {
  it("rendert den Titelleiste-Slot", () => {
    render(
      <DetailShell titelleiste={<div data-testid="titelleiste">Header</div>}>
        <div>Content</div>
      </DetailShell>
    );
    expect(screen.getByTestId("titelleiste")).toBeInTheDocument();
  });

  it("rendert die Children im Content-Bereich", () => {
    render(
      <DetailShell titelleiste={<div>Header</div>}>
        <div data-testid="content">Hauptinhalt</div>
      </DetailShell>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("Titelleiste und Children sind beide sichtbar", () => {
    render(
      <DetailShell titelleiste={<span>Titel</span>}>
        <span>Body</span>
      </DetailShell>
    );
    expect(screen.getByText("Titel")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("Content-Bereich hat bg-[#F5F5F5]", () => {
    const { container } = render(
      <DetailShell titelleiste={<div />}>
        <div />
      </DetailShell>
    );
    const contentArea = container.querySelector('[class*="F5F5F5"]');
    expect(contentArea).toBeInTheDocument();
  });

  it("äußerer Wrapper hat h-screen und flex-col", () => {
    const { container } = render(
      <DetailShell titelleiste={<div />}>
        <div />
      </DetailShell>
    );
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain("h-screen");
    expect(outer.className).toContain("flex-col");
  });

  it("mehrere Children werden alle gerendert", () => {
    render(
      <DetailShell titelleiste={<div />}>
        <span data-testid="child-1">Eins</span>
        <span data-testid="child-2">Zwei</span>
      </DetailShell>
    );
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });
});
