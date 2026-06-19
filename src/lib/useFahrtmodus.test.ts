import { renderHook, act } from "@testing-library/react";
import { useFahrtmodus } from "./useFahrtmodus";

describe("useFahrtmodus — Initialisierung", () => {
  it('startet mit "manuell" wenn kein initialVariant angegeben', () => {
    const { result } = renderHook(() => useFahrtmodus());
    expect(result.current[0]).toBe("manuell");
  });

  it("startet mit dem angegebenen initialVariant", () => {
    const { result } = renderHook(() => useFahrtmodus("autom-nicht-moeglich"));
    expect(result.current[0]).toBe("autom-nicht-moeglich");
  });
});

describe("useFahrtmodus — SET_MODUS", () => {
  it('SET_MODUS("autom-eingabe") von manuell → autom-eingabe', () => {
    const { result } = renderHook(() => useFahrtmodus("manuell"));
    act(() => {
      result.current[1]({ type: "SET_MODUS", payload: "autom-eingabe" });
    });
    expect(result.current[0]).toBe("autom-eingabe");
  });

  it('SET_MODUS("manuell") von autom-nicht-moeglich → manuell', () => {
    const { result } = renderHook(() => useFahrtmodus("autom-nicht-moeglich"));
    act(() => {
      result.current[1]({ type: "SET_MODUS", payload: "manuell" });
    });
    expect(result.current[0]).toBe("manuell");
  });

  it('SET_MODUS kann in jeden beliebigen Zustand wechseln', () => {
    const { result } = renderHook(() => useFahrtmodus("manuell"));
    act(() => {
      result.current[1]({ type: "SET_MODUS", payload: "wiederherstellung" });
    });
    expect(result.current[0]).toBe("wiederherstellung");
  });
});

describe("useFahrtmodus — SYSTEM_OVERRIDE", () => {
  it('SYSTEM_OVERRIDE von autom-eingabe → autom-nicht-moeglich', () => {
    const { result } = renderHook(() => useFahrtmodus("autom-eingabe"));
    act(() => {
      result.current[1]({ type: "SYSTEM_OVERRIDE" });
    });
    expect(result.current[0]).toBe("autom-nicht-moeglich");
  });

  it('SYSTEM_OVERRIDE von manuell → bleibt manuell (keine Auswirkung)', () => {
    const { result } = renderHook(() => useFahrtmodus("manuell"));
    act(() => {
      result.current[1]({ type: "SYSTEM_OVERRIDE" });
    });
    expect(result.current[0]).toBe("manuell");
  });

  it('SYSTEM_OVERRIDE von wiederherstellung → bleibt wiederherstellung', () => {
    const { result } = renderHook(() => useFahrtmodus("wiederherstellung"));
    act(() => {
      result.current[1]({ type: "SYSTEM_OVERRIDE" });
    });
    expect(result.current[0]).toBe("wiederherstellung");
  });
});

describe("useFahrtmodus — RESTORE", () => {
  it('RESTORE von autom-nicht-moeglich → wiederherstellung', () => {
    const { result } = renderHook(() => useFahrtmodus("autom-nicht-moeglich"));
    act(() => {
      result.current[1]({ type: "RESTORE" });
    });
    expect(result.current[0]).toBe("wiederherstellung");
  });

  it('RESTORE von wiederherstellung → manuell (Wiederherstellung bestätigt)', () => {
    const { result } = renderHook(() => useFahrtmodus("wiederherstellung"));
    act(() => {
      result.current[1]({ type: "RESTORE" });
    });
    expect(result.current[0]).toBe("manuell");
  });

  it('RESTORE von manuell → bleibt manuell (keine Auswirkung)', () => {
    const { result } = renderHook(() => useFahrtmodus("manuell"));
    act(() => {
      result.current[1]({ type: "RESTORE" });
    });
    expect(result.current[0]).toBe("manuell");
  });

  it('RESTORE von autom-eingabe → bleibt autom-eingabe', () => {
    const { result } = renderHook(() => useFahrtmodus("autom-eingabe"));
    act(() => {
      result.current[1]({ type: "RESTORE" });
    });
    expect(result.current[0]).toBe("autom-eingabe");
  });
});

describe("useFahrtmodus — Mehrstufige Übergänge", () => {
  it("kompletter Flow: manuell → autom-eingabe → autom-nicht-moeglich → manuell", () => {
    const { result } = renderHook(() => useFahrtmodus("manuell"));
    act(() => { result.current[1]({ type: "SET_MODUS", payload: "autom-eingabe" }); });
    expect(result.current[0]).toBe("autom-eingabe");
    act(() => { result.current[1]({ type: "SYSTEM_OVERRIDE" }); });
    expect(result.current[0]).toBe("autom-nicht-moeglich");
    act(() => { result.current[1]({ type: "SET_MODUS", payload: "manuell" }); });
    expect(result.current[0]).toBe("manuell");
  });

  it("Wiederherstellungs-Flow: autom-nicht-moeglich → wiederherstellung → manuell", () => {
    const { result } = renderHook(() => useFahrtmodus("autom-nicht-moeglich"));
    act(() => { result.current[1]({ type: "RESTORE" }); });
    expect(result.current[0]).toBe("wiederherstellung");
    act(() => { result.current[1]({ type: "RESTORE" }); });
    expect(result.current[0]).toBe("manuell");
  });
});
