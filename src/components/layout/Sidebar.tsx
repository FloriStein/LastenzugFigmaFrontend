import type { SidebarRole } from "@/types/auth";
import { NavItem } from "@/components/layout/NavItem";
import { UserCard } from "@/components/layout/UserCard";

interface NavItemDef {
  label: string;
  href: string;
  icon: React.ReactNode;
  subItems?: Array<{ label: string; href: string }>;
}

// TODO: Replace with Figma SVG exports in Sprint 3 (#58:398, #58:408, #58:429, #388:15127, #388:15116, #58:422)
function IconEreignisse() {
  return (
    <svg width="23" height="13" viewBox="0 0 23 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5 1C8.5 1 6 3 6 6v3H4v1h15v-1h-2V6c0-3-2.5-5-5.5-5z" fill="white" />
      <rect x="10" y="11" width="3" height="1.5" rx="0.75" fill="white" />
    </svg>
  );
}

function IconAuftraege() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="19" height="15" rx="2" stroke="white" strokeWidth="1" />
      <path d="M4 5h12M4 8h8M4 11h10" stroke="white" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IconKarte() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 2l6 2 6-2 6 2v10l-6-2-6 2-6-2V2z" stroke="white" strokeWidth="1" strokeLinejoin="round" />
      <path d="M7 4v10M13 2v10" stroke="white" strokeWidth="1" />
    </svg>
  );
}

function IconLinien() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12l4-8 4 8 4-8 4 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconAnzeigetafel() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="19" height="11" rx="1.5" stroke="white" strokeWidth="1" />
      <path d="M7 12v3M13 12v3M5 15h10" stroke="white" strokeWidth="1" strokeLinecap="round" />
      <path d="M4 4h12M4 7.5h8" stroke="white" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IconStatistiken() {
  return (
    <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="7" width="3" height="6" fill="white" />
      <rect x="4.5" y="4" width="3" height="9" fill="white" />
      <rect x="9" y="1" width="3" height="12" fill="white" />
      <rect x="13" y="5" width="2" height="8" fill="white" />
    </svg>
  );
}

function IconEinstellungen() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2.5" stroke="white" strokeWidth="1.2" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const EREIGNISSE_SUB_ITEMS = [
  { label: "Offen", href: "/ereignisse?tab=offen" },
  { label: "Archiv", href: "/ereignisse?tab=archiv" },
];

const NAV_CONFIG: Record<SidebarRole, NavItemDef[]> = {
  operator: [
    { label: "Ereignisse", href: "/ereignisse", icon: <IconEreignisse />, subItems: EREIGNISSE_SUB_ITEMS },
    { label: "Aufträge", href: "/auftraege", icon: <IconAuftraege /> },
    { label: "Einstellungen", href: "/einstellungen", icon: <IconEinstellungen /> },
  ],
  schichtleitung: [
    { label: "Ereignisse", href: "/ereignisse", icon: <IconEreignisse />, subItems: EREIGNISSE_SUB_ITEMS },
    { label: "Aufträge", href: "/auftraege", icon: <IconAuftraege /> },
    { label: "Karte", href: "/karte", icon: <IconKarte /> },
    { label: "Linien", href: "/linien", icon: <IconLinien /> },
    { label: "Statistiken", href: "/statistiken", icon: <IconStatistiken /> },
    { label: "Einstellungen", href: "/einstellungen", icon: <IconEinstellungen /> },
  ],
  mitarbeiter: [
    { label: "Aufträge",     href: "/auftraege",    icon: <IconAuftraege /> },
    { label: "Anzeigetafel", href: "/anzeigetafel", icon: <IconAnzeigetafel /> },
    { label: "Linien",       href: "/linien",       icon: <IconLinien /> },
  ],
};

interface SidebarProps {
  role: SidebarRole;
  userName: string;
  avatarUrl?: string;
  onLogout: () => void;
}

export function Sidebar({ role, userName, avatarUrl, onLogout }: SidebarProps) {
  const navItems = NAV_CONFIG[role];

  return (
    <aside className="w-sidebar h-screen bg-dark-surface shrink-0 flex flex-col">
      <div className="mt-29 ml-7.25">
        <UserCard name={userName} avatarUrl={avatarUrl} onLogout={onLogout} />
      </div>
      <nav className="mt-30 ml-11.75 flex flex-col gap-8">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            subItems={item.subItems}
          />
        ))}
      </nav>
    </aside>
  );
}
