"use client";

import { useRouter } from "next/navigation";
import type { Role } from "@/types/auth";

interface UserCard {
  name: string;
  kuerzel: string;
  role: Role;
  redirect: string;
}

const USERS: UserCard[] = [
  { name: "Matthias Muster", kuerzel: "MM", role: "operator",       redirect: "/karte"      },
  { name: "Sabine Muster",   kuerzel: "SL", role: "schichtleitung", redirect: "/ereignisse" },
  { name: "Jonas Muster",    kuerzel: "MA", role: "mitarbeiter",    redirect: "/auftraege"  },
  { name: "Gast",            kuerzel: "GA", role: "gast",           redirect: "/statistiken" },
];

export default function LoginPage() {
  const router = useRouter();

  function handleLogin(user: UserCard) {
    const payload = btoa(JSON.stringify({ role: user.role, name: user.name }));
    document.cookie = `auth-token=x.${payload}.x; path=/`;
    router.push(user.redirect);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1E2229] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[3.7px]" />
      <div className="relative bg-white rounded-[10px] shadow-[4px_4px_24px_rgba(0,0,0,0.11)] px-[60px] py-[40px] flex flex-col items-center gap-8">
        <h2 className="text-[26px] font-bold text-black">Login</h2>
        <div className="flex gap-[54px]">
          {USERS.map((user) => (
            <button
              key={user.role}
              onClick={() => handleLogin(user)}
              aria-label={`Als ${user.name} anmelden`}
              className="w-[73px] flex flex-col items-center gap-0 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-[49px] h-[49px] rounded-full bg-[#D9D9D9] flex items-center justify-center mb-[14px]">
                <span className="text-[18px] font-bold text-[#2A2F3B]">{user.kuerzel}</span>
              </div>
              <span className="text-[15px] font-medium text-[#2A2F3B] text-center leading-tight">
                {user.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
