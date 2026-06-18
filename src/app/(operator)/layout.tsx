import { SidebarWrapper } from "@/components/layout/SidebarWrapper";

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SidebarWrapper role="operator" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
