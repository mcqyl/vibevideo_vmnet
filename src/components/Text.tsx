import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_DISPLAY } from "../theme";
import { ramp } from "../lib/anim";

/** 逐字从遮罩里升起 */
export const RiseText: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  duration?: number;
  rise?: number;
  style?: React.CSSProperties;
  charStyle?: React.CSSProperties;
}> = ({ text, start, stagger = 2, duration = 18, rise = 118, style, charStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = Array.from(text);

  return (
    <div style={{ display: "flex", flexWrap: "nowrap", fontFamily: FONT_DISPLAY, ...style }}>
      {chars.map((ch, i) => {
        const s = spring({
          frame: frame - start - i * stagger,
          fps,
          config: { damping: 200, stiffness: 160, mass: 0.5 },
          durationInFrames: duration,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              lineHeight: 1.14,
              paddingBottom: "0.06em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - s) * rise}%)`,
                opacity: Math.min(1, Math.max(0, s * 2)),
                willChange: "transform",
                ...charStyle,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** 块级淡入上浮 */
export const FadeUp: React.FC<{
  children: React.ReactNode;
  start: number;
  duration?: number;
  distance?: number;
  style?: React.CSSProperties;
}> = ({ children, start, duration = 14, distance = 34, style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, duration);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * distance}px)`,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** 横向裁切展开 */
export const RevealX: React.FC<{
  children: React.ReactNode;
  start: number;
  duration?: number;
  from?: "left" | "right" | "center";
  style?: React.CSSProperties;
}> = ({ children, start, duration = 16, from = "left", style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, duration);
  const origin = from === "right" ? "right center" : from === "center" ? "center" : "left center";
  return (
    <div
      style={{
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        transformOrigin: origin,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** 数字滚动 */
export const CountUp: React.FC<{
  to: number;
  start: number;
  duration?: number;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ to, start, duration = 24, suffix = "", style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, duration);
  return (
    <span style={style}>
      {Math.round(to * p)}
      {suffix}
    </span>
  );
};
