import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/Icon";
import type { ModuleName } from "@/types";

export function RequireModule({ module, children }: { module: ModuleName; children: ReactNode }) {
  const { can, role } = useAuth();

  if (!can(module, "read")) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-xl gap-3 rounded-2xl border border-black/[0.06] bg-surface-variant/20 max-w-lg mx-auto mt-lg">
        <Icon name="lock" className="text-[32px] text-on-surface-variant" filled />
        <p className="text-body-lg font-headline text-on-surface">Access restricted</p>
        <p className="text-body-md text-on-surface-variant">
          The <span className="font-medium">{role ?? "current"}</span> role doesn't have access to this
          module. Switch roles from the top-right menu to view it.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
