import { Easing, interpolate } from "remotion";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const ramp = (
  frame: number,
  start: number,
  duration: number,
  from = 0,
  to = 1,
  ease: (n: number) => number = Easing.out(Easing.cubic),
) => {
  if (duration <= 0) return frame >= start ? to : from;
  return interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

export const easeOutExpo = (n: number) =>
  n >= 1 ? 1 : 1 - Math.pow(2, -10 * n);

export const easeInOutQuart = (n: number) =>
  n < 0.5 ? 8 * n * n * n * n : 1 - Math.pow(-2 * n + 2, 4) / 2;

/** 带一点回弹的进入曲线（比 spring 更可控） */
export const overshoot = (n: number, amount = 1.2) => {
  const c = amount;
  return 1 + (c + 1) * Math.pow(n - 1, 3) + c * Math.pow(n - 1, 2);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const pulseScale = (p: number, amount = 0.04) => 1 + p * amount;
