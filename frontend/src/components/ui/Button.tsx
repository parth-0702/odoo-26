import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-primary-container text-on-primary-container glow-primary hover:brightness-110",
  secondary:
    "bg-surface-variant/60 text-on-surface border border-black/10 hover:bg-black/5",
  ghost: "text-on-surface-variant hover:text-on-surface hover:bg-black/5",
  danger: "bg-error-container text-error hover:brightness-110",
};

export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-data-tabular font-medium transition-all disabled:opacity-50 disabled:pointer-events-none",
        styles[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}