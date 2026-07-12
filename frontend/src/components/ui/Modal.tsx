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
      className="fixed inset-0 z-50 flex items-center justify-center p-md bg-[#2B2B2F]/60 backdrop-blur-sm animate-fade-in-up"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto rounded-[1.75rem] bg-surface border-[3px] border-outline shadow-pop-lg`}
      >
        <div className="flex items-center justify-between px-lg py-md border-b-2 border-outline/15 sticky top-0 bg-surface z-10 rounded-t-[1.5rem]">
          <h3 className="text-body-lg font-headline font-bold text-on-surface">{title}</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full border-2 border-outline hover:bg-black/5 transition-colors"
            aria-label="Close"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        <div className="p-lg">{children}</div>
      </div>
    </div>
  );
}
