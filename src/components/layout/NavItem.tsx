"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
  subItems?: Array<{ label: string; href: string }>;
}

export function NavItem({ label, icon, href, active, subItems }: NavItemProps) {
  const pathname = usePathname();
  const isActive = active ?? pathname.startsWith(href);

  return (
    <div className="flex flex-col">
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 text-white text-[18px]",
          isActive ? "font-bold" : "font-medium"
        )}
      >
        {icon}
        {label}
      </Link>
      {subItems && subItems.length > 0 && (
        <div className="flex flex-col pl-[55px] gap-[10px] mt-[10px]">
          {subItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-white text-[18px]",
                pathname === item.href ? "font-bold" : "font-medium"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
