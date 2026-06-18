import { cookies } from "next/headers";
import { SidebarWrapper } from "@/components/layout/SidebarWrapper";

type SidebarRole = "operator" | "schichtleitung" | "mitarbeiter";

function parseSidebarRole(token: string): SidebarRole {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const r = payload.role;
    if (r === "schichtleitung" || r === "mitarbeiter") return r;
  } catch {
    // fall through to default
  }
  return "operator";
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const role: SidebarRole = token ? parseSidebarRole(token) : "operator";

  return (
    <div className="flex h-screen">
      <SidebarWrapper role={role} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
