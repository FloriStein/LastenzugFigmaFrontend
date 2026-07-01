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

describe("RG-01 — Middleware — Pfad-Zugriffskontrolle Operator", () => {
  it.each(["/karte", "/linien", "/ereignisse", "/auftraege", "/einstellungen"])(
    "Operator darf %s aufrufen (kein Redirect)",
    (path) => {
      const token = makeToken({ role: "operator" });
      const res = middleware(makeRequest(path, token));
      expect(res.headers.get("location")).toBeNull();
    }
  );

  it.each(["/statistiken", "/anzeigetafel"])(
    "Operator wird von %s auf /karte umgeleitet",
    (path) => {
      const token = makeToken({ role: "operator" });
      const res = middleware(makeRequest(path, token));
      expect(res.headers.get("location")).toContain("/karte");
    }
  );

  it("x-next-pathname wird für erlaubte Operator-Pfade gesetzt", () => {
    const token = makeToken({ role: "operator" });
    const res = middleware(makeRequest("/karte", token));
    expect(res.headers.get("x-next-pathname")).toBe("/karte");
  });
});

describe("RG-01 — Middleware — Pfad-Zugriffskontrolle Schichtleitung", () => {
  it.each(["/ereignisse", "/auftraege", "/karte", "/statistiken", "/einstellungen"])(
    "Schichtleitung darf %s aufrufen (kein Redirect)",
    (path) => {
      const token = makeToken({ role: "schichtleitung" });
      const res = middleware(makeRequest(path, token));
      expect(res.headers.get("location")).toBeNull();
    }
  );

  it("Schichtleitung wird von /anzeigetafel auf /ereignisse umgeleitet", () => {
    const token = makeToken({ role: "schichtleitung" });
    const res = middleware(makeRequest("/anzeigetafel", token));
    expect(res.headers.get("location")).toContain("/ereignisse");
  });

  it("Schichtleitung darf /linien aufrufen", () => {
    const token = makeToken({ role: "schichtleitung" });
    const res = middleware(makeRequest("/linien", token));
    expect(res.headers.get("location")).toBeNull();
  });
});

describe("RG-01 — Middleware — Pfad-Zugriffskontrolle Mitarbeiter", () => {
  it.each(["/auftraege", "/linien", "/anzeigetafel", "/einstellungen"])(
    "Mitarbeiter darf %s aufrufen (kein Redirect)",
    (path) => {
      const token = makeToken({ role: "mitarbeiter" });
      const res = middleware(makeRequest(path, token));
      expect(res.headers.get("location")).toBeNull();
    }
  );

  it.each(["/karte", "/ereignisse", "/statistiken"])(
    "Mitarbeiter wird von %s auf /auftraege umgeleitet",
    (path) => {
      const token = makeToken({ role: "mitarbeiter" });
      const res = middleware(makeRequest(path, token));
      expect(res.headers.get("location")).toContain("/auftraege");
    }
  );

  it("Mitarbeiter darf /auftraege/123 (Unterroute) aufrufen", () => {
    const token = makeToken({ role: "mitarbeiter" });
    const res = middleware(makeRequest("/auftraege/123", token));
    expect(res.headers.get("location")).toBeNull();
  });
});

describe("RG-01 — Middleware — Pfad-Zugriffskontrolle Gast", () => {
  it.each(["/statistiken", "/einstellungen"])(
    "Gast darf %s aufrufen (kein Redirect)",
    (path) => {
      const token = makeToken({ role: "gast" });
      const res = middleware(makeRequest(path, token));
      expect(res.headers.get("location")).toBeNull();
    }
  );

  it.each(["/karte", "/ereignisse", "/auftraege", "/anzeigetafel"])(
    "Gast wird von %s auf /statistiken umgeleitet",
    (path) => {
      const token = makeToken({ role: "gast" });
      const res = middleware(makeRequest(path, token));
      expect(res.headers.get("location")).toContain("/statistiken");
    }
  );

  it("Gast darf /linien NICHT aufrufen → /statistiken", () => {
    const token = makeToken({ role: "gast" });
    const res = middleware(makeRequest("/linien", token));
    expect(res.headers.get("location")).toContain("/statistiken");
  });
});
