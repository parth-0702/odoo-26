import { createPortal } from "react-dom";
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
  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 overflow-y-auto bg-black/75 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${
          wide ? "max-w-2xl" : "max-w-md"
        } my-auto rounded-2xl flex flex-col max-h-[85vh] animate-fade-in-up`}
        style={{
          backgroundColor: "#0E1325",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          color: "#F1F5F9",
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b rounded-t-2xl flex-shrink-0"
          style={{
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <h3 className="text-[16px] font-semibold" style={{ color: "#F1F5F9" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full transition-colors border"
            style={{
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: "#94A3B8",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.color = "#F1F5F9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#94A3B8";
            }}
            aria-label="Close"
          >
            <Icon name="close" className="text-[16px]" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
