import { SidebarWrapper } from "@/components/layout/SidebarWrapper";

export default function MitarbeiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SidebarWrapper role="mitarbeiter" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
