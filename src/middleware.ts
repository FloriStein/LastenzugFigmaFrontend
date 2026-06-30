import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@/types/auth";

const ROLE_REDIRECT: Record<Role, string> = {
  operator: "/karte",
  schichtleitung: "/ereignisse",
  mitarbeiter: "/auftraege",
  gast: "/statistiken",
};

const PUBLIC_PATHS = ["/login"];

function parseJwtPayload(token: string): { role?: Role } | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
  } catch {
    return null;
  }
}

function passThrough(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  response.headers.set("x-next-pathname", request.nextUrl.pathname);
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return passThrough(request);
  }

  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = parseJwtPayload(token);

  if (!payload?.role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(ROLE_REDIRECT[payload.role] ?? "/login", request.url)
    );
  }

  return passThrough(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
