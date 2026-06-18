import { SidebarKarte } from "@/components/layout/SidebarKarte";

type ActiveItem = "karte" | "routenzüge" | "rsu" | "linien" | "linien-haltestellen" | "linien-bus";

interface KarteShellProps {
  children: React.ReactNode;
  activeItem?: ActiveItem;
}

export function KarteShell({ children, activeItem }: KarteShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarKarte activeItem={activeItem} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
