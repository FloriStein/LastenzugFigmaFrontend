// @vitest-environment node
import { middleware } from "./middleware";
import { NextRequest } from "next/server";

function makeToken(payload: object): string {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

function makeRequest(pathname: string, token?: string): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const headers: Record<string, string> = {};
  if (token) headers.cookie = `auth-token=${token}`;
  return new NextRequest(url, { headers });
}

describe("OR-01 — Middleware — passThrough setzt x-next-pathname Header", () => {
  it("setzt x-next-pathname auf /login für public path", () => {
    const res = middleware(makeRequest("/login"));
    expect(res.headers.get("x-next-pathname")).toBe("/login");
  });

  it("setzt x-next-pathname für geschützte Route mit gültigem Token", () => {
    const token = makeToken({ role: "operator" });
    const res = middleware(makeRequest("/ereignisse", token));
    expect(res.headers.get("x-next-pathname")).toBe("/ereignisse");
  });

  it("setzt x-next-pathname für /auftraege", () => {
    const token = makeToken({ role: "mitarbeiter" });
    const res = middleware(makeRequest("/auftraege", token));
    expect(res.headers.get("x-next-pathname")).toBe("/auftraege");
  });
});

describe("OR-01 — Middleware — Auth-Guard", () => {
  it("leitet ohne Token auf /login um", () => {
    const res = middleware(makeRequest("/ereignisse"));
    expect(res.headers.get("location")).toContain("/login");
  });

  it("leitet mit ungültigem Token (kein role) auf /login um", () => {
    const token = makeToken({ name: "ohneRolle" });
    const res = middleware(makeRequest("/ereignisse", token));
    expect(res.headers.get("location")).toContain("/login");
  });

  it("leitet mit kaputtem Token (kein gültiges JWT) auf /login um", () => {
    const res = middleware(makeRequest("/ereignisse", "kein-jwt-token"));
    expect(res.headers.get("location")).toContain("/login");
  });

  it("blockiert / ohne Token und leitet auf /login um", () => {
    const res = middleware(makeRequest("/"));
    expect(res.headers.get("location")).toContain("/login");
  });
});

describe("OR-01 — Middleware — Rollen-Redirect von /", () => {
  it("Operator → /karte", () => {
    const token = makeToken({ role: "operator" });
    const res = middleware(makeRequest("/", token));
    expect(res.headers.get("location")).toContain("/karte");
  });

  it("Schichtleitung → /ereignisse", () => {
    const token = makeToken({ role: "schichtleitung" });
    const res = middleware(makeRequest("/", token));
    expect(res.headers.get("location")).toContain("/ereignisse");
  });

  it("Mitarbeiter → /auftraege", () => {
    const token = makeToken({ role: "mitarbeiter" });
    const res = middleware(makeRequest("/", token));
    expect(res.headers.get("location")).toContain("/auftraege");
  });

  it("Gast → /statistiken", () => {
    const token = makeToken({ role: "gast" });
    const res = middleware(makeRequest("/", token));
    expect(res.headers.get("location")).toContain("/statistiken");
  });
});

describe("OR-01 — Middleware — Public Paths passieren ohne Token", () => {
  it("/login passiert ohne Token (kein Redirect)", () => {
    const res = middleware(makeRequest("/login"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("/login setzt trotzdem x-next-pathname Header", () => {
    const res = middleware(makeRequest("/login"));
    expect(res.headers.get("x-next-pathname")).toBe("/login");
  });
});
