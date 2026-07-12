import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary border-2 border-outline shadow-pop-sm hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-pop active:translate-x-0 active:translate-y-0 active:shadow-none",
  secondary:
    "bg-surface text-on-surface border-2 border-outline shadow-pop-sm hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-pop active:translate-x-0 active:translate-y-0 active:shadow-none",
  accent:
    "bg-sunshine text-on-surface border-2 border-outline shadow-pop-sm hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-pop active:translate-x-0 active:translate-y-0 active:shadow-none",
  ghost:
    "text-on-surface-variant hover:text-on-surface hover:bg-black/5 border-2 border-transparent",
  danger:
    "bg-primary text-on-primary border-2 border-outline shadow-pop-sm hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-pop active:translate-x-0 active:translate-y-0 active:shadow-none",
};

export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-body-md font-bold transition-all duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
        styles[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
