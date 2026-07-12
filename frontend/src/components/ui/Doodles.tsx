import type { CSSProperties } from "react";
import clsx from "clsx";

interface DoodleProps {
  className?: string;
  style?: CSSProperties;
  color?: string;
}

/** Hand-drawn 4-point star, sticker-style. */
export function StarDoodle({ className, style, color = "#FFD84D" }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 60" className={clsx("select-none", className)} style={style} aria-hidden>
      <path
        d="M30 2 C31 18 32 28 48 30 C32 32 31 42 30 58 C29 42 28 32 12 30 C28 28 29 18 30 2 Z"
        fill={color}
        stroke="#2B2B2F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Squiggly hand-drawn scribble underline. */
export function ScribbleDoodle({ className, style, color = "#B5121B" }: DoodleProps) {
  return (
    <svg viewBox="0 0 160 20" className={clsx("select-none", className)} style={style} aria-hidden>
      <path
        d="M3 14 C 20 4, 35 20, 52 9 C 68 -1, 85 18, 102 8 C 118 -1, 134 16, 157 7"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Curved hand-drawn arrow, e.g. pointing at a CTA. */
export function ArrowDoodle({ className, style, color = "#2B2B2F" }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 70" className={clsx("select-none", className)} style={style} aria-hidden>
      <path
        d="M6 8 C 40 4, 80 14, 84 44"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M68 38 L 84 44 L 90 27"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Organic blob shape used as soft background accent. */
export function BlobDoodle({ className, style, color = "#7B61FF" }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 200" className={clsx("select-none", className)} style={style} aria-hidden>
      <path
        d="M45.6,-58.3C58.4,-49.9,67.4,-34.6,71.2,-18.1C75.1,-1.6,73.9,16.1,66.1,30.5C58.4,44.9,44.1,55.9,28.4,63.1C12.7,70.2,-4.5,73.4,-20.7,69.7C-36.9,66,-52.1,55.3,-61.5,40.8C-70.9,26.3,-74.4,7.9,-71.1,-8.8C-67.8,-25.5,-57.7,-40.5,-44.4,-49C-31.1,-57.6,-15.6,-59.7,1.6,-61.7C18.7,-63.8,32.8,-66.7,45.6,-58.3Z"
        transform="translate(100 100)"
        fill={color}
        opacity="0.16"
      />
    </svg>
  );
}

/** Dashed circle, often paired with a star or badge. */
export function CircleDoodle({ className, style, color = "#2B2B2F" }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" className={clsx("select-none", className)} style={style} aria-hidden>
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray="6 8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Sparkle burst, small accent used near icons/CTAs. */
export function SparkleDoodle({ className, style, color = "#B5121B" }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" className={clsx("select-none", className)} style={style} aria-hidden>
      <path d="M20 2 L23 17 L38 20 L23 23 L20 38 L17 23 L2 20 L17 17 Z" fill={color} />
    </svg>
  );
}

/** Small plus/cross doodle, used as filler confetti. */
export function PlusDoodle({ className, style, color = "#38D9A9" }: DoodleProps) {
  return (
    <svg viewBox="0 0 20 20" className={clsx("select-none", className)} style={style} aria-hidden>
      <path d="M10 2 V18 M2 10 H18" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
