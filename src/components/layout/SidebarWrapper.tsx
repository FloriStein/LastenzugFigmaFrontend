"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import type { SidebarRole } from "@/types/auth";

interface SidebarWrapperProps {
  role: SidebarRole;
  userName?: string;
}

export function SidebarWrapper({ role, userName }: SidebarWrapperProps) {
  const router = useRouter();

  return (
    <Sidebar
      role={role}
      userName={userName ?? "Benutzer"}
      onLogout={() => router.push("/login")}
    />
  );
}
