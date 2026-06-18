"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

type Role = "operator" | "schichtleitung" | "mitarbeiter";

interface SidebarWrapperProps {
  role: Role;
}

export function SidebarWrapper({ role }: SidebarWrapperProps) {
  const router = useRouter();

  return (
    <Sidebar
      role={role}
      userName="Matthias Muster"
      onLogout={() => router.push("/login")}
    />
  );
}
