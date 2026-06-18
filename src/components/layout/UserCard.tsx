import Image from "next/image";

interface UserCardProps {
  name: string;
  avatarUrl?: string;
  onLogout: () => void;
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1l10 10M11 1L1 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function UserCard({ name, avatarUrl, onLogout }: UserCardProps) {
  return (
    <div className="flex items-center gap-3 w-[219px]">
      <div className="w-[45px] h-[45px] rounded-full bg-[#D9D9D9] flex-shrink-0 overflow-hidden">
        {avatarUrl && (
          <Image src={avatarUrl} alt={name} width={45} height={45} className="object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="font-bold text-[18px] text-white leading-none">{name}</span>
        <button
          onClick={onLogout}
          type="button"
          className="flex items-center justify-between gap-2 w-[122px] h-[25px] px-2 rounded-[4px] bg-white/[0.22]"
        >
          <span className="font-semibold text-[14px] text-white">abmelden</span>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
