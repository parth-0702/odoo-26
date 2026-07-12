import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/50 backdrop-blur-sm animate-fade-in-up"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-container border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]`}
      >
        <div className="flex items-center justify-between px-lg py-md border-b border-black/[0.06] sticky top-0 bg-surface-container z-10">
          <h3 className="text-body-lg font-headline font-semibold text-on-surface">{title}</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-black/5"
            aria-label="Close"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="p-lg">{children}</div>
      </div>
    </div>
  );
}
