import { SidebarWrapper } from "@/components/layout/SidebarWrapper";

export default function SchichtleitungLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SidebarWrapper role="schichtleitung" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
