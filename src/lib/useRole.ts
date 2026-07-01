"use client";

import { useState, useEffect } from "react";
import type { Role } from "@/types/auth";

function parseJwtPayload(token: string): { role?: Role } | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

export function useRole(): Role {
  const [role, setRole] = useState<Role>("operator");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)auth-token=([^;]+)/);
    if (match) {
      const payload = parseJwtPayload(match[1]);
      if (payload?.role) setRole(payload.role);
    }
  }, []);

  return role;
}
