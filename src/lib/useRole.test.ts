// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { useRole } from "./useRole";

function makeToken(payload: object): string {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

function mockCookie(value: string) {
  Object.defineProperty(document, "cookie", {
    configurable: true,
    get: () => value,
    set: () => {},
  });
}

beforeEach(() => mockCookie(""));

describe("useRole — Standardwert", () => {
  it('gibt "operator" zurück wenn kein auth-token Cookie vorhanden', () => {
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe("operator");
  });

  it('gibt "operator" zurück bei leerem Cookie-String', () => {
    mockCookie("");
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe("operator");
  });
});

describe("useRole — Rollen aus JWT-Cookie", () => {
  it.each([
    ["operator" as const],
    ["schichtleitung" as const],
    ["mitarbeiter" as const],
    ["gast" as const],
  ])('liest Rolle "%s" aus auth-token Cookie', (role) => {
    mockCookie(`auth-token=${makeToken({ role })}`);
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe(role);
  });

  it("auth-token ist zweites Cookie → wird korrekt extrahiert", () => {
    const token = makeToken({ role: "schichtleitung" });
    mockCookie(`other=value; auth-token=${token}`);
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe("schichtleitung");
  });

  it("kein Leerzeichen nach Semikolon → auth-token trotzdem gefunden", () => {
    const token = makeToken({ role: "mitarbeiter" });
    mockCookie(`first=x;auth-token=${token}`);
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe("mitarbeiter");
  });

  it("mehrere Cookies, auth-token an dritter Stelle", () => {
    const token = makeToken({ role: "gast" });
    mockCookie(`a=1; b=2; auth-token=${token}`);
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe("gast");
  });
});

describe("useRole — Ungültige Token", () => {
  it('Cookie ohne role-Feld → bleibt "operator"', () => {
    mockCookie(`auth-token=${makeToken({ name: "kein-role" })}`);
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe("operator");
  });

  it('kaputtes JWT (kein Punkt) → bleibt "operator"', () => {
    mockCookie("auth-token=kein-jwt");
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe("operator");
  });

  it('JWT mit ungültigem Base64 Payload → bleibt "operator"', () => {
    mockCookie("auth-token=header.!!!ungültig!!!.sig");
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe("operator");
  });

  it('JWT mit leerem Payload-Objekt {} → bleibt "operator"', () => {
    const token = `header.${btoa("{}")}.sig`;
    mockCookie(`auth-token=${token}`);
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe("operator");
  });

  it('JWT mit role=null → bleibt "operator"', () => {
    mockCookie(`auth-token=${makeToken({ role: null })}`);
    const { result } = renderHook(() => useRole());
    expect(result.current).toBe("operator");
  });
});
