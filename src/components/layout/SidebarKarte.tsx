import { cn } from "@/lib/utils";

type ActiveItem = "karte" | "routenzüge" | "rsu" | "linien" | "linien-haltestellen" | "linien-bus";

interface SidebarKarteProps {
  activeItem?: ActiveItem;
}

// TODO: Replace with Figma SVG exports in Sprint 3 (#104:2185, #118:1520, #120:1265, #118:1509, #405:14233, #246:2463)
function IconLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="24" height="14" rx="3" stroke="white" strokeWidth="1.5" />
      <circle cx="8" cy="15" r="2" fill="white" />
      <circle cx="20" cy="15" r="2" fill="white" />
      <path d="M10 15h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 8V5M10 5h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLayerToggle() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L2 8l11 6 11-6-11-6z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 14l11 6 11-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRoutenzug() {
  return (
    <svg width="27" height="20" viewBox="0 0 27 20" fill="white" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="4" width="25" height="12" rx="3" stroke="white" strokeWidth="1.2" fill="none" />
      <circle cx="6" cy="17" r="2.5" fill="white" />
      <circle cx="21" cy="17" r="2.5" fill="white" />
      <path d="M9 10h9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 4V1" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconRSU() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="17" r="7" stroke="white" strokeWidth="1.5" />
      <path d="M17 5V2M17 32v-3M5 17H2M32 17h-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 9l-2-2M27 27l-2-2M25 9l2-2M9 27l-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLinien() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="17" r="3" stroke="white" strokeWidth="1.5" />
      <circle cx="27" cy="17" r="3" stroke="white" strokeWidth="1.5" />
      <path d="M10 17h14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 8V5M27 8V5M7 29v-3M27 29v-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2" />
    </svg>
  );
}

function IconLinienHaltestellen() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="17" r="3" fill="white" />
      <circle cx="17" cy="17" r="3" fill="white" />
      <circle cx="27" cy="17" r="3" fill="white" />
      <path d="M10 17h4M20 17h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLinienBus() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="8" width="16" height="18" rx="3" stroke="white" strokeWidth="1.5" />
      <path d="M9 15h16" stroke="white" strokeWidth="1.2" />
      <circle cx="13" cy="28" r="2" fill="white" />
      <circle cx="21" cy="28" r="2" fill="white" />
    </svg>
  );
}

interface NavIconProps {
  icon: React.ReactNode;
  active: boolean;
}

function NavIcon({ icon, active }: NavIconProps) {
  return (
    <div
      className={cn(
        "w-8.5 h-8.5 flex items-center justify-center rounded-sm",
        active && "bg-white/10"
      )}
    >
      {icon}
    </div>
  );
}

const NAV_ITEMS: Array<{ id: ActiveItem; icon: React.ReactNode }> = [
  { id: "routenzüge", icon: <IconRoutenzug /> },
  { id: "rsu", icon: <IconRSU /> },
  { id: "linien", icon: <IconLinien /> },
  { id: "linien-haltestellen", icon: <IconLinienHaltestellen /> },
  { id: "linien-bus", icon: <IconLinienBus /> },
];

export function SidebarKarte({ activeItem }: SidebarKarteProps) {
  return (
    <aside className="w-sidebar-compact h-screen bg-dark-surface shrink-0">
      <div className="flex flex-col items-center gap-12.5 mt-40 w-13 mx-auto">
        <IconLogo />
        <IconLayerToggle />
        <hr className="w-full border-t border-white/40 self-stretch m-0" />
        {NAV_ITEMS.map((item) => (
          <NavIcon key={item.id} icon={item.icon} active={activeItem === item.id} />
        ))}
      </div>
    </aside>
  );
}
