import { render } from "@testing-library/react";
import { PrioritätBadge } from "./PrioritätBadge";

describe("PrioritätBadge", () => {
  it("rendert immer 4 Circles", () => {
    const { container } = render(<PrioritätBadge prio={0} />);
    expect(container.querySelectorAll("circle")).toHaveLength(4);
  });

  it("prio=0: keine gefüllten Circles", () => {
    const { container } = render(<PrioritätBadge prio={0} />);
    const filled = [...container.querySelectorAll("circle")].filter(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled).toHaveLength(0);
  });

  it("prio=2: genau 2 gefüllte und 2 Rahmen-Circles", () => {
    const { container } = render(<PrioritätBadge prio={2} />);
    const circles = [...container.querySelectorAll("circle")];
    expect(circles.filter((c) => c.getAttribute("fill") !== "none")).toHaveLength(2);
    expect(circles.filter((c) => c.getAttribute("fill") === "none")).toHaveLength(2);
  });

  it("prio=4: alle 4 Circles gefüllt", () => {
    const { container } = render(<PrioritätBadge prio={4} />);
    const filled = [...container.querySelectorAll("circle")].filter(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled).toHaveLength(4);
  });

  it("color=dark: gefüllte Circles verwenden #2A2F3B", () => {
    const { container } = render(<PrioritätBadge prio={1} color="dark" />);
    const filled = [...container.querySelectorAll("circle")].find(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled?.getAttribute("fill")).toBe("#2A2F3B");
  });

  it("color=blue: gefüllte Circles verwenden #146AA1", () => {
    const { container } = render(<PrioritätBadge prio={1} color="blue" />);
    const filled = [...container.querySelectorAll("circle")].find(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled?.getAttribute("fill")).toBe("#146AA1");
  });

  it("color=dark ist Default wenn nicht angegeben", () => {
    const { container } = render(<PrioritätBadge prio={1} />);
    const filled = [...container.querySelectorAll("circle")].find(
      (c) => c.getAttribute("fill") !== "none"
    );
    expect(filled?.getAttribute("fill")).toBe("#2A2F3B");
  });
});
