import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/Icon";
import { initials } from "@/lib/format";
import { ROLE_LABELS } from "@/types";
import clsx from "clsx";

export function RoleSwitcher() {
  const { users, currentUser, switchUser } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 h-11 pl-1.5 pr-3 rounded-full border border-black/10 bg-white/70 hover:border-primary/30 transition-colors"
      >
        <span className="w-8 h-8 rounded-full bg-primary-container/30 border border-primary/30 flex items-center justify-center text-primary text-[12px] font-bold">
          {initials(currentUser.name)}
        </span>
        <span className="text-left leading-tight hidden sm:block">
          <span className="block text-[13px] font-semibold text-on-surface">{currentUser.name}</span>
          <span className="block text-[11px] text-on-surface-variant">{ROLE_LABELS[currentUser.role]}</span>
        </span>
        <Icon name="expand_more" className="text-[18px] text-on-surface-variant" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-black/10 bg-white shadow-lg overflow-hidden z-20">
          <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-on-surface-variant border-b border-black/[0.06]">
            Switch demo role
          </div>
          {users.map((u) => (
            <button
              key={u._id}
              onClick={() => {
                switchUser(u._id);
                setOpen(false);
              }}
              className={clsx(
                "w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-primary/5 transition-colors",
                u._id === currentUser._id && "bg-primary-container/15"
              )}
            >
              <span className="w-7 h-7 rounded-full bg-surface-variant/60 flex items-center justify-center text-on-surface text-[11px] font-bold">
                {initials(u.name)}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium text-on-surface truncate">{u.name}</span>
                <span className="block text-[11px] text-on-surface-variant">{ROLE_LABELS[u.role]}</span>
              </span>
              {u._id === currentUser._id && (
                <Icon name="check" className="ml-auto text-[16px] text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
