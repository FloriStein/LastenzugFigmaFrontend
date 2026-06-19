import { render } from "@testing-library/react";
import { ConnectionIcon } from "./ConnectionIcon";

describe("ConnectionIcon — SVG-Grundstruktur", () => {
  it.each(["connected", "disconnected"] as const)(
    'status="%s" rendert ein SVG-Element',
    (status) => {
      const { container } = render(<ConnectionIcon status={status} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    }
  );

  it.each(["connected", "disconnected"] as const)(
    'status="%s" hat viewBox="0 0 24 24"',
    (status) => {
      const { container } = render(<ConnectionIcon status={status} />);
      expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 24 24");
    }
  );

  it.each(["connected", "disconnected"] as const)(
    'status="%s" rendert 3 Balken (rect-Elemente)',
    (status) => {
      const { container } = render(<ConnectionIcon status={status} />);
      expect(container.querySelectorAll("rect")).toHaveLength(3);
    }
  );
});

describe("ConnectionIcon — connected", () => {
  it("Balken haben keine opacity-Dämpfung", () => {
    const { container } = render(<ConnectionIcon status="connected" />);
    const rects = Array.from(container.querySelectorAll("rect"));
    rects.forEach((r) => {
      const op = r.getAttribute("opacity") ?? "1";
      expect(parseFloat(op)).toBeGreaterThan(0.9);
    });
  });

  it("kein X-Overlay (keine line-Elemente)", () => {
    const { container } = render(<ConnectionIcon status="connected" />);
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });
});

describe("ConnectionIcon — disconnected", () => {
  it("Balken sind gedimmt (opacity ≤ 0.4)", () => {
    const { container } = render(<ConnectionIcon status="disconnected" />);
    const rects = Array.from(container.querySelectorAll("rect"));
    rects.forEach((r) => {
      const op = parseFloat(r.getAttribute("opacity") ?? "1");
      expect(op).toBeLessThanOrEqual(0.4);
    });
  });

  it("hat X-Overlay (mindestens eine line)", () => {
    const { container } = render(<ConnectionIcon status="disconnected" />);
    expect(container.querySelector("line")).toBeInTheDocument();
  });

  it("X-Overlay ist rot (#C55141)", () => {
    const { container } = render(<ConnectionIcon status="disconnected" />);
    const line = container.querySelector("line")!;
    expect(line.getAttribute("stroke")).toBe("#C55141");
  });
});
