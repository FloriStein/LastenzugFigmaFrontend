import { cookies } from "next/headers";
import { SidebarWrapper } from "@/components/layout/SidebarWrapper";
import type { SidebarRole } from "@/types/auth";

function parseTokenPayload(token: string): { role: SidebarRole; name: string } {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const r = payload.role;
    const role: SidebarRole =
      r === "schichtleitung" || r === "mitarbeiter" ? r : "operator";
    const name = typeof payload.name === "string" ? payload.name : "Benutzer";
    return { role, name };
  } catch {
    return { role: "operator", name: "Benutzer" };
  }
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const { role, name } = token
    ? parseTokenPayload(token)
    : { role: "operator" as SidebarRole, name: "Benutzer" };

  return (
    <div className="flex h-screen">
      <SidebarWrapper role={role} userName={name} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
